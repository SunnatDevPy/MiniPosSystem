import BrandLogo from "./BrandLogo";

export default function LoadingScreen({ text }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-card">
        <BrandLogo />
        <p>{text}</p>
        <div className="loading-track">
          <span className="loading-bar" />
        </div>
      </div>
    </div>
  );
}
