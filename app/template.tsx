"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.96,
        filter: "blur(20px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Smooth easing
        opacity: { duration: 0.25 },
        scale: { duration: 0.5 },
        filter: { duration: 0.25 },
      }}
    >
      {children}
    </motion.div>
  );
}
