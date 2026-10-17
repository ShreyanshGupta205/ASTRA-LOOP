import React from 'react';
import { motion } from 'framer-motion';
import { CurtainButton } from './CurtainButton';
import { ScrollIndicator } from './ScrollIndicator';

interface FeatureItem {
  id: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaText: string;
  imageSrc: string;
  nextSectionId?: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'starship',
    eyebrow: 'STARSHIP & SUPER HEAVY',
    titleLine1: 'REVOLUTIONIZING',
    titleLine2: 'SPACE TECHNOLOGY',
    description:
      'A fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars, and beyond, capable of delivering over 100 metric tons into orbit with complete rapid turnaround.',
    ctaText: 'LEARN MORE',
    imageSrc: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=2560&q=85',
    nextSectionId: 'falcon9',
  },
  {
    id: 'falcon9',
    eyebrow: 'FALCON 9 & FALCON HEAVY',
    titleLine1: "WORLD'S LEADING",
    titleLine2: 'LAUNCH PROVIDER',
    description:
      'The world’s first orbital class reusable rocket, enabling reliable, cost-efficient satellite deployment, commercial crew rotations, and deep space exploration payloads.',
    ctaText: 'RESERVE YOUR RIDE',
    imageSrc: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=2560&q=85',
    nextSectionId: 'dragon',
  },
  {
    id: 'dragon',
    eyebrow: 'CREW & CARGO DRAGON',
    titleLine1: 'ADVANCING HUMAN',
    titleLine2: 'SPACEFLIGHT',
    description:
      'Returning human spaceflight to America with autonomous rendezvous, docking, and safe atmospheric reentry. Serving as the primary crew ferry to low-Earth orbit and Lunar Gateway support.',
    ctaText: 'JOIN A MISSION',
    imageSrc: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2560&q=85',
    nextSectionId: 'starlink',
  },
  {
    id: 'starlink',
    eyebrow: 'GLOBAL LOW-LATENCY SATELLITE NETWORK',
    titleLine1: 'DELIVERING HIGH-SPEED',
    titleLine2: 'INTERNET FROM SPACE',
    description:
      'Engineered and operated by SpaceX, Starlink is the world’s first and largest satellite constellation utilizing low Earth orbit to deliver broadband internet capable of supporting streaming, video calls, and mission-critical telemetry.',
    ctaText: 'ORDER NOW',
    imageSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=85',
    nextSectionId: 'starmind',
  },
  {
    id: 'starmind',
    eyebrow: 'AUTONOMOUS ORBITAL EDGE INFRASTRUCTURE',
    titleLine1: 'DEVELOPING ORBITAL',
    titleLine2: 'AI COMPUTE',
    description:
      'Deploying radiation-hardened distributed compute arrays in orbit to power autonomous lunar habitat survival intelligence, deep space telemetry fusion, and real-time mission anomaly recovery.',
    ctaText: 'STARMIND',
    imageSrc: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2560&q=85',
    nextSectionId: 'footer',
  },
];

interface SpaceXFeatureStackProps {
  onFeatureCtaClick?: (featureId: string) => void;
}

export const SpaceXFeatureStack: React.FC<SpaceXFeatureStackProps> = ({ onFeatureCtaClick }) => {
  return (
    <div className="w-full">
      {FEATURES.map((feat) => (
        <section
          key={feat.id}
          id={feat.id}
          className="relative w-full h-screen min-h-[700px] flex items-end overflow-hidden bg-black select-none border-t border-white/10"
        >
          {/* Background Visual */}
          <div className="absolute inset-0 z-0">
            <img
              src={feat.imageSrc}
              alt={feat.eyebrow}
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.12]"
              loading="lazy"
            />
            {/* Contrast Gradients */}
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
                {feat.eyebrow}
              </span>

              <h2 className="font-din text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-[0.05em] text-white leading-[1.05] mb-6">
                {feat.titleLine1}
                <br />
                {feat.titleLine2}
              </h2>

              <p className="text-white/75 font-sans text-sm md:text-base max-w-[520px] mb-8 leading-relaxed font-normal">
                {feat.description}
              </p>

              <div>
                <CurtainButton
                  onClick={() => onFeatureCtaClick && onFeatureCtaClick(feat.id)}
                  id={`cta-${feat.id}`}
                >
                  {feat.ctaText}
                </CurtainButton>
              </div>
            </motion.div>
          </div>

          {feat.nextSectionId && <ScrollIndicator targetId={feat.nextSectionId} />}
        </section>
      ))}
    </div>
  );
};
