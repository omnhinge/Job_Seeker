import React from 'react';

const ATSScore = ({ score, breakdown }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreAdvice = (score) => {
    if (score >= 80) return 'Your resume is well-optimized for ATS systems!';
    if (score >= 60) return 'Your resume is decent but could be improved.';
    if (score >= 40) return 'Consider optimizing your resume for better ATS compatibility.';
    return 'Your resume needs significant improvements to pass ATS filters.';
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>ATS Score Analysis</h2>

      <div className="score-container">
        <div
          className="score-circle"
          style={{ '--score': score }}
        >
          <span className="score-value" style={{ color: getScoreColor(score) }}>
            {score}
          </span>
        </div>

        <h3 style={{ color: getScoreColor(score), marginBottom: '10px' }}>
          {getScoreLabel(score)}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          {getScoreAdvice(score)}
        </p>
      </div>

      {breakdown && (
        <>
          <hr style={{ margin: '40px 0', border: 'none', borderTop: '2px solid var(--border-color)' }} />

          <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Score Breakdown</h3>

          <div className="score-breakdown">
            <div className="score-item">
              <h4>Formatting</h4>
              <div className="value">{Math.round(breakdown.formatting || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Contact info & structure
              </p>
            </div>
            <div className="score-item">
              <h4>Keywords</h4>
              <div className="value">{Math.round(breakdown.keywords || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Technical & industry terms
              </p>
            </div>
            <div className="score-item">
              <h4>Experience</h4>
              <div className="value">{Math.round(breakdown.experience || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Work history details
              </p>
            </div>
            <div className="score-item">
              <h4>Education</h4>
              <div className="value">{Math.round(breakdown.education || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Academic credentials
              </p>
            </div>
            <div className="score-item">
              <h4>Skills</h4>
              <div className="value">{Math.round(breakdown.skills || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Listed competencies
              </p>
            </div>
          </div>
        </>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>💡 Quick Tips</h4>
        <ul style={{ marginLeft: '20px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
          <li>Use standard section headings (Experience, Education, Skills)</li>
          <li>Include relevant keywords from job descriptions</li>
          <li>Quantify achievements with numbers and metrics</li>
          <li>Keep formatting simple and ATS-friendly</li>
          <li>Save and submit as PDF format</li>
        </ul>
      </div>
    </div>
  );
};

export default ATSScore;