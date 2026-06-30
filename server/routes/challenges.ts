import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { challenges, solutions } from '../db/schema.js';
import {
  authRequired,
  type AppVariables,
} from '../middleware/auth.js';
import { challengeToDict, solutionToDict } from '../db/serializers.js';
import {
  analyzeTextProposal,
  analyzeDiagram,
  evaluateWithAI,
} from '../lib/feedback.js';
import { getGoogleAI } from '../lib/google.js';
import { isSpeechConfigured, transcribeSpeech } from '../lib/speech.js';

export const challengesRouter = new Hono<{ Variables: AppVariables }>();

challengesRouter.get('/api/challenges', authRequired, async (c) => {
  const user = c.get('user');
  const rows = await db
    .select()
    .from(challenges)
    .orderBy(asc(challenges.order), asc(challenges.id));

  // attempt counts (submitted only)
  const counts = new Map<string, number>();
  if (user.uid && user.uid !== 'anonymous') {
    const countRows = await db
      .select({
        challengeId: solutions.challengeId,
        count: sql<number>`count(*)`,
      })
      .from(solutions)
      .where(and(eq(solutions.userId, user.uid), eq(solutions.status, 'submitted')))
      .groupBy(solutions.challengeId);
    for (const r of countRows) counts.set(r.challengeId, Number(r.count));
  }

  const result = rows.map((ch) => ({
    ...challengeToDict(ch),
    attempts_count: counts.get(ch.id) ?? 0,
  }));
  return c.json({ challenges: result });
});

challengesRouter.get('/api/challenges/:id', authRequired, async (c) => {
  const id = c.req.param('id');
  const rows = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Challenge not found' });
  return c.json(challengeToDict(rows[0]));
});

challengesRouter.post('/api/transcribe-audio', authRequired, async (c) => {
  // Dedicated speech-to-text (Google Cloud Speech-to-Text). Unlike a generative
  // model, it transcribes verbatim and never "answers" the speaker.
  if (!isSpeechConfigured()) {
    return c.json({
      transcription:
        '[Transcrição mock] Esta é uma transcrição simulada do áudio. Configure o service account do Firebase e habilite a API "Cloud Speech-to-Text" para habilitar a transcrição real.',
    });
  }
  const t0 = Date.now();
  try {
    // The audio arrives as base64 JSON (NOT multipart/form-data): the JSON body
    // path is the one that works reliably on Vercel's Node runtime, whereas
    // multipart parsing there can hang until the function times out (504).
    const body = await c.req
      .json<{ audio?: string; mimeType?: string }>()
      .catch(() => ({} as any));
    const base64 = typeof body.audio === 'string' ? body.audio : '';
    if (!base64) {
      throw new HTTPException(400, { message: 'No audio data provided' });
    }
    const mimeType = (body.mimeType || 'audio/webm').split(';')[0].trim();
    console.log(`[transcribe] received ${base64.length} b64 chars (${mimeType}) at +${Date.now() - t0}ms`);

    const transcription = await transcribeSpeech(base64, mimeType);
    console.log(`[transcribe] Speech-to-Text responded at +${Date.now() - t0}ms`);
    return c.json({ transcription: (transcription ?? '').trim() });
  } catch (e: any) {
    console.error(`[transcribe] error at +${Date.now() - t0}ms:`, e);
    return c.json({
      transcription: `[Erro na transcrição] Não foi possível transcrever o áudio. Erro: ${e?.message ?? e}`,
    });
  }
});

challengesRouter.post('/api/feedback', authRequired, async (c) => {
  const user = c.get('user');
  const userId = user.uid;
  let userEmail = user.email || `${userId}@email.com`;

  const solution = await c.req.json<{
    challengeId: string;
    textProposal: string;
    diagram: Record<string, any>;
    audioTranscription?: string | null;
  }>();

  const challengeRows = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, solution.challengeId))
    .limit(1);
  if (!challengeRows[0]) throw new HTTPException(404, { message: 'Challenge not found' });
  const challenge = challengeToDict(challengeRows[0]);

  const saveSolution = async (strengths: string[], suggestions: string[]) => {
    try {
      await db.insert(solutions).values({
        challengeId: solution.challengeId,
        userId,
        userEmail,
        textProposal: solution.textProposal,
        diagramData: solution.diagram ? JSON.stringify(solution.diagram) : null,
        audioTranscription: solution.audioTranscription ?? null,
        score: null,
        feedback: JSON.stringify({ strengths, suggestions }),
        status: 'submitted',
      });
    } catch (e) {
      console.error('[feedback] failed to save solution:', e);
    }
  };

  if (getGoogleAI()) {
    const [strengths, suggestions] = await evaluateWithAI(
      challenge,
      solution.textProposal,
      solution.diagram,
      solution.audioTranscription
    );
    if (strengths !== null) {
      await saveSolution(strengths, suggestions as string[]);
      return c.json({ strengths, suggestions });
    }
  }

  // Mock fallback
  const [ts, tsug] = analyzeTextProposal(solution.textProposal);
  const [ds, dsug] = analyzeDiagram(solution.diagram ?? {});
  const allStrengths = [...ts, ...ds];
  const allSuggestions = [...tsug, ...dsug];
  if (allStrengths.length === 0)
    allStrengths.push('Continue praticando! Todo design tem um ponto de partida.');
  await saveSolution(allStrengths, allSuggestions);
  return c.json({ strengths: allStrengths, suggestions: allSuggestions });
});

challengesRouter.post('/api/challenges/:id/progress', authRequired, async (c) => {
  const user = c.get('user');
  const challengeId = c.req.param('id');
  const userEmail = user.email || `${user.uid}@email.com`;
  const body = await c.req.json<{
    step0?: string;
    step1?: string;
    step2?: string;
    step3?: string;
    diagram?: Record<string, any>;
    audioTranscription?: string | null;
  }>();

  const challengeRows = await db
    .select({ id: challenges.id })
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);
  if (!challengeRows[0]) throw new HTTPException(404, { message: 'Challenge not found' });

  const existing = await db
    .select()
    .from(solutions)
    .where(
      and(
        eq(solutions.challengeId, challengeId),
        eq(solutions.userId, user.uid),
        eq(solutions.status, 'draft')
      )
    )
    .limit(1);

  const diagramData = body.diagram ? JSON.stringify(body.diagram) : null;
  let draft;
  if (existing[0]) {
    const updated = await db
      .update(solutions)
      .set({
        step0Content: body.step0 ?? '',
        step1Content: body.step1 ?? '',
        step2Content: body.step2 ?? '',
        step3Content: body.step3 ?? '',
        diagramData,
        audioTranscription: body.audioTranscription ?? null,
        userEmail,
        updatedAt: new Date(),
      })
      .where(eq(solutions.id, existing[0].id))
      .returning();
    draft = updated[0];
  } else {
    const inserted = await db
      .insert(solutions)
      .values({
        challengeId,
        userId: user.uid,
        userEmail,
        step0Content: body.step0 ?? '',
        step1Content: body.step1 ?? '',
        step2Content: body.step2 ?? '',
        step3Content: body.step3 ?? '',
        diagramData,
        audioTranscription: body.audioTranscription ?? null,
        status: 'draft',
      })
      .returning();
    draft = inserted[0];
  }
  return c.json({ success: true, message: 'Progress saved', draft: solutionToDict(draft) });
});

challengesRouter.get('/api/challenges/:id/progress', authRequired, async (c) => {
  const user = c.get('user');
  const challengeId = c.req.param('id');
  const rows = await db
    .select()
    .from(solutions)
    .where(
      and(
        eq(solutions.challengeId, challengeId),
        eq(solutions.userId, user.uid),
        eq(solutions.status, 'draft')
      )
    )
    .limit(1);
  if (rows[0]) return c.json({ hasProgress: true, draft: solutionToDict(rows[0]) });
  return c.json({ hasProgress: false, draft: null });
});

challengesRouter.delete('/api/challenges/:id/progress', authRequired, async (c) => {
  const user = c.get('user');
  const challengeId = c.req.param('id');
  const deleted = await db
    .delete(solutions)
    .where(
      and(
        eq(solutions.challengeId, challengeId),
        eq(solutions.userId, user.uid),
        eq(solutions.status, 'draft')
      )
    )
    .returning();
  if (deleted.length > 0)
    return c.json({ success: true, message: 'Progress reset successfully' });
  return c.json({ success: false, message: 'No progress found to reset' });
});

challengesRouter.get('/api/challenges/:id/solutions', authRequired, async (c) => {
  const user = c.get('user');
  const challengeId = c.req.param('id');
  const limit = Number(c.req.query('limit') ?? '10');
  const rows = await db
    .select()
    .from(solutions)
    .where(
      and(
        eq(solutions.challengeId, challengeId),
        eq(solutions.userId, user.uid),
        eq(solutions.status, 'submitted')
      )
    )
    .orderBy(desc(solutions.createdAt))
    .limit(limit);
  return c.json({ solutions: rows.map(solutionToDict) });
});
