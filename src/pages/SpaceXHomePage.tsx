import React, { useState } from 'react';
import { SpaceXHeader } from '../components/spacex/SpaceXHeader';
import { SpaceXHeroSection } from '../components/spacex/SpaceXHeroSection';
import { AstraLoopSections } from '../components/spacex/AstraLoopSections';
import { SpaceXFooter } from '../components/spacex/SpaceXFooter';
import { MissionVideoModal } from '../components/spacex/MissionVideoModal';
import { useSimulation } from '../store/simulationStore';

export const SpaceXHomePage: React.FC = () => {
  const { navigate } = useSimulation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleLaunchSimulator = () => {
    navigate('digital-twin-3d');
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* 1. Slim Fixed Transparent / Frosted Header with Minimal Navigation & AstraLoop Orbit Mark */}
      <SpaceXHeader onOpenSimulator={handleLaunchSimulator} />

      <main className="w-full">
        {/* 2. Full-Viewport Cinematic Opening Scene: WHEN SYSTEMS FAIL, EVERY SECOND MATTERS. */}
        <SpaceXHeroSection onWatchClick={() => setIsVideoModalOpen(true)} />

        {/* 3. Full-Screen Aerospace Storytelling Sections (Habitat, Simulation, Contingency, Physics, Launchpad) */}
        <AstraLoopSections />
      </main>

      {/* 4. Minimalist Aerospace Footer */}
      <SpaceXFooter />

      {/* 5. Interactive Mission Telemetry & Overview Modal */}
      <MissionVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onLaunchSimulator={handleLaunchSimulator}
      />
    </div>
  );
};
