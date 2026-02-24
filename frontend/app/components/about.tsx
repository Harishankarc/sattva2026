"use client";
import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // About section animations
    gsap.from('.about-title', {
      opacity: 0,
      y: 50,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-title',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      }
    });

    gsap.from('.about-left', {
      opacity: 0,
      x: -50,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-left',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      }
    });

    gsap.from('.about-right', {
      opacity: 0,
      x: 50,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-right',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      }
    });

    gsap.from('.about-stats', {
      opacity: 0,
      y: 30,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  return (
    <div className='bg-[#0b090a] min-h-screen about-content w-screen relative overflow-hidden'>
      {/* About Section */}
      <div className='min-h-screen flex flex-col items-center justify-center px-8 md:px-20 py-20'>
        <div className='max-w-6xl w-full'>
          {/* About Title */}
          <h2 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 md:mb-16 opacity-0 about-title' style={{ fontFamily: 'Astila-Regular' }}>
            About SATTVA
          </h2>

          {/* About Content */}
          <div className='grid md:grid-cols-2 gap-12 md:gap-16'>
            {/* Left Column */}
            <div className='space-y-6 opacity-0 about-left'>
              <p className='text-lg md:text-xl text-gray-300 leading-relaxed' style={{ fontFamily: 'textfont' }}>
                SATTVA is the annual techno-cultural fest of CUSAT (Cochin University of Science and Technology), bringing together creativity, innovation, and cultural excellence.
              </p>
              <p className='text-lg md:text-xl text-gray-300 leading-relaxed' style={{ fontFamily: 'textfont' }}>
                As one of the most anticipated collegiate events, SATTVA showcases the brilliance of young minds through competitions, performances, and exhibitions that span technology, arts, and culture.
              </p>
            </div>

            {/* Right Column */}
            <div className='space-y-6 opacity-0 about-right'>
              <p className='text-lg md:text-xl text-gray-300 leading-relaxed' style={{ fontFamily: 'textfont' }}>
                From technical workshops to cultural performances, SATTVA creates a platform where students can showcase their talents, learn from experts, and connect with like-minded individuals.
              </p>
              <p className='text-lg md:text-xl text-gray-300 leading-relaxed' style={{ fontFamily: 'textfont' }}>
                Join us in 2026 for an unforgettable experience that celebrates innovation, tradition, and the spirit of excellence.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-20 opacity-0 about-stats'>
            <div className='text-center'>
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-2' style={{ fontFamily: 'Astila-Regular' }}>10K+</h3>
              <p className='text-sm md:text-base text-gray-400 uppercase tracking-wider' style={{ fontFamily: 'textfont' }}>Participants</p>
            </div>
            <div className='text-center'>
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-2' style={{ fontFamily: 'Astila-Regular' }}>50+</h3>
              <p className='text-sm md:text-base text-gray-400 uppercase tracking-wider' style={{ fontFamily: 'textfont' }}>Events</p>
            </div>
            <div className='text-center'>
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-2' style={{ fontFamily: 'Astila-Regular' }}>3</h3>
              <p className='text-sm md:text-base text-gray-400 uppercase tracking-wider' style={{ fontFamily: 'textfont' }}>Days</p>
            </div>
            <div className='text-center'>
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-2' style={{ fontFamily: 'Astila-Regular' }}>100+</h3>
              <p className='text-sm md:text-base text-gray-400 uppercase tracking-wider' style={{ fontFamily: 'textfont' }}>Colleges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;