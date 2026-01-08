'use client';

import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md w-screen h-screen">
      <motion.div
        className="relative h-28 w-28"
        animate={{ 
          y: [0, -4, 0],
          opacity: [0.75, 1, 0.75]  // pulsing opacity
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <div className="ball-loader relative h-full w-full rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 seam-tilt"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          >
            <div className="absolute left-1/2 top-0 h-full w-[16px] -translate-x-1/2 seam">
              <div className="absolute left-1/2 top-[10px] h-[calc(100%-20px)] w-full -translate-x-1/2 stitches" />
            </div>
          </motion.div>

          <div className="absolute left-4 top-4 h-9 w-9 rounded-full bg-white/35 blur-[1px]" />
          <div className="absolute left-7 top-7 h-4 w-4 rounded-full bg-white/40 blur-[1px]" />
          <div className="absolute inset-0 leather" />
        </div>

        <style jsx global>{`
          .ball-loader {
            background:
              radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), transparent 40%),
              radial-gradient(circle at 65% 75%, rgba(0,0,0,0.28), transparent 60%),
              linear-gradient(145deg, #c11e24, #7a0c10);
            box-shadow:
              0 18px 36px rgba(0,0,0,0.28),
              inset 0 8px 14px rgba(255,255,255,0.1),
              inset 0 -14px 18px rgba(0,0,0,0.3);
          }

          .leather {
            background-image: radial-gradient(
              rgba(255,255,255,0.05) 1px,
              transparent 1px
            );
            background-size: 7px 7px;
            opacity: 0.3;
            mix-blend-mode: overlay;
          }

          .seam-tilt {
            transform: rotate(18deg) skewX(-8deg);
            transform-origin: center;
          }

          .seam {
            border-radius: 999px;
            background: linear-gradient(
              to right,
              rgba(255,255,255,0.9),
              rgba(255,255,255,0.4),
              rgba(255,255,255,0.9)
            );
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);
          }

          .stitches {
            border-radius: 999px;
            background-image: repeating-linear-gradient(
              135deg,
              rgba(255,255,255,0.95) 0px,
              rgba(255,255,255,0.95) 2px,
              transparent 2px,
              transparent 9px
            );
          }
        `}</style>
      </motion.div>
    </div>
  );
}
