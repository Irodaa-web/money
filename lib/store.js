import { connectDB } from './db.js';
import { AppError } from './security.js';
import FamilyState from '../models/FamilyState.js';

export function emptyFamily() {
  return {
    tasks: [],
    wallets: {},
    experience: {},
    goals: [],
    transactions: [],
    payouts: [],
    notifications: [],
  };
}

export async function familyStore(
  familyId,
  action,
  readOnly = false
) {
  if (
    typeof familyId !== 'string' ||
    !/^[a-f0-9]{24}$/.test(familyId)
  ) {
    throw new AppError('Oila topilmadi.', 404);
  }

  await connectDB();

  // Boshqa so‘rov oldinroq saqlasa, yangi holatni o‘qib takrorlaymiz.
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const document = await FamilyState.findById(familyId)
      .read('primary')
      .lean();

    const data = document
      ? structuredClone(document.data)
      : emptyFamily();

    // action faqat data bilan ishlashi kerak.
    // Uning ichidan email, to‘lov yoki boshqa tashqi amal bajarmang.
    const result = await action(data);

    if (readOnly) {
      return result;
    }

    // Bu oilaning birinchi saqlanishi.
    if (!document) {
      try {
        await FamilyState.create({
          _id: familyId,
          revision: 0,
          data,
        });

        return result;
      } catch (error) {
        // Shu orada boshqa so‘rov oilani yaratgan bo‘lishi mumkin.
        if (error.code !== 11000) {
          throw error;
        }
      }
    } else {
      // Faqat biz o‘qigan versiya hali o‘zgarmagan bo‘lsa yozamiz.
      const update = await FamilyState.updateOne(
        {
          _id: familyId,
          revision: document.revision,
        },
        {
          $set: { data },
          $inc: { revision: 1 },
        },
        {
          runValidators: true,
        }
      );

      if (update.matchedCount === 1) {
        return result;
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 20 + Math.random() * 40);
    });
  }

  throw new AppError(
    'Bir vaqtda bir nechta o‘zgarish bo‘ldi. Qayta urinib ko‘ring.',
    409
  );
}
