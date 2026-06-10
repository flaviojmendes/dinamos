import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'https://dinamos.net';

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(RESEND_API_KEY);
  return resend;
}

export async function sendForumReplyNotification(params: {
  topicAuthorEmail: string;
  topicAuthorNickname: string;
  topicTitle: string;
  topicId: number;
  replyAuthorNickname: string;
}): Promise<boolean> {
  const client = getResend();
  if (!client || !params.topicAuthorEmail?.trim()) return false;
  const topicUrl = `${FRONTEND_URL}/forum/topic/${params.topicId}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#000;color:#fff;padding:20px;border-radius:8px 8px 0 0}
    .content{background:#f9fafb;padding:20px;border-radius:0 0 8px 8px}
    .button{display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:20px}
  </style></head><body>
    <div class="header"><img src="https://www.dinamos.net/logo.png" style="height:50px" alt="Dinamos"><h1>Nova Resposta no Fórum</h1></div>
    <div class="content"><p>Olá <strong>${params.topicAuthorNickname}</strong>,</p>
    <p><strong>${params.replyAuthorNickname}</strong> respondeu ao seu tópico:</p>
    <h2 style="color:#000">${params.topicTitle}</h2>
    <a href="${topicUrl}" class="button">Clique aqui para ver a resposta</a></div>
  </body></html>`;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: [params.topicAuthorEmail],
      subject: `Nova resposta: ${params.topicTitle}`,
      html,
    });
    return true;
  } catch (e) {
    console.error('[email] forum reply notification failed:', e);
    return false;
  }
}

export async function sendMessageReplyNotification(params: {
  messageAuthorEmail: string;
  messageAuthorNickname: string;
  topicTitle: string;
  topicId: number;
  replyAuthorNickname: string;
  replyContent: string;
  parentMessageContent: string;
}): Promise<boolean> {
  const client = getResend();
  if (!client || !params.messageAuthorEmail?.trim()) return false;
  const topicUrl = `${FRONTEND_URL}/forum/topic/${params.topicId}`;
  const replyPreview =
    params.replyContent.length > 200
      ? params.replyContent.slice(0, 200) + '...'
      : params.replyContent;
  const parentPreview =
    params.parentMessageContent.length > 150
      ? params.parentMessageContent.slice(0, 150) + '...'
      : params.parentMessageContent;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}
    .header{background:#000;color:#fff;padding:20px;border-radius:8px 8px 0 0}
    .content{background:#f9fafb;padding:20px;border-radius:0 0 8px 8px}
    .button{display:inline-block;background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:20px}
    .quote{background:#e5e7eb;border-left:4px solid #6b7280;padding:12px;margin:16px 0;border-radius:4px;font-style:italic}
  </style></head><body>
    <div class="header"><img src="https://www.dinamos.net/logo.png" style="height:50px" alt="Dinamos"><h1>Nova Resposta ao Seu Comentário</h1></div>
    <div class="content"><p>Olá <strong>${params.messageAuthorNickname}</strong>,</p>
    <p><strong>${params.replyAuthorNickname}</strong> respondeu ao seu comentário no tópico:</p>
    <h2 style="color:#000">${params.topicTitle}</h2>
    <div class="quote"><strong>Seu comentário:</strong><br>${parentPreview}</div>
    <p><strong>Resposta de ${params.replyAuthorNickname}:</strong></p><p>${replyPreview}</p>
    <a href="${topicUrl}" class="button">Clique aqui para ver a resposta completa</a></div>
  </body></html>`;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: [params.messageAuthorEmail],
      subject: `Nova resposta ao seu comentário: ${params.topicTitle}`,
      html,
    });
    return true;
  } catch (e) {
    console.error('[email] message reply notification failed:', e);
    return false;
  }
}

export async function sendSystemNotificationEmail(params: {
  recipientEmail: string;
  recipientNickname: string;
  subject: string;
  title: string;
  message: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
}): Promise<boolean> {
  const client = getResend();
  if (!client || !params.recipientEmail?.trim()) return false;

  const ctaHtml =
    params.ctaText && params.ctaUrl
      ? `<div style="text-align:center;margin-top:32px">
           <a href="${params.ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">${params.ctaText}</a>
         </div>`
      : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.7;color:#1f2937;margin:0;padding:0;background:#f3f4f6}
    .wrapper{max-width:600px;margin:0 auto;padding:40px 20px}
    .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}
    .header{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;padding:32px 24px;text-align:center}
    .header h1{margin:0;font-size:24px;font-weight:700;letter-spacing:-.025em}
    .content{padding:32px 24px}
    .greeting{font-size:18px;color:#374151;margin-bottom:24px}
    .greeting strong{color:#0ea5e9}
    .message{font-size:16px;color:#4b5563;line-height:1.8;white-space:pre-wrap}
    .divider{height:1px;background:linear-gradient(to right,transparent,#e5e7eb,transparent);margin:24px 0}
    .footer{text-align:center;padding:24px;color:#9ca3af;font-size:14px}
    .footer a{color:#6366f1;text-decoration:none}
    .badge{display:inline-block;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);color:#92400e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}
  </style></head><body>
    <div class="wrapper"><div class="card">
      <div class="header"><img src="https://www.dinamos.net/logo.png" style="height:45px;margin-bottom:16px" alt="Dinamos"><div class="badge">Mensagem do Sistema</div><h1>${params.title}</h1></div>
      <div class="content"><p class="greeting">Olá <strong>${params.recipientNickname}</strong>,</p><div class="message">${params.message}</div>${ctaHtml}</div>
      <div class="divider"></div>
      <div class="footer"><p>Esta é uma mensagem automática do <a href="${FRONTEND_URL}">Dinamos</a>.</p></div>
    </div></div>
  </body></html>`;

  try {
    await client.emails.send({
      from: FROM_EMAIL,
      to: [params.recipientEmail],
      subject: params.subject,
      html,
    });
    return true;
  } catch (e) {
    console.error('[email] system notification failed:', e);
    return false;
  }
}
