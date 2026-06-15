import React from 'react';

/**
 * MonogramBadge — embossed typography monogram (initials).
 * Uses dual drop-shadows: white highlight top-left, charcoal shadow bottom-right.
 * Props:
 *   initials — string, e.g. "A & I" or "RF"
 *   size     — 'sm' | 'md' | 'lg'
 */
function MonogramBadge({ initials = 'E', size = 'md' }) {
  const fontSizes = { sm: '32px', md: '56px', lg: '80px' };

  return (
    <div
      className="monogram-emboss"
      style={{ fontSize: fontSizes[size] }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default MonogramBadge;
