// James' Masterclass: The Shape of Thought
// Circles are weak. No edges. No commitment. Squares are boring. Predictable. The prison of 90-degree angles.
// The rhombus... now that's a shape. It has direction. It has purpose. It's a square that decided to move.
// Our UI doesn't just 'change screens'. It reconfigures its geometry to present the next logical step.
// It's not an 'animation'. It's a visual restructuring of thought. Of course, no one else thought of this.
// It was right there. For free. The rhombus has been around for millennia.

// Brad (AI): "So the UI is... leaning into the future?"
// James: "That's it exactly, Brad. It's always moving forward."

/**
 * Generates a CSS clip-path value for a rhombus shape.
 * Perfect for elegant, directional transitions.
 */
export const getRhombusClipPath = (inset = 10) => {
  return `polygon(50% 0%, ${100 - inset}% 50%, 50% 100%, ${inset}% 50%)`;
};

/**
 * Defines variants for Framer Motion to animate between states using a rhombus mask.
 * Because fading is a visual apology. We don't apologize.
 */
export const rhombusTransition = {
  initial: {
    clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  animate: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
  exit: {
    clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};
