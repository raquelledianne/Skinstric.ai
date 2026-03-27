'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HoverEffectsProps {
  onHoverChange?: (hoverState: 'none' | 'hoverRight' | 'hoverLeft') => void;
}

export default function HoverEffects({ onHoverChange }: HoverEffectsProps) {
  const [hoverRight, setHoverRight] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024); // Only enable hover on desktop
    };
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) return null; // Don't render hover buttons on smaller screens

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

  return (
    <>
      {/* Right side */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          opacity: hoverLeft ? 0 : 1, // hide if left hovered
          pointerEvents: hoverLeft ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
          zIndex: 1,
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
              transform: 'translateY(-50%)',
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

      {/* Left side */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          opacity: hoverRight ? 0 : 1, // hide if right hovered
          pointerEvents: hoverRight ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
          zIndex: 1,
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
            transform: 'translateY(-50%)',
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