import { useEffect, useState } from "react";
import api from "../api/client";
import Seo from "../components/Seo";
import PostCard from "../components/PostCard";

const CATEGORIES = ["All", "Tech", "Lifestyle", "Business", "Education", "Other"];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    api
      .get("/posts", { params: { category, search }, signal: controller.signal })
      .then((res) => setPosts(res.data.data))
      .catch((err) => {
        if (err.name !== "CanceledError") setError("Could not load posts. Please try again.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, search]);

  return (
    <main className="container">
      <Seo
        title="Home"
        description="Browse the latest articles on BlogSphere across tech, lifestyle, business, and education."
      />

      <section className="hero">
        <h1>Ideas worth reading</h1>
        <p>Short, focused articles from a small community of writers.</p>
      </section>

      <div className="filters">
        <input
          type="search"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search posts"
        />
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={c === category ? "chip active" : "chip"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p role="status">Loading posts…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>No posts found.</p>}

      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
