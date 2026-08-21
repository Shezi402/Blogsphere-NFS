import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        BlogSphere
      </Link>
      <nav>
        <Link to="/create">Write a post</Link>
      </nav>
    </header>
  );
}
