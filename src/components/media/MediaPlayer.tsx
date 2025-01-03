import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MediaState } from '@/autonomous/MediaActions';

interface MediaPlayerProps {
  url: string;
  onStateChange: (state: MediaState) => void;
  size: {
    width: number;
    height: number;
  };
  controls: {
    canPlay: boolean;
    canPause: boolean;
    canSeek: boolean;
    canAdjustVolume: boolean;
  };
}

const PlayerContainer = styled.div<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${PlayerContainer}:hover & {
    opacity: 1;
  }
`;

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const VolumeControl = styled.input`
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  url,
  onStateChange,
  size,
  controls
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
      onStateChange({
        currentUrl: url,
        isPlaying,
        volume,
        timestamp: video.currentTime
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [url, isPlaying, volume, onStateChange]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <PlayerContainer width={size.width} height={size.height}>
      <Video
        ref={videoRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <Controls>
        {(controls.canPlay || controls.canPause) && (
          <Button onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
        )}
        {controls.canSeek && (
          <ProgressBar
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
          />
        )}
        {controls.canAdjustVolume && (
          <VolumeControl
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        )}
      </Controls>
    </PlayerContainer>
  );
};