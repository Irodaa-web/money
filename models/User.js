import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 60 },
  username: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['parent', 'child'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  onboarded: { type: Boolean, default: false },
  telegram: { chatId: String, username: String, linkedAt: Date, linkHash: String, linkExpiresAt: Date },
  sessions: [{ _id: false, hash: String, expiresAt: Date }],
  invitations: [{ _id: false, hash: String, expiresAt: Date }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
