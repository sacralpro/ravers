import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import DOTS from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const TopNav = ({ setMenuOpen }) => {
  const [menuOpen, setMenuOpenState] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // Новое состояние для отображения информации об альбоме
  const navRef = useRef(null);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view


  useEffect(() => {
    // Handle window resize event
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener on mount
    window.addEventListener('resize', handleResize);
    return () => {
      // Clean up event listener
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

  const toggleMenu = () => {
    setMenuOpenState(!menuOpen);
    setMenuOpen(!menuOpen);
    setShowBio(false); // Закрываем биографию при переключении меню
    setShowAbout(false); // Закрываем раздел об альбоме
  };

  const showBiography = () => {
    setShowBio(true); // Показать биографию
    setShowAbout(false); // Скрыть раздел об альбоме
    setMenuOpenState(false); // Скрыть меню
  };

  const showAboutAlbum = () => {
    setShowAbout(true); // Показать информацию об альбоме
    setShowBio(false); // Скрыть биографию
    setMenuOpenState(false); // Скрыть меню
  };

  const backToMenu = () => {
    setShowBio(false); // Вернуться в меню
    setShowAbout(false); // Вернуться в меню
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
        className="fixed top-0 left-0 pl-[30px] pr-[46px] w-full z-[2000] bg-transparent transition-colors duration-300"
        style={{ backgroundColor: menuOpen ? 'rgba(255, 192, 203, 0.8)' : 'transparent' }}
      >
        <div className="flex justify-between items-center h-16 ">
          <div className="flex items-center">
            {/* Логотип для мобильной версии */}
            <img 
              src="/images/st.png" 
              alt="SACRAL TRACK" 
              className="h-6 w-6 hidden md:block" // Скрыть на мобильных
            />
            <span className="text-white ml-2 hidden md:block">SACRAL TRACK</span>
            {/* Только иконка на мобильной версии */}
            <img 
              src="/images/st.png" 
              alt="SACRAL TRACK" 
              className="h-6 w-6 md:hidden" // Показать только на мобильных
            />
          </div>

          {/* Заголовок, измененный для мобильного формата */}
          <div className="text-white">
            <p className="text-center">
            SACRAL DJ - RAVERS {isMobile ? '' : '(MUSIC ALBUM 2025)'}
            </p>
          </div>

          <motion.div
            className="cursor-pointer"
            onClick={toggleMenu}
          >
            <div className={`h-1 w-[40px] bg-white transition duration-300 ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : 'mb-2.5'}`} />
            <div className={`h-1 w-[40px] bg-white transition duration-300 ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
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
              <p className="text-white text-center mx-4">
                Здесь будет биография артиста! Она может содержать информацию о его карьере, достижениях и другой интересной информации.
              </p>
              <motion.div
                className="cursor-pointer mt-8"
                onClick={backToMenu}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-10 bg-white flex justify-center items-center rounded-full">
                  <span className="text-blue-600">&#8592;</span> {/* Стрелочка назад */}
                </div>
              </motion.div>
            </motion.div>
          ) : showAbout ? ( // Проверка для отображения информации об альбоме
            <motion.div
              className="fixed top-0 left-0 right-0 bottom-0 bg-blue-600 flex flex-col items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-white text-[4rem] mb-8">About the Album</h1>
              <p className="text-white text-center mx-4">
                {typewriterEffect("Это описание альбома с эффектом печатной машинки.")}
              </p>
              <motion.div
                className="cursor-pointer mt-8"
                onClick={backToMenu}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-10 w-10 bg-white flex justify-center items-center rounded-full">
                  <span className="text-blue-600">&#8592;</span> {/* Стрелочка назад */}
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
                    className="relative flex flex-col items-center justify-center h-full w-full text-white text-[4rem] z-50"
                  >
                    <motion.ul
                      className="flex flex-col space-y-4 z-50"
                    >
                      {['ABOUT THE ALBUM', 'BOOK A DJ-GIG', 'BIOGRAPHY', 'VIDEO'].map((item, index) => (
                        <motion.li
                          key={item}
                          className="cursor-pointer"
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index} // передаем индекс в `custom`
                          whileHover={{ color: 'pink', scale: 1.1 }} // Задаем эффект на hover
                          onClick={item === 'BIOGRAPHY' ? showBiography : item === 'ABOUT THE ALBUM' ? showAboutAlbum : toggleMenu}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.div
                      className="absolute top-4 right-4 cursor-pointer z-50 mt-3 mr-3"
                      variants={closeButtonVariants}
                      whileHover="hover"
                      animate={menuOpen ? 'open' : 'closed'}
                      onClick={toggleMenu}
                    >
                      <div className="flex flex-col justify-center items-center">
                        <div
                          className={`h-1 w-[40px] bg-white transition duration-300 ${menuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
                        />
                        <div
                          className={`h-1 w-[40px] bg-white transition duration-300 ${menuOpen ? '-rotate-45 -translate-y-0.5' : 'mt-1'}`}
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
