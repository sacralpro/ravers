

import Head from "next/head";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TopNav from "./components/TopNav"; // Import the TopNav component
//import "@/styles/globals.css";
import FooterButtons from "./components/FooterButtons"; // Import the FooterButtons component
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import AudioPlayer from "./components/AudioPlayer"; // Import the AudioPlayer component


// Динамически импортируем компонент ThreeJSCanvas, отключая серверный рендеринг
const ThreeJSCanvas = dynamic(() => import("../utils/ThreeJSCanvas"), {
  ssr: false,
});

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для отслеживания состояния меню
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1-second preloader

    return () => clearTimeout(timer);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1 } },
  };
  
  const topNavVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.2 } },
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.4 } },
  };
  
  const bottomNavVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut", delay: 1.6 } },
  };
  

 
  return (
    <div className={styles.container}>
      <Head>
        <title>SACRAL DJ - RAVERS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatePresence> {/* AnimatePresence to handle enter/exit animations */}
        {isLoading && (
            <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex justify-center items-center z-50"
          >
            {/* Your preloader here */}
            <img src="/preloader.gif" alt="Loader" className="w-50" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full h-full"
        style={{ transition: 'opacity 0.5s ease-in-out' }}
      >
        <motion.div variants={topNavVariants} className="fixed w-full top-0">
        <TopNav setMenuOpen={setMenuOpen} /> {/* Передаем функцию изменения состояния */}
        </motion.div>

        <motion.div variants={contentVariants}>
          <ThreeJSCanvas />
        </motion.div>

        <motion.div
          variants={bottomNavVariants}
          className="w-full flex justify-center items-end p-4 fixed bottom-0 left-0"
          style={{ zIndex: 10, transition: 'opacity 0.5s ease-in-out' }}
        > {/*Fixed positioning for bottom nav*/}
           {!menuOpen && <AudioPlayer />}
           {!menuOpen && <FooterButtons />}
        </motion.div>
      </motion.div>
    </div>
  );
}