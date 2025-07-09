import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import ExcelUpload from "../models/ExcelUpload.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const uploadDoc = new ExcelUpload({
      user: userId,
      originalFileName: req.file.originalname,
      data,
    });
    await uploadDoc.save();
    res.status(201).json({ msg: "File uploaded and data saved", upload: uploadDoc });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /upload/history/:userId
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const uploads = await ExcelUpload.find({ user: userId }).sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router; 