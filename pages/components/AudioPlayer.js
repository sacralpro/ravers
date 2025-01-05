"use client";

import { useRef, useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa"; // Import icons

const AudioPlayer = () => {
  const containerRef = useRef(null);
  const audioRefs = useRef([]);
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const daoTrackIndex = tracks.findIndex((track) => track.title === "Dao");

    if (daoTrackIndex !== -1) {
      // Immediately play the "Dao" track
      const audioEl = audioRefs.current[daoTrackIndex];
      if (audioEl) {
        audioEl.play().catch(error => {
          console.error("Failed to play Dao:", error);
        });
        setPlayingTrackIndex(daoTrackIndex); // Set state AFTER playing to avoid race condition.
      }
    }


    // Add event listeners for all audio elements.  This is more efficient than adding and removing listeners repeatedly.
    const handleTimeUpdate = (index) => () => {
      setCurrentTime(audioRefs.current[index].currentTime);
    };

    const handleAudioError = (index) => (e) => {
      console.error(`Error in audio track ${index + 1}:`, e);
    };

    tracks.forEach((track,index) => {
      const audioEl = audioRefs.current[index];
      if(audioEl){
        audioEl.addEventListener("timeupdate", handleTimeUpdate(index));
        audioEl.addEventListener("error", handleAudioError(index));
      }
    });


    return () => {
      tracks.forEach((_,index) => {
        const audioEl = audioRefs.current[index];
        if(audioEl){
          audioEl.removeEventListener("timeupdate", handleTimeUpdate(index));
          audioEl.removeEventListener("error", handleAudioError(index));
        }
      });
    };
  }, []);

  const tracks = [
    { id: 1, src: "/Timeless.mp3", title: "Timeless" },
    { id: 2, src: "/Ra.mp3", title: "Ra" },
    { id: 3, src: "/toSoul.mp3", title: "toSoul" },
    { id: 4, src: "/Extraordinary.mp3", title: "Extraordinary" },
    { id: 5, src: "/Dao.mp3", title: "Dao" },
    { id: 6, src: "/AmBy.mp3", title: "AmBy" },
    { id: 7, src: "/Mattery.mp3", title: "Mattery" },
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
      if (playingTrackIndex === index) {
        if (!audioEl.paused) {
          audioEl.pause();
          setPlayingTrackIndex(null);
        } else {
          audioEl.play().catch((error) => console.error('Play Error:', error));
        }
      } else {
        audioRefs.current.forEach((a) => a && a.pause());
        audioEl.play().then(() => {
          setPlayingTrackIndex(index);
        }).catch((error) => {
          console.error('Play Error:', error);
        });
      }
    }
  };

  const handleTrackClick = async (index) => {
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
          style={{ fontSize: "2em" }}
        >
          {playingTrackIndex === null ? <FaPlay /> : <FaPause />}
        </button>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-center md:ml-0 ml-[-120px] w-full mb-4">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              id={`track-${track.id}`}
              className={`relative ${
                playingTrackIndex === index ? "border-2 border-pink shadow-lg" : ""
              } text-white rounded-2xl px-7 py-4 m-2 md:w-auto w-[230px] cursor-pointer  hover:text-pink-800 hover:bg-opacity-0 transition-all active:scale-95`}
              onClick={() => handleTrackClick(index)}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0" />
              <span className="relative z-10">{track.title}</span>
              <audio ref={(el) => (audioRefs.current[index] = el)} src={track.src} preload="auto" />
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default AudioPlayer;
