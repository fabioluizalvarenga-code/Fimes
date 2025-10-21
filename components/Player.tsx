
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon, FullscreenEnterIcon, FullscreenExitIcon, XIcon, PhotoIcon } from './icons';

interface PlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
  onUpdateCoverRequest: () => void;
}

const Player: React.FC<PlayerProps> = ({ videoUrl, title, onClose, onUpdateCoverRequest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    videoRef.current?.play().catch(error => {
        console.error("Autoplay was prevented: ", error);
        setIsPlaying(false);
    });
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const hideControls = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    hideControls();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const setVideoDuration = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    hideControls();

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if(videoRef.current) videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }
  };
  
  const handleProgressSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if(progressRef.current && videoRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        playerRef.current?.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div 
      ref={playerRef} 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video ref={videoRef} src={videoUrl} className="w-full h-full" onClick={togglePlay} />
      
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-white text-xl font-bold truncate flex-1">{title}</h2>
            <button 
                onClick={onUpdateCoverRequest} 
                className="text-white p-2 rounded-full hover:bg-white/20 flex items-center gap-2"
                title="Alterar capa do filme"
            >
                <PhotoIcon />
            </button>
            <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/20">
              <XIcon />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            {/* Progress Bar */}
            <div ref={progressRef} onClick={handleProgressSeek} className="w-full h-1.5 bg-white/30 cursor-pointer group flex items-center">
                <div style={{width: `${progress}%`}} className="bg-yellow-500 h-full relative">
                  <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between mt-2 text-white">
                <div className="flex items-center gap-4">
                    <button onClick={togglePlay}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <div className="flex items-center gap-2 group">
                        <button onClick={toggleMute}>
                            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-0 group-hover:w-24 transition-all duration-300 h-1 accent-yellow-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    <button onClick={toggleFullscreen}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
