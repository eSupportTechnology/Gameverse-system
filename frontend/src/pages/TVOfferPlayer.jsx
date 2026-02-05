import { useRef, useEffect } from "react";

export default function TVOfferPlayer({
  url,
  type,  
  onDone,
  duration = 30000,
}) {
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();
      onDone && onDone();
    }, duration);
  };

  useEffect(() => {
    return () => clearTimer();
  }, [url]);

  if (type === "video") {
    return (
      <video
        ref={videoRef}
        src={url}
        autoPlay
        muted
        playsInline
        onPlay={startTimer}
        onEnded={() => {
          clearTimer();
          onDone && onDone();
        }}
        onError={() => {
          console.error("Video failed to load:", url);
          clearTimer();
          onDone && onDone();
        }}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <img
      src={url}
      alt="TV Offer"
      onLoad={startTimer}
      onError={() => {
        console.error("Image failed to load:", url);
        clearTimer();
        onDone && onDone();
      }}
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
      }}
    />
  );
}
