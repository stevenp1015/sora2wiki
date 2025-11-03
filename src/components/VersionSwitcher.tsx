import React from 'react';
import { useSoraVersion } from '../contexts/SoraVersionContext';

const VersionSwitcher: React.FC = () => {
  const { version, setVersion } = useSoraVersion();

  return (
    <div className="version-switcher">
      <button
        className={`version-btn ${version === 'sora1' ? 'active' : ''}`}
        onClick={() => setVersion('sora1')}
      >
        Sora 1
      </button>
      <button
        className={`version-btn ${version === 'sora2' ? 'active' : ''}`}
        onClick={() => setVersion('sora2')}
      >
        Sora 2
      </button>
      <style>{`
        .version-switcher {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 8px;
          margin: 16px 0;
        }
        .version-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-weight: 500;
        }
        .version-btn.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }
      `}</style>
    </div>
  );
};

export default VersionSwitcher;
