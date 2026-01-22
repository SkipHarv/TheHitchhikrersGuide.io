import React from 'react';

const HomeScreen: React.FC = () => {
  return (
    <div className="screen">
      <div className="dont-panic-container">
        <div className="dont-panic-text">
          DON'T<br />PANIC
        </div>
      </div>
      <div style={{ marginTop: '1rem', color: 'var(--green)', fontSize: '0.6rem', fontFamily: 'Fira Code', opacity: 0.6 }}>
        [ 1-5 ] NAVIGATION READY
      </div>
    </div>
  );
};

export default HomeScreen;