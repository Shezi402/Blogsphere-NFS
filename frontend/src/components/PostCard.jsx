import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/post/${post.slug}`}>
        <LazyImage
          src={post.coverImage?.url ? `${API_ORIGIN}${post.coverImage.url}` : "/placeholder.svg"}
          alt={post.coverImage?.altText || post.title}
        />
        <div className="post-card-body">
          <span className="badge">{post.category}</span>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <span className="meta">
            {post.author} · {post.readTimeMinutes} min read
          </span>
        </div>
      </Link>
    </article>
  );
}
