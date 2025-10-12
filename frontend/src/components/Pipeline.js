import './Pipeline.css';

function Pipeline({ applications, onStatusChange }) {
  const stages = [
    { key: 'wishlist', label: 'Wishlist', emoji: '📋', color: '#718096' },
    { key: 'applied', label: 'Applied', emoji: '📤', color: '#3182ce' },
    { key: 'phone_screen', label: 'Phone Screen', emoji: '📞', color: '#805ad5' },
    { key: 'technical', label: 'Technical', emoji: '💻', color: '#d69e2e' },
    { key: 'onsite', label: 'Onsite', emoji: '🏢', color: '#dd6b20' },
    { key: 'offer', label: 'Offer', emoji: '✅', color: '#38a169' },
  ];

  const getApplicationsByStage = (stage) => {
    return applications.filter(app => app.status === stage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (applications.length === 0) {
    return (
      <div className="pipeline-empty">
        <p>🎯 Add applications to see them in the pipeline!</p>
      </div>
    );
  }

  return (
    <div className="pipeline-container">
      <h2 className="pipeline-title">🎯 Application Pipeline</h2>
      
      <div className="pipeline-board">
        {stages.map(stage => {
          const stageApps = getApplicationsByStage(stage.key);
          
          return (
            <div key={stage.key} className="pipeline-column">
              <div className="column-header" style={{ background: stage.color }}>
                <span className="column-emoji">{stage.emoji}</span>
                <span className="column-title">{stage.label}</span>
                <span className="column-count">{stageApps.length}</span>
              </div>
              
              <div className="column-content">
                {stageApps.length === 0 ? (
                  <div className="column-empty">
                    <p>No applications</p>
                  </div>
                ) : (
                  stageApps.map(app => (
                    <div key={app.id} className="pipeline-card">
                      <div className="pipeline-card-header">
                        {app.logoUrl && (
                          <img 
                            src={app.logoUrl} 
                            alt={`${app.company} logo`}
                            className="pipeline-logo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="pipeline-card-info">
                          <h4>{app.company}</h4>
                          <p>{app.position}</p>
                        </div>
                      </div>
                      
                      {app.location && (
                        <div className="pipeline-detail">
                          <span className="detail-icon">📍</span>
                          <span>{app.location}</span>
                        </div>
                      )}
                      
                      <div className="pipeline-detail">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(app.dateApplied)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pipeline;