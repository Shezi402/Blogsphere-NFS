import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lighthouse fix: route-level code splitting so the initial JS bundle
// only ships what the Home page needs ("Reduce unused JavaScript").
const Home = lazy(() => import("./pages/Home"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const PostForm = lazy(() => import("./pages/PostForm"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="container" role="status">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:slug" element={<PostForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
