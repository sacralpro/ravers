import Head from "next/head";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TopNav from "./components/TopNav";
import FooterButtons from "./components/FooterButtons";
import { motion, AnimatePresence } from "framer-motion";
import AudioPlayer from "./components/AudioPlayer";
import YandexMetrika from "./components/YandexMetrika";

const ThreeJSCanvas = dynamic(() => import("../utils/ThreeJSCanvas"), { ssr: false });
const analyticsEnabled = !!(process.env.NODE_ENV === "production");


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  //Added CSS in JSX for better control and easier overrides
  const containerStyles = {
    height: '100vh', // Ensure the container takes the full viewport height
    overflow: 'hidden', // Prevent scrolling within the container
    display: 'flex',
    flexDirection: 'column', // Use flexbox for easy vertical layout
  };

  return (
    <div style={{ overflow: 'hidden', height: '100%' }}> {/* Add overflow: hidden here */}
      <Head>
         <title>SACRAL DJ - RAVERS - New music album (Minimal techno, Electronic, Rap)</title> <meta name="description" content="Experience the electrifying sounds of SACRAL DJ's new album, RAVERS. A unique blend of minimalist techno, electronic broken beats, and captivating vocals.  Explore the music, biography, and book a DJ gig." />
        <meta name="keywords" content="sacral dj, ravers, minimalist techno, electronic music, broken beats, dj gig, booking, music album, sasha, wiselissa, alexandr shaginov" />
        <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* Add this line */}

        <meta property="og:title" content="SACRAL DJ - RAVERS" />
        <meta property="og:description" content="Experience the electrifying sounds of SACRAL DJ's new album, RAVERS. A unique blend of minimalist techno, electronic broken beats, and captivating vocals. Explore the music, biography, and book a DJ gig." />
        <meta property="og:image" content="/images/preview.png" /> {/* Replace with your album cover image path */}
        <meta property="og:url" content="https://ravers.vercel.app/" /> {/* Replace with your website URL */}
        <link rel="icon" href="/images/favicon.ico" />
        
      </Head>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex justify-center items-center z-50"
          >
            <img src="/preloader.gif" alt="Loader" className="w-50" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1 } },
        }}
        style={containerStyles} // Apply the container styles here
      >
        <motion.div
          variants={{
            hidden: { y: -50, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.2 } },
          }}
          className="fixed w-full top-0"
        >
          <TopNav setMenuOpen={setMenuOpen} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.4 } },
          }}
          style={{ flex: 1 }} // Takes up remaining space
        >
          <ThreeJSCanvas />
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 50, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.6 } },
          }}
          className="w-full flex justify-center items-end p-4 mt-6"
          style={{ zIndex: 20, transition: 'opacity 0.5s ease-in-out' }}
        >
          {!menuOpen && <AudioPlayer />}
          {!menuOpen && <FooterButtons />}
        </motion.div>

        <YandexMetrika enabled={analyticsEnabled} />
      </motion.div>
    </div>
  );
}
