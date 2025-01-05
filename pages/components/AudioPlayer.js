"use client";

import { useRef, useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa"; // Import icons

const AudioPlayer = () => {
  const containerRef = useRef(null);
  const audioRefs = useRef([]);
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const initialTrackIndex = 3; // Индекс трека AmBy
    setPlayingTrackIndex(initialTrackIndex);

    const audioEl = audioRefs.current[initialTrackIndex];

    const onPlay = () => {
      console.log("Audio is playing");
    };

    const onPause = () => {
      console.log("Audio is paused");
    };

    const onError = () => {
      console.log("Error occurred while playing audio");
    };

    if (audioEl) {
      audioEl.addEventListener("play", onPlay);
      audioEl.addEventListener("pause", onPause);
      audioEl.addEventListener("error", onError);

      audioEl.play().catch((error) => {
        console.error("Playback failed:", error);
      });

      audioEl.addEventListener("timeupdate", () => {
        setCurrentTime(audioEl.currentTime);
      });

      return () => {
        audioEl.removeEventListener("play", onPlay);
        audioEl.removeEventListener("pause", onPause);
        audioEl.removeEventListener("error", onError);
        audioEl.removeEventListener("timeupdate", () => {
          setCurrentTime(audioEl.currentTime);
        });
      };
    }
  }, []);

  const tracks = [
    { id: 1, src: "/timeless.mp3", title: "Timeless" },
    { id: 2, src: "/Ra.mp3", title: "Ra" },
    { id: 3, src: "/tosoul.mp3", title: "toSoul" },
    { id: 4, src: "/extraordinary.mp3", title: "Extraordinary" },
    { id: 5, src: "/dao.mp3", title: "Dao" },
    { id: 6, src: "/AmBy.mp3", title: "AmBy" },
    { id: 7, src: "/mattery.mp3", title: "Mattery" },
    { id: 8, src: "/WiseLogic(Wiselissa).mp3", title: "WiseLogic(Wiselissa)" },
  ];

  // Toggle play/pause on play button
  const handlePlayPause = () => {
    if (playingTrackIndex === null) {
      togglePlay(0);
    } else {
      togglePlay(playingTrackIndex);
    }
  };

  // Play or pause the selected track
  const togglePlay = (index) => {
    const audioEl = audioRefs.current[index];
    if (audioEl) {
      audioEl.addEventListener('error', (e) => {
        console.error('Audio Element Error:', e);
      });

      if (playingTrackIndex === index) {
        if (!audioEl.paused) {
          audioEl.pause();
          setPlayingTrackIndex(null);
        } else {
          audioEl.play().catch((error) => console.error('Play Error:', error));
        }
      } else {
        audioRefs.current.forEach(a => a && a.pause());
        audioEl.play().then(() => {
          setPlayingTrackIndex(index);
        }).catch((error) => {
          console.error('Play Error:', error);
        });
      }
    }
  };

  const handleTrackClick = async (index) => {
    console.log("Track clicked:", index);

    const audioEl = audioRefs.current[index];

    if (!audioEl) return;

    try {
      if (playingTrackIndex === index) {
        if (audioEl.paused) {
          await audioEl.play();
        } else {
          audioEl.pause();
          setPlayingTrackIndex(null);
        }
      } else {
        if (playingTrackIndex !== null) {
          audioRefs.current[playingTrackIndex].pause();
        }

        await audioEl.play();
        setPlayingTrackIndex(index);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleProgressClick = (e) => {
    if (playingTrackIndex === null) return;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    const audioEl = audioRefs.current[playingTrackIndex];
    if (audioEl) {
      audioEl.currentTime = percentage * audioEl.duration;
      setCurrentTime(audioEl.currentTime);
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col justify-end items-center p-4 absolute z-5 bottom-0 left-0">
      <div className="flex items-center mb-2">
        <button
          onClick={handlePlayPause}
          className="text-white cursor-pointer absolute p-4 left-[18px] bottom-12"
          style={{
            fontSize: "2em",
          }}
        >
          {playingTrackIndex === null ? <FaPlay /> : <FaPause />}
        </button>

        {/* Обновленный контейнер для треков с адаптивным стилем */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-center w-full mb-4">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              id={`track-${track.id}`}
              className={`
                relative
                ${playingTrackIndex === index ? "border-2 border-pink shadow-lg" : ""}
                text-white rounded-2xl px-7 py-4 m-2 
                cursor-pointer 
                hover:bg-opacity-30 
                hover:shadow-2xl 
                transition-all
                active:scale-95
              `}
              onClick={() => handleTrackClick(index)}
            >
              <div className="absolute inset-0 rounded-2xl opacity-30" />
              <span className="relative z-10">{track.title}</span>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={track.src}
                preload="auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Полоска проигрывания начинается здесь */}
      <div
        className="w-full h-2 bg-pink-400 absolute bottom-0 left-0 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          style={{
            width: `${
              (audioRefs.current[playingTrackIndex]?.currentTime /
                audioRefs.current[playingTrackIndex]?.duration) *
                100 || 0
            }%`,
            height: "100%",
            backgroundColor: "gold",
            transition: "width 0.2s ease",
          }}
        />
      </div>
      {/* Полоска проигрывания заканчивается здесь */}
    </div>
  );
};

export default AudioPlayer;
