const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String }, // Link video bài giảng
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true } // Liên kết với khóa học
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
