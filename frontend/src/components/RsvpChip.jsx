import React from 'react';

/**
 * RsvpChip — spring-physics selection chip.
 * Props:
 *   label    — text label
 *   icon     — emoji or string icon prefix
 *   selected — boolean
 *   onClick  — handler
 */
function RsvpChip({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rsvp-chip ${selected ? 'selected' : ''}`}
      style={{ outline: 'none' }}
    >
      {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      {label}
    </button>
  );
}

export default RsvpChip;
