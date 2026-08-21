import { Helmet } from "react-helmet-async";

// Central SEO component — every page sets its own title + meta description.
// This is the "basic SEO essentials" requirement: unique per-page titles/descriptions.
export default function Seo({ title, description }) {
  const fullTitle = title ? `${title} | BlogSphere` : "BlogSphere";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || "BlogSphere — read and publish short articles."} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || "BlogSphere"} />
    </Helmet>
  );
}
