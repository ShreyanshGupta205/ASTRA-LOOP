import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../../store/simulationStore';
import { NavPage } from '../../types/habitat';
import {
  X,
  ArrowRight,
  Activity,
  Radio,
  Cpu,
  Boxes,
  ShieldCheck,
  RotateCcw,
  Clock,
  Compass,
  FileText,
  Sliders,
  LayoutDashboard,
} from 'lucide-react';

interface SpaceXHeaderProps {
  onOpenSimulator?: () => void;
}

export const SpaceXHeader: React.FC<SpaceXHeaderProps> = ({ onOpenSimulator }) => {
  const { state, navigate, resetSimulation } = useSimulation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(148);

  const isLandingPage = state.currentPage === 'spacex-portal';

  // Mission elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Unified top navigation items
  const navLinks: { label: string; page: NavPage; hash?: string }[] = [
    { label: 'HOME', page: 'spacex-portal', hash: '#hero' },
    { label: '3D SIMULATION', page: 'digital-twin-3d', hash: '#simulation' },
    { label: 'AVIONICS CONSOLE', page: 'overview' },
    { label: 'SCENARIO LAB', page: 'scenario-lab' },
    { label: 'RECOVERY PLANS', page: 'recovery-plans', hash: '#recovery-plans' },
    { label: 'MISSION DATA', page: 'model-assumptions', hash: '#mission-data' },
    { label: 'AUDIT LOG', page: 'history' },
  ];

  const drawerLinks: { label: string; page: NavPage; category: string }[] = [
    { label: 'MISSION BRIEFING', page: 'spacex-portal', category: 'PORTAL' },
    { label: '3D DIGITAL TWIN ARENA', page: 'digital-twin-3d', category: 'SIMULATION' },
    { label: 'AVIONICS FLIGHT CONSOLE', page: 'overview', category: 'TELEMETRY' },
    { label: 'ANOMALY INJECTION LAB', page: 'scenario-lab', category: 'FAULTS' },
    { label: 'CONTINGENCY PROTOCOLS', page: 'recovery-plans', category: 'RECOVERY' },
    { label: 'DETERMINISTIC PHYSICS', page: 'model-assumptions', category: 'PHYSICS' },
    { label: 'TELEMETRY AUDIT TRAIL', page: 'history', category: 'LOGS' },
  ];

  const handleNavClick = (link: { label: string; page: NavPage; hash?: string }) => {
    setIsDrawerOpen(false);
    if (isLandingPage && link.hash && link.page === 'spacex-portal') {
      const element = document.querySelector(link.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(link.page);
  };

  const handleMainCta = () => {
    setIsDrawerOpen(false);
    if (onOpenSimulator) {
      onOpenSimulator();
    } else {
      navigate('digital-twin-3d');
    }
  };

  const statusLevel = state.habitat.status;
  const isFloorBreached = state.habitat.batteryKWh <= 18;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 font-sans ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled || !isLandingPage
            ? 'backdrop-blur-md bg-[#050505]/95 border-b border-[#333333] shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1720px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          {/* Left: Original AstraLoop Wordmark & Geometric Lunar-Orbit Symbol */}
          <div className="flex items-center gap-6 xl:gap-10">
            <button
              onClick={() => navigate('spacex-portal')}
              className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity group cursor-pointer text-left select-none"
              aria-label="AstraLoop Home"
            >
              {/* Custom AstraLoop Geometric Lunar-Orbit Symbol */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-white fill-none stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="18"
                    className="fill-white/10 stroke-white"
                    strokeWidth="3.5"
                  />
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="44"
                    ry="17"
                    transform="rotate(-28 50 50)"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="140 40"
                    className="text-white/80 group-hover:text-cyan transition-colors"
                  />
                  <circle
                    cx="84"
                    cy="32"
                    r="4"
                    className="fill-cyan stroke-black"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* AstraLoop Typography Wordmark */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center font-din tracking-[0.2em] uppercase font-extrabold text-base sm:text-lg text-white leading-none">
                  <span>ASTRA</span>
                  <span className="text-white/30 mx-1.5">//</span>
                  <span className="text-white">LOOP</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase mt-0.5 hidden sm:block">
                  LUNAR DIGITAL TWIN
                </span>
              </div>
            </button>

            {/* Center: Minimal uppercase nav links with expanding underline */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = state.currentPage === link.page;
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className={`relative py-1 text-xs tracking-[0.16em] font-bold uppercase font-din transition-colors group cursor-pointer ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-white transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 origin-left'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Telemetry Status Badge, Actions & Drawer Toggle */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mission Elapsed Time (MET) */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-[#333333] text-xs font-mono text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-[10px] text-white/50 tracking-wider">MET</span>
              <span className="text-cyan font-bold tabular-nums tracking-widest text-xs">
                {formatMET(elapsedSeconds)}
              </span>
            </div>

            {/* Flight Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase font-bold border border-[#333333]">
              <span className={`w-2 h-2 rounded-full ${
                isFloorBreached
                  ? 'bg-red animate-pulse'
                  : statusLevel === 'CRITICAL'
                  ? 'bg-red animate-pulse'
                  : statusLevel === 'WARNING'
                  ? 'bg-amber'
                  : 'bg-teal'
              }`} />
              <span className={
                isFloorBreached
                  ? 'text-red'
                  : statusLevel === 'CRITICAL'
                  ? 'text-red'
                  : statusLevel === 'WARNING'
                  ? 'text-amber'
                  : 'text-teal'
              }>
                {isFloorBreached ? 'FLOOR BREACH' : statusLevel}
              </span>
            </div>

            {/* Primary Action Button */}
            {isLandingPage ? (
              <button
                onClick={handleMainCta}
                className="flex items-center gap-2 px-4 py-2 border border-white/40 hover:border-white bg-transparent hover:bg-white text-white hover:text-black uppercase font-din text-xs tracking-[0.18em] font-bold transition-all duration-300 cursor-pointer group sharp-brutalist select-none"
                style={{ borderRadius: '0px' }}
                title="Enter AstraLoop Interactive Simulation Arena"
              >
                <span>ENTER SIMULATION</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] hover:border-white bg-transparent hover:bg-white/10 text-white/80 hover:text-white uppercase font-din text-xs tracking-[0.15em] font-bold transition-all duration-300 cursor-pointer sharp-brutalist select-none"
                style={{ borderRadius: '0px' }}
                title="Reset simulation flight state to baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">RESET</span>
              </button>
            )}

            {/* Minimal 3-line hamburger menu trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-9 h-9 flex flex-col items-end justify-center gap-1.5 p-1 text-white hover:opacity-80 transition-opacity cursor-pointer group"
              aria-label="Open Navigation Directory"
            >
              <span className="w-6 h-[1.5px] bg-white transition-all group-hover:bg-cyan" />
              <span className="w-4 h-[1.5px] bg-white transition-all group-hover:w-6 group-hover:bg-cyan" />
              <span className="w-5 h-[1.5px] bg-white transition-all group-hover:w-6 group-hover:bg-cyan" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Full Aerospace Directory Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-y-0 right-0 w-84 sm:w-96 bg-[#050505] border-l border-[#333333] z-50 flex flex-col justify-between p-8 overflow-y-auto text-white sharp-brutalist font-sans"
            >
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#333333]">
                  <span className="font-din tracking-[0.2em] text-xs font-bold text-white/50 uppercase">
                    ASTRALOOP // FLIGHT DIRECTORY
                  </span>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <div className="space-y-3">
                  {drawerLinks.map((item, idx) => {
                    const isActive = state.currentPage === item.page;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * idx, duration: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            setIsDrawerOpen(false);
                            navigate(item.page);
                          }}
                          className={`group w-full flex items-center justify-between py-2 text-left font-din text-sm font-bold tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                            isActive ? 'text-cyan' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isActive && <span className="w-1.5 h-1.5 bg-cyan" />}
                            <span>{item.label}</span>
                          </span>
                          <span className="text-[10px] text-white/40 group-hover:text-cyan font-mono transition-colors">
                            [{item.category}]
                          </span>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 3D Simulation Arena Quick Card */}
                <div className="mt-8 pt-6 border-t border-[#333333]">
                  <div className="p-4 border border-cyan/40 bg-cyan/5 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Boxes className="w-4 h-4 text-cyan" />
                      <span className="font-din text-xs tracking-widest text-cyan font-bold uppercase">
                        3D DIGITAL TWIN ARENA
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-sans mb-4 leading-relaxed">
                      Interactive WebGL lunar habitat simulation with deterministic fault injection, continuous resource depletion, and contingency recovery protocols.
                    </p>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        navigate('digital-twin-3d');
                      }}
                      className="w-full py-2.5 bg-white hover:bg-cyan text-black font-din font-bold text-xs uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ENTER SIMULATION</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Metadata */}
              <div className="pt-8 border-t border-[#333333] text-[10px] text-white/40 font-mono flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>MISSION:</span>
                  <span className="text-white/70">SPACE & BEYOND 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>LOCATION:</span>
                  <span className="text-white/70">SHACKLETON RIM // 0.166G</span>
                </div>
                <div className="flex justify-between">
                  <span>AVIONICS:</span>
                  <span className="text-teal font-bold">120V BUS // NOMINAL</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
