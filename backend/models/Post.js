import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      maxlength: [200, "Summary cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Tech", "Lifestyle", "Business", "Education", "Other"],
      default: "Other",
    },
    coverImage: {
      url: { type: String, default: "" },
      altText: { type: String, default: "" },
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    readTimeMinutes: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString(36);
  }
  next();
});

export default mongoose.model("Post", postSchema);
