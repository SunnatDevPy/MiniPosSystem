export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo ${compact ? "compact" : ""}`}>
      <span className="brand-logo-mark">O</span>
      <div>
        <strong>OkaPos</strong>
        {!compact && <p>Smart Retail POS</p>}
      </div>
    </div>
  );
}
