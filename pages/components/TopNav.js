import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOTS from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const TopNav = ({ setMenuOpen }) => {
  const [menuOpen, setMenuOpenState] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navRef = useRef(null);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen && vantaRef.current) {
      setVantaEffect(
        DOTS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0xea26ff,
          color2: 0xf5b2ee,
          backgroundColor: 0xc6f770,
          size: 4.8,
          spacing: 34,
        })
      );
    } else if (vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }
  }, [menuOpen]);

  const containerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -100, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const closeButtonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  const iconVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2, ease: 'easeInOut' } },
  };


  const toggleMenu = () => {
    setMenuOpenState(!menuOpen);
    setMenuOpen(!menuOpen);
    setShowBio(false);
    setShowAbout(false);
  };

  const showBiography = () => {
    setShowBio(true);
    setShowAbout(false);
    setMenuOpenState(false);
  };

  const showAboutAlbum = () => {
    setShowAbout(true);
    setShowBio(false);
    setMenuOpenState(false);
  };

  const backToMenu = () => {
    setShowBio(false);
    setShowAbout(false);
    setMenuOpen(true);
  };

  const typewriterEffect = (text, delay = 50) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * delay / 1000, duration: 0.03 }}
      >
        {char}
      </motion.span>
    ));
  };

  return (
    <div className="relative z-1020" ref={navRef}>
      <motion.div
        className="fixed top-0 left-0 pl-[30px] pr-[40px] w-full z-[2000] bg-transparent transition-colors duration-300"
        style={{ backgroundColor: menuOpen ? 'rgba(255, 192, 203, 0.8)' : 'transparent' }}
      >
        <div className="flex justify-between items-center h-16 ">
        <div className="flex items-center">
        <a className="cursor-pointer" href="https://sacraltrack.store">
          <div className="flex items-center"> {/* Wrap logo and text in a div */}
            <img src="/images/st.png" alt="SACRAL TRACK" className="h-6 w-6 hidden md:block mr-2" />
            <span className="text-white ml-2 hidden md:block">SACRAL TRACK</span>
            <img src="/images/st.png" alt="SACRAL TRACK" className="h-6 w-6 md:hidden" />
          </div> {/* End of wrapping div */}
        </a>
      </div>

          <div className="text-white">
            <p className="text-center">
              SACRAL DJ - RAVERS {isMobile ? '' : '(MUSIC ALBUM 2025)'}
            </p>
          </div>
          <motion.div className="cursor-pointer " onClick={toggleMenu}>
            <div className={`h-1 w-[36px] bg-white transition duration-300 ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : 'mb-2.5'}`} />
            <div className={`h-1 w-[36px] bg-white transition duration-300 ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
          </motion.div>
        </div>
        <AnimatePresence>
          {showBio ? (
            <motion.div
              className="fixed top-0 left-0 right-0 bottom-0 bg-blue-600 flex flex-col items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-white text-[4rem] mb-8">Biography</h1>
              <p className="text-white text-center mx-4 w-[60vw] leading-[1.75rem]">
                {typewriterEffect(
                  "Sacral DJ: A sonic architect, Alexandr Shaginov crafts a unique soundscape that transcends genres. Blending techno, electro, hip-hop, and rap, his productions are powerful and otherworldly. Each Sacral DJ live performance is a one-of-a-kind experience, enhanced by ultra-modern minimalist visuals and featuring collaborations with diverse artists such as actress Anastasia Vasylieva and yoga master Wiselissa."
                )}
              </p>
              <motion.div
                className="cursor-pointer mt-8"
                onClick={backToMenu}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-20 flex justify-center items-center rounded-full">
                  <img src="/images/1.svg" alt="back" className="w-10 h-6" />
                </div>
              </motion.div>
            </motion.div>
          ) : showAbout ? (
            <motion.div
              className="fixed top-0 left-0 right-0 bottom-0 bg-blue-600 flex flex-col items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-white text-[3rem] mb-8">About the Album</h1>
              <p className="text-white w-[60vw] text-center mx-4 leading-[1.75rem]">
                {typewriterEffect(
                  "\"RAVERS\" is produced for all lovers of electronic music.\nRecorded in the style of high-quality minimal techno with\nelectronic broken beats and featuring vocals by Sasha and Wiselissa, \nit creates masterpieces in the minds and hearts \nof listeners and tearing up dance floors of any size.\n\nThe intro track, 'Timeless,' is a rap vibe, as always exploring \nthe transcendent states bordering on a world where the unthinkable is known..."
                )}
              </p>
              <motion.div
                className="cursor-pointer mt-8"
                onClick={backToMenu}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-20 flex justify-center">
                  <img src="/images/1.svg" alt="back" className="w-10 h-6" />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            menuOpen && (
              <motion.div
                className="fixed top-0 left-0 right-0 h-screen bg-transparent z-40"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative h-full">
                  <motion.div
                    className="relative flex flex-col items-center justify-center h-full w-full text-white text-[4rem] z-50 pl-8"
                  >
                   <motion.ul className="flex flex-col space-y-12 z-50">
  {['ABOUT THE ALBUM', 'BOOK A DJ-GIG', 'BIOGRAPHY'].map((item, index) => (
    <motion.li
      key={item}
      
      className="cursor-pointer text-6xl md:text-4xl lg:text-6xl" // Adjust sizes as needed
      variants={menuItemVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ color: 'pink' }}
      onClick={() => {
        switch (item) {
          case 'BIOGRAPHY':
            showBiography();
            break;
          case 'ABOUT THE ALBUM':
            showAboutAlbum();
            break;
          case 'BOOK A DJ-GIG':
            window.location.href = 'https://t.me/sashaplayra'; // Replace with your actual URL
            break;
          default:
            toggleMenu();
            break;
        }
      }}
    >
      {item}
    </motion.li>


                      ))}
                      <motion.li
                        key="VIDEO"
                        className="cursor-pointer flex items-center space-x-6"
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        whileHover={{ color: 'pink' }}
                      >
                        <motion.a
                          href="https://www.instagram.com/__sacral__/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer"
                          variants={iconVariants}
                          whileHover="hover"
                        >
                          <img src="/images/Ins.svg" alt="Instagram" className="w-10 h-10" />
                        </motion.a>
                        <motion.a
                          href="https://www.youtube.com/watch?v=c3oH1YiMUp4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer"
                          variants={iconVariants}
                          whileHover="hover"
                        >
                          <img src="/images/You.svg" alt="YouTube" className="w-10 h-10" />
                        </motion.a>
                        <motion.a
                          href="https://t.me/sashaplayra"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer"
                          variants={iconVariants}
                          whileHover="hover"
                        >
                          <img src="/images/Tel.svg" alt="Telephone" className="w-10 h-10" />
                        </motion.a>
                      </motion.li>
                    </motion.ul>
                    <motion.div
                      className="absolute top-3 right-8 cursor-pointer z-50 mt-5"
                      variants={closeButtonVariants}
                      whileHover="hover"
                      animate={menuOpen ? 'open' : 'closed'}
                      onClick={toggleMenu}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <div
                          className={`h-1 w-[36px] bg-white transition duration-300 ${menuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
                        />
                        <div
                          className={`h-1 w-[36px] bg-white transition duration-300 ${menuOpen ? '-rotate-45 -translate-y-0.5' : 'mt-1'}`}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                  <div ref={vantaRef} className="h-full w-full absolute top-0 left-0 z-" />
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TopNav;
