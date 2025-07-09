import mongoose from "mongoose";

const AnalysisHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  analysisType: { type: String, required: true },
  inputFile: { type: String }, // file name or id
  resultSummary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const AnalysisHistory = mongoose.model("AnalysisHistory", AnalysisHistorySchema);

export default AnalysisHistory; 