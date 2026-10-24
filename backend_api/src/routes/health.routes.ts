import { Router, Request, Response } from 'express';
import { config } from '../config/env';

const router = Router();

/**
 * GET /api/v1/health
 *
 * NOTE ON RESPONSE CONTRACT:
 * This monitoring endpoint intentionally returns `{ status: 'ok', service: ..., ... }`
 * rather than the application's standard `{ success: true, data: ... }` envelope.
 *
 * Rationale:
 * Standard cloud infrastructure tools, Docker HEALTHCHECK directives, Kubernetes
 * liveness/readiness probes, and uptime monitors (e.g. Pingdom, Datadog) expect a root
 * `status: "ok"` property according to RFC health check specifications (IETF draft).
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Last Option Backend API',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;
