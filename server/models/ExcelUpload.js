import mongoose from "mongoose";

const ExcelUploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AuthUser", required: true },
  originalFileName: { type: String, required: true },
  data: { type: Array, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const ExcelUpload = mongoose.model("ExcelUpload", ExcelUploadSchema);
export default ExcelUpload; 