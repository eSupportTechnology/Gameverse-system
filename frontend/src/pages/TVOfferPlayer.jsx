import { useRef, useEffect } from "react";

export default function TVOfferPlayer({ videoUrl, onDone }) {
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  //30s only when video plays
  const handlePlay = () => {
    clearTimer();

    timerRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (onDone) onDone();
    }, 30000);
  };

  const handleVideoEnd = () => {
    clearTimer();
    if (onDone) onDone();
  };

  const handleError = () => {
    console.error("Video failed to load:", videoUrl);
    clearTimer();
    if (onDone) onDone();
  };

  useEffect(() => {
    return () => clearTimer();
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      autoPlay
      muted
      playsInline
      onPlay={handlePlay} 
      onEnded={handleVideoEnd}
      onError={handleError}
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
      }}
    />
  );
}
