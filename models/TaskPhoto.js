import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  familyId: { type: String, required: true, index: true },
  childId: { type: String, required: true },
  taskId: { type: String, required: true },
  bytes: { type: Buffer, required: true, select: false },
  contentType: { type: String, default: 'image/jpeg' },
  // Only abandoned uploads expire. Committed task evidence has no TTL.
  expiresAt: { type: Date, default: () => new Date(Date.now() + 86400000) },
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.models.TaskPhoto || mongoose.model('TaskPhoto', schema);
