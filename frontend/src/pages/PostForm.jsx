import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";

const CATEGORIES = ["Tech", "Lifestyle", "Business", "Education", "Other"];
const EMPTY = { title: "", summary: "", content: "", category: "Tech", author: "", altText: "" };

export default function PostForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/posts/${slug}`).then((res) => {
      const p = res.data.data;
      setForm({
        title: p.title,
        summary: p.summary,
        content: p.content,
        category: p.category,
        author: p.author,
        altText: p.coverImage?.altText || "",
      });
    });
  }, [slug, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.title.length > 120) e.title = "Title must be under 120 characters.";
    if (!form.summary.trim()) e.summary = "Summary is required.";
    if (form.summary.length > 200) e.summary = "Summary must be under 200 characters.";
    if (!form.content.trim() || form.content.trim().length < 20)
      e.content = "Content must be at least 20 characters.";
    if (!form.author.trim()) e.author = "Author name is required.";
    if (file && !form.altText.trim()) e.altText = "Alt text is required for accessibility & SEO.";
    return e;
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setServerError("");

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("coverImage", file);

    try {
      if (isEdit) {
        await api.put(`/posts/${slug}`, data);
        navigate(`/post/${slug}`);
      } else {
        const res = await api.post("/posts", data);
        navigate(`/post/${res.data.data.slug}`);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <Seo title={isEdit ? "Edit post" : "Write a post"} description="Create or edit an article on BlogSphere." />
      <h1>{isEdit ? "Edit post" : "Write a new post"}</h1>

      <form onSubmit={handleSubmit} noValidate className="post-form">
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Summary
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          {errors.summary && <span className="field-error">{errors.summary}</span>}
        </label>

        <label>
          Content
          <textarea
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          {errors.content && <span className="field-error">{errors.content}</span>}
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Author name
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          {errors.author && <span className="field-error">{errors.author}</span>}
        </label>

        <label>
          Cover image
          <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFile} />
        </label>

        {preview && <img src={preview} alt="Preview" width={200} height={120} className="preview" />}

        <label>
          Image alt text
          <input
            value={form.altText}
            onChange={(e) => setForm({ ...form, altText: e.target.value })}
            placeholder="Describe the image for screen readers"
          />
          {errors.altText && <span className="field-error">{errors.altText}</span>}
        </label>

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
        </button>
      </form>
    </main>
  );
}
