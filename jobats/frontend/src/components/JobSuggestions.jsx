import React from 'react';

const JobSuggestions = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="card">
        <h2>Job Suggestions</h2>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💼</div>
          <p style={{ fontSize: '16px' }}>No job suggestions available yet.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Upload and analyze your resume to get personalized job recommendations.
          </p>
        </div>
      </div>
    );
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'var(--success-color)';
    if (percentage >= 60) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '10px' }}>Recommended Jobs for You</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Based on your skills and experience, here are the best job matches
      </p>

      <div className="job-list">
        {jobs.map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-header">
              <div>
                <h3 className="job-title">{job.title}</h3>
              </div>
              <span
                className="match-badge"
                style={{ backgroundColor: getMatchColor(job.matchPercentage) }}
              >
                {job.matchPercentage}% Match
              </span>
            </div>
            <p className="job-reason">
              <strong>Why this matches:</strong> {job.reason}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f0fdf4',
        borderRadius: '8px',
        borderLeft: '4px solid var(--success-color)'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--success-color)' }}>✨ Next Steps</h4>
        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
          Ready to apply? Tailor your resume for each position by incorporating specific keywords
          and highlighting relevant experiences. Consider generating a career development plan
          for your target role!
        </p>
      </div>
    </div>
  );
};

export default JobSuggestions;