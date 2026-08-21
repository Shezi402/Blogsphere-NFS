// Lighthouse fix: images use loading="lazy", explicit width/height (avoids
// layout shift / CLS), and always require meaningful alt text (accessibility + SEO).
export default function LazyImage({ src, alt, width = 400, height = 220, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/placeholder.svg";
      }}
    />
  );
}
