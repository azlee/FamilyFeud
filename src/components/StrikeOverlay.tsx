import { useEffect, useState } from 'react';
import './StrikeOverlay.css';

interface StrikeOverlayProps {
  show: boolean;
  strikeCount: number;
  onComplete: () => void;
}

function StrikeOverlay({ show, strikeCount, onComplete }: StrikeOverlayProps) {
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
        <div className={`strike-container strike-count-${strikeCount}`}>
          {Array.from({ length: strikeCount }).map((_, index) => (
            <div key={index} className="strike-x" style={{ animationDelay: `${index * 0.1}s` }}>
              X
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StrikeOverlay;
