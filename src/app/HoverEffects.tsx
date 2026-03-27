'use client';

import Image from 'next/image';
import { useState } from 'react';

interface HoverEffectsProps {
  onHoverChange?: (hovered: 'hoverRight' | 'hoverLeft' | 'none') => void;
}

export default function HoverEffects({ onHoverChange }: HoverEffectsProps) {
  const [hoverRight, setHoverRight] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);

  const handleRightEnter = () => {
    setHoverRight(true);
    onHoverChange?.('hoverRight');
  };
  const handleRightLeave = () => {
    setHoverRight(false);
    onHoverChange?.('none');
  };

  const handleLeftEnter = () => {
    setHoverLeft(true);
    onHoverChange?.('hoverLeft');
  };
  const handleLeftLeave = () => {
    setHoverLeft(false);
    onHoverChange?.('none');
  };

  // Disable hover effects on smaller screens
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) return null;

  return (
    <>
      {/* Right side button */}
      <div
        className="side-section right"
        style={{
          flexDirection: 'row',
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: hoverLeft ? 0 : 1, // hide opposite side when left hovered
          pointerEvents: hoverLeft ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >
        <Image
          src="/Rectangle 2778.png"
          alt="Right Rhombus"
          width={302}
          height={604}
          style={{ objectFit: 'contain' }}
        />
        <a href="/testing">
          <button
            style={{
              position: 'absolute',
              top: '50%',
              right: '40px',
              transform: `translateY(-50%) scale(${hoverRight ? 1.1 : 1})`, // SCALE only
              transition: 'transform 0.2s ease', // smooth scale
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={handleRightEnter}
            onMouseLeave={handleRightLeave}
          >
            <Image src="/take-test.png" alt="Take Test" width={127} height={44} />
          </button>
        </a>
      </div>

      {/* Left side button */}
      <div
        className="side-section left"
        style={{
          flexDirection: 'row-reverse',
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: hoverRight ? 0 : 1, // hide opposite side when right hovered
          pointerEvents: hoverRight ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >
        <Image
          src="/Rectangle 2779.png"
          alt="Left Rhombus"
          width={302}
          height={604}
          style={{ objectFit: 'contain' }}
        />
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: '40px',
            transform: `translateY(-50%) scale(${hoverLeft ? 1.1 : 1})`, // SCALE only
            transition: 'transform 0.2s ease', // smooth scale
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={handleLeftEnter}
          onMouseLeave={handleLeftLeave}
        >
          <Image src="/discover.png" alt="Discover" width={150} height={44} />
        </button>
      </div>
    </>
  );
}