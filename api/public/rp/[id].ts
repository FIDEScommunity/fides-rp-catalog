/**
 * GET /api/public/rp/:id
 * Returns one relying party by catalog id (e.g. air-new-zealand). Encode reserved characters in the path.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadRPData } from '../../../lib/aggregatedData';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({
      message: 'Method not allowed',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const idRaw = req.query.id;
  const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
  if (typeof idParam !== 'string' || !idParam.length) {
    res.status(400).json({
      message: 'Missing relying party id',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  let id: string;
  try {
    id = decodeURIComponent(idParam);
  } catch {
    res.status(400).json({
      message: 'Invalid relying party id encoding',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const data = loadRPData();
  const rp = data.relyingParties.find((r) => r.id === id);

  if (!rp) {
    res.status(404).json({
      message: 'Relying party not found',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json(rp);
}
