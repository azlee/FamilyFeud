import { useEffect, useState } from 'react';
import './StrikeOverlay.css';

interface StrikeOverlayProps {
  show: boolean;
  onComplete: () => void;
}

function StrikeOverlay({ show, onComplete }: StrikeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1500); // Show for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="strike-overlay">
      <div className="strike-animation">
        <div className="strike-x">X</div>
      </div>
    </div>
  );
}

export default StrikeOverlay;
