import React from 'react';

const WarningScreen: React.FC = () => {
  return (
    <div className="screen" style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'var(--red)', fontSize: '0.9rem', maxWidth: '80%' }}>
        PLEASE DO NOT PRESS THIS BUTTON AGAIN
      </h1>
      <div style={{ marginTop: '1rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 10px var(--red)', margin: '0 auto' }}></div>
    </div>
  );
};

export default WarningScreen;