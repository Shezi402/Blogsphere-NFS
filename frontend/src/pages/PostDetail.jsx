import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import Seo from "../components/Seo";
import LazyImage from "../components/LazyImage";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then((res) => {
        console.log("Fetched Post:", res.data.data); // Inspect element console me check karein
        setPost(res.data.data);
      })
      .catch(() => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${slug}`);
      navigate("/");
    } catch {
      setError("Could not delete the post.");
    }
  };

  if (loading) return <p className="container" role="status">Loading…</p>;
  if (error) return <p className="container error">{error}</p>;
  if (!post) return null;

  // Helper to resolve image URL safely
  const rawImagePath = typeof post.coverImage === "string" ? post.coverImage : post.coverImage?.url;
  const imageUrl = rawImagePath
    ? rawImagePath.startsWith("http")
      ? rawImagePath
      : `${API_ORIGIN}${rawImagePath.startsWith("/") ? "" : "/"}${rawImagePath}`
    : null;

  return (
    <main className="container post-detail">
      <Seo title={post.title} description={post.summary} />

      <Link to="/" className="back-link">
        ← Back
      </Link>

      <span className="badge">{post.category}</span>
      <h1>{post.title}</h1>
      <p className="meta">
        {post.author} · {post.readTimeMinutes} min read ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {imageUrl && (
        <LazyImage
          src={imageUrl}
          alt={post.coverImage?.altText || post.title}
          width={800}
          height={420}
          className="cover"
        />
      )}

      <div className="content">{post.content}</div>

      <div className="post-actions">
        <Link to={`/edit/${post.slug}`}>Edit</Link>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </main>
  );
}