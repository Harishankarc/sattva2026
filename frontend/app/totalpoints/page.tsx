"use client";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useEffect, useState } from 'react';
import API from '../../api/api'
import HamburgerMenu from "../components/hamburger";

gsap.registerPlugin(ScrollTrigger);

interface DepartmentData {
  name: string;
  shortName: string;
  artsPoints: number;
  sportsPoints: number;
  totalPoints: number;
  color: string;
}


const DepartmentPoints = () => {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<'total' | 'arts' | 'sports'>('total');
  const [sortedDepts, setSortedDepts] = useState<DepartmentData[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initial animation for cards
    gsap.fromTo(
      '.dept-card',
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.points-container',
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Animate header
    gsap.fromTo(
      '.points-header',
      {
        y: -50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.points-container',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Animate toggle buttons
    gsap.fromTo(
      '.toggle-btn',
      {
        y: -30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.points-container',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, [mounted]);

  useEffect(() => {
    // Sort departments based on active view
    const sorted = [...sortedDepts].sort((a, b) => {
      if (activeView === 'total') return b.totalPoints - a.totalPoints;
      if (activeView === 'arts') return b.artsPoints - a.artsPoints;
      return b.sportsPoints - a.sportsPoints;
    });
    setSortedDepts(sorted);

    // Animate cards on view change
    if (mounted) {
      gsap.fromTo(
        '.dept-card',
        {
          scale: 0.95,
          opacity: 0.5,
        },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [activeView, mounted]);

  const maxPoints = Math.max(...sortedDepts.map(d =>
    activeView === 'total' ? d.totalPoints :
      activeView === 'arts' ? d.artsPoints : d.sportsPoints
  ));


  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const [artsRes, sportsRes] = await Promise.all([
          API.artspoints(),
          API.sportspoints()
        ]);

        const arts = await artsRes.data;
        const sports = await sportsRes.data;

        // Convert arrays → map for easy merge
        const map: Record<string, DepartmentData> = {};

        arts.forEach((a: any) => {
          map[a.branch] = {
            name: a.branch,
            shortName: a.branch.substring(0, 2).toUpperCase(),
            artsPoints: a.marks,
            sportsPoints: 0,
            totalPoints: a.marks,
            color: "#7f1d1d"
          };
        });

        sports.forEach((s: any) => {
          if (!map[s.branch]) {
            map[s.branch] = {
              name: s.branch,
              shortName: s.branch.substring(0, 2).toUpperCase(),
              artsPoints: 0,
              sportsPoints: s.marks,
              totalPoints: s.marks,
              color: "#991b1b"
            };
          } else {
            map[s.branch].sportsPoints = s.marks;
            map[s.branch].totalPoints += s.marks;
          }
        });

        setSortedDepts(Object.values(map));

      } catch (err) {
        console.error("Failed to load points:", err);
      }
    };

    fetchPoints();
  }, []);



  return (
    <div className="points-container min-h-screen bg-[#0b090a] py-10 px-4 md:px-8 lg:px-16" id="total-points">
      <HamburgerMenu />
      {/* Header Section */}
      <div className="points-header max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#590d22] mb-4" style={{ fontFamily: 'textfont' }}>
              Leaderboard 2026
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
              Department
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
              Standings
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('total')}
              className={`toggle-btn px-6 py-3 rounded-full border-2 transition-all duration-300 ${activeView === 'total'
                  ? 'bg-[#590d22] border-[#590d22] text-white'
                  : 'bg-transparent border-white/20 text-white hover:border-[#590d22]/50'
                }`}
              style={{ fontFamily: 'textfont' }}
            >
              Total
            </button>
            <button
              onClick={() => setActiveView('arts')}
              className={`toggle-btn px-6 py-3 rounded-full border-2 transition-all duration-300 ${activeView === 'arts'
                  ? 'bg-[#590d22] border-[#590d22] text-white'
                  : 'bg-transparent border-white/20 text-white hover:border-[#590d22]/50'
                }`}
              style={{ fontFamily: 'textfont' }}
            >
              Arts
            </button>
            <button
              onClick={() => setActiveView('sports')}
              className={`toggle-btn px-6 py-3 rounded-full border-2 transition-all duration-300 ${activeView === 'sports'
                  ? 'bg-[#590d22] border-[#590d22] text-white'
                  : 'bg-transparent border-white/20 text-white hover:border-[#590d22]/50'
                }`}
              style={{ fontFamily: 'textfont' }}
            >
              Sports
            </button>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDepts.map((dept, index) => {
          const currentPoints =
            activeView === 'total' ? dept.totalPoints :
              activeView === 'arts' ? dept.artsPoints : dept.sportsPoints;

          const percentage = (currentPoints / maxPoints) * 100;

          return (
            <div
              key={dept.shortName}
              className="dept-card relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group overflow-hidden"
              style={{ fontFamily: 'textfont' }}
            >
              {/* Rank Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#590d22] flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'textfont' }}>
                  {index + 1}
                </span>
              </div>

              {/* Department Short Name - Large Background */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <h2 className="text-9xl font-bold" style={{ fontFamily: 'Astila-Regular', color: dept.color }}>
                  {dept.shortName}
                </h2>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#fef9ef] mb-2 tracking-wider" style={{ fontFamily: 'textfont' }}>
                  {dept.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-6" style={{ fontFamily: 'textfont' }}>
                  {dept.shortName}
                </p>

                {/* Points Display */}
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-bold text-[#fef9ef]" style={{ fontFamily: 'textfont' }}>
                      {currentPoints}
                    </span>
                    <span className="text-sm text-white/50 pb-2" style={{ fontFamily: 'textfont' }}>
                      points
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>

                {/* Breakdown - Only show when total view is active */}
                {activeView === 'total' && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1" style={{ fontFamily: 'textfont' }}>
                        Arts
                      </p>
                      <p className="text-2xl font-bold text-[#fef9ef]" style={{ fontFamily: 'textfont' }}>
                        {dept.artsPoints}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1" style={{ fontFamily: 'textfont' }}>
                        Sports
                      </p>
                      <p className="text-2xl font-bold text-[#fef9ef]" style={{ fontFamily: 'textfont' }}>
                        {dept.sportsPoints}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                <div
                  className="absolute bottom-0 left-0 w-full h-full rounded-tr-full"
                  style={{ backgroundColor: dept.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Decorative Element */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none">
        <p className="text-[20vw] font-bold rotate-90 origin-center text-[#590d22]" style={{ fontFamily: 'Astila-Regular' }}>
          SATTVA
        </p>
      </div>
    </div>
  );
};

export default DepartmentPoints;