const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, default: 0 },
    image:{type:String},
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Liên kết với User (giảng viên)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
