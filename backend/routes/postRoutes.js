import express from "express";
import Post from "../models/Post.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET /api/posts?category=&search=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      Post.find(query)
        .select("title slug summary category coverImage author readTimeMinutes createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts
router.post("/", upload.single("coverImage"), async (req, res, next) => {
  try {
    const { title, summary, content, category, author, altText } = req.body;

    const post = new Post({
      title,
      summary,
      content,
      category,
      author,
      coverImage: req.file
        ? { url: `/uploads/${req.file.filename}`, altText: altText || title }
        : undefined,
    });

    const saved = await post.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:slug
router.put("/:slug", upload.single("coverImage"), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.coverImage = { url: `/uploads/${req.file.filename}`, altText: req.body.altText || req.body.title };
    }
    const post = await Post.findOneAndUpdate({ slug: req.params.slug }, updates, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:slug
router.delete("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
