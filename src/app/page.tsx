'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{
          backgroundImage: `url('world.svg')`, // Ensure correct path
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Animated Plane Moving Below the Button */}
      <motion.img
        className="absolute"
        src="plane.svg"
        alt="Side view plane"
        initial={{ x: '-200%', y: '-200%' }}
        animate={{
          x: '200%',
          y: [
            '-200%',
            '-200%',
            '-200%',
            '-210%',
            '-235%',
            '-210%',
            '-200%',
            '-200%',
            '-200%',
          ],
          rotate: [0, 0, 0, -5, -5, -5, 0, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: 'easeInOut',
        }}
        style={{
          width: '80px',
        }}
      />

      {/* Main content */}
      <div className="relative top-4 w-screen z-10 text-center px-4">
        <h1 className="text-2xl text-white md:text-4xl font-bold mb-6">
          R<span className="text-blue-500">YAN</span>AI
          <span className="text-blue-500">R</span>
          <br />
          planning travel
        </h1>
        <p className="text-sm md:text-lg text-white mb-2">
          get recommended tickets
          <br />
          to save on your budget -
          <br />
          just select a departure airport,
          <br /> travel dates, and an arrival airport
        </p>
        <Link href="/departure-countries">
          <motion.button className="relative top-8 inline-flex items-center px-2 py-0 text-red-500 hover:text-green-500 bg-gray-700 opacity-75 rounded-lg shadow-md">
            <span className="text-sm md:text-lg font-bold">FASTEN</span>
            <motion.img
              className="h-10 md:h-20"
              src="seatbelt.svg"
              alt="Seatbelt Icon"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{
                filter:
                  'invert(33%) sepia(100%) saturate(1000%) hue-rotate(30deg) brightness(100%) contrast(100%)',
              }}
            />
            <span className="text-sm md:text-lg font-bold">SEATBELT</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
