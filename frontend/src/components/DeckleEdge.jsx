import React from 'react';

/**
 * DeckleEdge — SVG paper-tear divider.
 * Replaces <hr> with an organic, hand-torn edge motif.
 * Props:
 *   flip  — boolean, flips the tear vertically
 *   color — fill color (default: var(--surface-container))
 */
function DeckleEdge({ flip = false, color = 'var(--surface-container)', className = '' }) {
  return (
    <div
      className={`deckle-divider ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 32"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: '32px', display: 'block', width: '100%' }}
      >
        {/* Hand-torn paper edge path — variable stroke weight line art */}
        <path
          d="
            M0,18 C18,12 30,22 50,16 C65,11 78,24 95,17 C112,10 126,23 144,15
            C162,7 178,26 198,18 C218,10 235,25 258,17 C278,10 294,22 316,16
            C338,10 352,27 374,19 C394,12 412,24 436,15 C456,8 472,26 496,18
            C516,11 534,23 556,16 C578,9 592,24 614,17 C636,10 650,26 672,18
            C694,11 712,23 734,16 C756,9 770,25 794,17 C814,10 830,24 852,16
            C874,9 890,27 912,18 C932,11 948,23 972,15 C992,8 1008,26 1032,18
            C1052,11 1068,25 1092,16 C1112,9 1132,24 1152,17 C1172,11 1188,22 1200,18
            L1200,32 L0,32 Z
          "
          fill={color}
        />
      </svg>
    </div>
  );
}

export default DeckleEdge;
