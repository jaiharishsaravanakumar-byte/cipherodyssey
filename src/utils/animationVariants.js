
export const inputShakeVariant = {
  idle: { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: {
      duration: 0.32,
      ease: 'easeInOut',
    },
  },
};

export const successPopVariant = {
  idle: { scale: 1, opacity: 1 },
  pop: {
    scale: [1, 1.22, 1],
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export const letterTransitionVariant = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.12, ease: 'easeIn' } },
};

export const stepContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

export const stepItemVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};
