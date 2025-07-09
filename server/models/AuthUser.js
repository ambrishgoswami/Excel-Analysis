import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const AuthUser = mongoose.model("AuthUser", AuthUserSchema);
export default AuthUser; 