import React from 'react';
import { useSoraVersion } from '../../contexts/SoraVersionContext';
import styles from './VersionSwitcher.module.css';

const VersionSwitcher: React.FC = () => {
  const { version, setVersion } = useSoraVersion();

  return (
    <div className={styles.versionSwitcher}>
      <button
        className={version === 'sora1' ? styles.versionButtonActive : styles.versionButton}
        onClick={() => setVersion('sora1')}
        aria-pressed={version === 'sora1'}
      >
        Sora 1
      </button>
      <button
        className={version === 'sora2' ? styles.versionButtonActive : styles.versionButton}
        onClick={() => setVersion('sora2')}
        aria-pressed={version === 'sora2'}
      >
        Sora 2
      </button>
    </div>
  );
};

export default VersionSwitcher;
