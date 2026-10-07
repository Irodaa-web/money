import { copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
try {
  await copyFile('.env.example', '.env.local', constants.COPYFILE_EXCL);
  console.log('.env.local tayyor. MongoDB serverini ishga tushiring, so‘ng npm run dev.');
} catch (error) {
  if (error.code === 'EEXIST') console.log('.env.local mavjud, o‘zgartirilmadi.');
  else throw error;
}
