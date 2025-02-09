'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
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
        initial={{ x: '-230%', y: '70%' }}
        animate={{
          x: '230%',
          y: ['115%', '110%', '35%', '35%', '35%', '110%', '115%'],
          rotate: [0, -5, 5, 0],
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
      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Planning travel with Rynair
        </h1>
        <p className="text-lg text-white mb-14">
          just pick the cheapest tickets by selecting
          <br />a departure airport, the travel dates, and an arrival airport
        </p>
        <Link href="/departure-countries">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-2xl shadow-lg hover:bg-gray-100 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
