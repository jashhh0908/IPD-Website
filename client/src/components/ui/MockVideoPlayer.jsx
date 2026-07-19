import { useState, useEffect, useRef } from 'react';

/**
 * Reusable Interactive Mock Video Player
 * @param {Object} props
 * @param {string} props.cameraId
 * @param {string} [props.duration='0:45']
 */
export default function MockVideoPlayer({ cameraId, duration = '0:45' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const timerRef = useRef(null);
  const totalSeconds = 45; // 45 seconds mock duration

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    setCurrentTime(Math.round(percentage * totalSeconds));
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercentage = (currentTime / totalSeconds) * 100;

  return (
    <div className="interactive-player" aria-label={`Telemetry player for ${cameraId}`}>
      <div className="player-screen" onClick={togglePlay}>
        {/* Mock visual elements */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0, 0, 0, 0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          🔴 LIVE FEED RECORDING
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          {cameraId}
        </div>

        {/* Center overlay play button */}
        {!isPlaying && (
          <div className="player-overlay-center" role="presentation">
            ▶
          </div>
        )}

        {/* Overlay showing telemetry tracking bounds when playing */}
        {isPlaying && (
          <div style={{ position: 'absolute', top: '30%', left: '20%', width: '120px', height: '80px', border: '2px solid var(--color-accent-red)', borderRadius: '4px', pointerEvents: 'none' }}>
            <span style={{ position: 'absolute', top: '-18px', left: '0', background: 'var(--color-accent-red)', color: '#fff', fontSize: '8px', padding: '1px 4px', borderRadius: '2px', fontFamily: 'var(--font-mono)' }}>
              VEHICLE_SEDAN [94%]
            </span>
          </div>
        )}
        {isPlaying && (
          <div style={{ position: 'absolute', top: '45%', right: '25%', width: '90px', height: '110px', border: '2px solid var(--color-accent-amber)', borderRadius: '4px', pointerEvents: 'none' }}>
            <span style={{ position: 'absolute', top: '-18px', left: '0', background: 'var(--color-accent-amber)', color: '#000', fontSize: '8px', padding: '1px 4px', borderRadius: '2px', fontFamily: 'var(--font-mono)' }}>
              VEHICLE_AUTO [89%]
            </span>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="player-controls-bar">
        <button 
          onClick={togglePlay}
          style={{ background: 'none', border: 'none', color: 'var(--color-accent-amber)', cursor: 'pointer', padding: 0, width: '20px', textAlign: 'left', fontSize: '14px' }}
          aria-label={isPlaying ? 'Pause telemetry playback' : 'Play telemetry playback'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Mock progress scrubber */}
        <div className="player-scrubber-bg" onClick={handleScrubberClick}>
          <div className="player-scrubber-progress" style={{ width: `${progressPercentage}%` }} />
        </div>

        <div className="player-time">
          {formatSeconds(currentTime)} / {duration}
        </div>
      </div>
    </div>
  );
}
