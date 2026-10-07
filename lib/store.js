import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { AppError } from './security.js';

export const emptyFamily = () => ({ tasks: [], wallets: {}, goals: [], transactions: [], payouts: [], notifications: [] });
// All state changes for one family share an OS directory lock and one atomic rename.
// This prevents duplicate rewards, partial writes and concurrent read-modify-write loss.
export async function familyStore(familyId, action, readOnly = false) {
  if (!/^[a-f0-9]{24}$/.test(familyId)) throw new AppError('Oila topilmadi.', 404);
  const dir = path.resolve(/* turbopackIgnore: true */ process.env.DATA_DIR || '.data');
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, `${familyId}.json`);
  const lock = `${file}.lock`;
  const started = Date.now();
  while (true) {
    try { await mkdir(lock); break; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() - started > 5000) throw new AppError('Ma’lumot band. Bir necha soniyadan keyin qayta urinib ko‘ring.', 503);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  }
  let temp;
  try {
    let data;
    try { data = JSON.parse(await readFile(file, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; data = emptyFamily(); }
    const result = await action(data);
    if (!readOnly) {
      temp = `${file}.${randomUUID()}.tmp`;
      await writeFile(temp, JSON.stringify(data), { mode: 0o600 });
      await rename(temp, file);
    }
    return result;
  } finally {
    if (temp) await rm(temp, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}
