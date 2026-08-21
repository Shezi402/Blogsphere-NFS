import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <main className="container">
      <Seo title="Page not found" description="The page you're looking for doesn't exist." />
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/">Go home</Link>
    </main>
  );
}
