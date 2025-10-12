import './LoadingSkeleton.css';

function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-circle"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
          </div>
        </div>
        <div className="skeleton-text skeleton-line"></div>
        <div className="skeleton-text skeleton-line short"></div>
      </div>

      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-circle"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
          </div>
        </div>
        <div className="skeleton-text skeleton-line"></div>
        <div className="skeleton-text skeleton-line short"></div>
      </div>

      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-circle"></div>
          <div className="skeleton-text-group">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
          </div>
        </div>
        <div className="skeleton-text skeleton-line"></div>
        <div className="skeleton-text skeleton-line short"></div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;