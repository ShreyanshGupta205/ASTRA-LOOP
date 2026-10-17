import React from 'react';
import { motion } from 'framer-motion';
import { CurtainButton } from './CurtainButton';
import { ScrollIndicator } from './ScrollIndicator';

interface SpaceXVisionSectionProps {
  onExploreClick?: () => void;
}

export const SpaceXVisionSection: React.FC<SpaceXVisionSectionProps> = ({ onExploreClick }) => {
  return (
    <section
      id="vision"
      className="relative w-full h-screen min-h-[700px] flex items-end overflow-hidden bg-black select-none border-t border-white/10"
    >
      {/* Background Visual: Mars / Deep Space Earth Limb */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=2560&q=85"
          alt="Mars Surface and Deep Space Horizon"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Typography & CTA */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 md:px-16 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="font-din text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] text-white/80 uppercase block mb-3">
            HUMANITY'S HORIZON // BEYOND EARTH
          </span>

          <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-[0.05em] text-white leading-[1.05] mb-6">
            MAKING LIFE
            <br />
            MULTIPLANETARY
          </h2>

          <p className="text-white/75 font-sans text-sm md:text-base max-w-[520px] mb-8 leading-relaxed font-normal">
            Founded under the belief that a future where humanity is out exploring the stars is fundamentally more exciting than one where we are not.
          </p>

          <div>
            <CurtainButton onClick={onExploreClick} id="explore-vision-cta">
              EXPLORE
            </CurtainButton>
          </div>
        </motion.div>
      </div>

      <ScrollIndicator targetId="schedule" />
    </section>
  );
};
