import mongoose from 'mongoose';

const familyStateSchema = new mongoose.Schema(
  {
    // Oilaning identifikatori — ota-onaning user ID qiymati.
    _id: {
      type: String,
      required: true,
    },

    revision: {
      type: Number,
      default: 0,
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: false,
    collection: 'family_states',
  }
);

const FamilyState =
  mongoose.models.FamilyState ||
  mongoose.model('FamilyState', familyStateSchema);

export default FamilyState;