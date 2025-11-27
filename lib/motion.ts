// Shared animation constants for consistent motion throughout the portfolio

// Easing curves
export const ease = [0.25, 0.1, 0.25, 1] as const;
export const easeOut = [0.16, 1, 0.3, 1] as const;

// Spring configs - playful physics with overshoot
export const spring = { type: "spring" as const, stiffness: 300, damping: 20 };
export const springSnappy = { type: "spring" as const, stiffness: 400, damping: 15 };
export const springBouncy = { type: "spring" as const, stiffness: 500, damping: 12, mass: 0.8 };
export const springLoose = { type: "spring" as const, stiffness: 200, damping: 18, mass: 1 };

// Durations
export const duration = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.6,
};

// Reusable variants
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease },
  },
};

// Stagger container factory
export const staggerContainer = (staggerDelay = 0.08) => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
  },
});

// Child item for stagger
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease },
  },
};

// Viewport settings
export const viewportOnce = { once: true, margin: "-100px" };
export const viewportOnceEarly = { once: true, margin: "-50px" };
