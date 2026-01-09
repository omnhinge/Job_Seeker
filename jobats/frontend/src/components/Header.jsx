import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <h1>🎯 ATS Resume Analyzer</h1>
        <nav>
          <a
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '20px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Home
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;