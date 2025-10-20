import mongoose from 'mongoose';

const ResetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, index: true },
    status: { type: String, enum: ['pending', 'done', 'rejected'], default: 'pending', index: true },
    requestedAt: { type: Date, default: Date.now },
    handledAt: { type: Date },
    handledBy: { type: String } // superadmin email
  },
  { timestamps: true }
);

export const Reset = mongoose.model('Reset', ResetSchema);
