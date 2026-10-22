const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profile: { type: mongoose.Schema.Types.Mixed, required: true },
    riskScore: { type: Number, required: true },
    riskCategory: { type: String, required: true },
    riskFactors: { type: [mongoose.Schema.Types.Mixed], default: [] },
    recommendations: { type: [mongoose.Schema.Types.Mixed], default: [] },
    aiExplanation: { type: String, default: '' },
    healthScore: { type: Number },
    exposureIndex: { type: Number },
    aqi: { type: Number },
    location: {
      city: { type: String, default: '' },
      area: { type: String, default: '' },
    },
    assessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);
