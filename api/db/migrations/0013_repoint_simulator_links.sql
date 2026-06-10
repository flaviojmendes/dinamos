-- Repoint in-content simulator links to the canonical CMS auto-route URLs
-- (`<page.path>/simulator`). The legacy Portuguese `/simulador` routes and the
-- mismatched availability `/principios-design/disponibilidade/simulator` route
-- were removed from src/App.tsx; these lessons now resolve their simulators via
-- the simulator_key auto-routes. Idempotent: REPLACE is a no-op once applied.
UPDATE "content_pages" SET
  "body_pt" = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    "body_pt",
    '/principios-design/disponibilidade/simulator', '/principios-design/disponibilidade/zonas/simulator'),
    '/estrategias-de-consistencia/consenso/simulador', '/estrategias-de-consistencia/consenso/simulator'),
    '/estrategias-de-consistencia/lamport-timestamps/simulador', '/estrategias-de-consistencia/lamport-timestamps/simulator'),
    '/estrategias-de-consistencia/two-phase-commit/simulador', '/estrategias-de-consistencia/two-phase-commit/simulator'),
    '/estrategias-de-consistencia/sincronizacao/simulador', '/estrategias-de-consistencia/sincronizacao/simulator'),
    '/seguranca/criptografia/simulador', '/seguranca/criptografia/simulator'),
    '/seguranca/tokens/simulador', '/seguranca/tokens/simulator'),
    '/seguranca/ataques/simulador', '/seguranca/ataques/simulator'),
    '/seguranca/prompt-injection/simulador', '/seguranca/prompt-injection/simulator'),
  "body_en" = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    "body_en",
    '/principios-design/disponibilidade/simulator', '/principios-design/disponibilidade/zonas/simulator'),
    '/estrategias-de-consistencia/consenso/simulador', '/estrategias-de-consistencia/consenso/simulator'),
    '/estrategias-de-consistencia/lamport-timestamps/simulador', '/estrategias-de-consistencia/lamport-timestamps/simulator'),
    '/estrategias-de-consistencia/two-phase-commit/simulador', '/estrategias-de-consistencia/two-phase-commit/simulator'),
    '/estrategias-de-consistencia/sincronizacao/simulador', '/estrategias-de-consistencia/sincronizacao/simulator'),
    '/seguranca/criptografia/simulador', '/seguranca/criptografia/simulator'),
    '/seguranca/tokens/simulador', '/seguranca/tokens/simulator'),
    '/seguranca/ataques/simulador', '/seguranca/ataques/simulator'),
    '/seguranca/prompt-injection/simulador', '/seguranca/prompt-injection/simulator'),
  "updated_at" = now()
WHERE "body_pt" LIKE '%/simulador%' OR "body_en" LIKE '%/simulador%'
   OR "body_pt" LIKE '%/principios-design/disponibilidade/simulator%'
   OR "body_en" LIKE '%/principios-design/disponibilidade/simulator%';
