const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Học viên
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Khóa học
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" } // Trạng thái khóa học
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
