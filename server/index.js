import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import generalRoutes from "./routes/generalRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
// import salesRoutes from "./routes/salesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// import Product from "./models/Product.js";
// import {
//   dataAffiliateStat,
//   dataOverallStat,
//   dataProduct,
//   dataProductStat,
//   dataTransaction,
// } from "./data/index.js";
// import ProductStat from "./models/ProductStat.js";
// import Transaction from "./models/Transaction.js";
// import OverallStat from "./models/OverallStat.js";
// import AffiliateStat from "./models/AffiliateStat.js";
import AuthUser from "./models/AuthUser.js";
import ExcelUpload from "./models/ExcelUpload.js";
import path from 'path';

// CONFIGURATION
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// React build serve karein
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Sare unknown routes par React ka index.html serve karein
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// });

// ROUTES
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Excel Analysis Backend is running!" });
});
app.head("/", (req, res) => {
  res.status(200).end();
});
app.use("/general", generalRoutes);
app.use("/client", clientRoutes);
app.use("/management", managementRoutes);
// app.use("/sales", salesRoutes);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;
console.log("Attempting to connect to MongoDB...");
console.log("MONGO_URL:", process.env.MONGO_URL ? "Set" : "Not set");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
    // Product.insertMany(dataProduct)
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed:");
    console.log(error.message);
  });

// Example for users
const users = await AuthUser.find(); // should match your collection name

// Example for uploads
const uploads = await ExcelUpload.find();
