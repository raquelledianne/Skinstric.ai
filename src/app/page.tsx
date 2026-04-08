'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import HoverEffects from './HoverEffects';

type HoverState = 'none' | 'hoverRight' | 'hoverLeft';

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hoverState, setHoverState] = useState<HoverState>('none');
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  if (!headingRef.current) return;

  const el = headingRef.current;

  // Smooth transition (already buttery)
  el.style.transition =
    'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease';

  switch (hoverState) {
    case 'hoverRight':
      el.style.transform = 'translate3d(-200px, 0, 0)'; // <-- slide further left
      el.style.opacity = '0.9';
      break;

    case 'hoverLeft':
      el.style.transform = 'translate3d(200px, 0, 0)'; // <-- slide further right
      el.style.opacity = '0.9';
      break;

    default:
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = fadeIn ? '1' : '0'; 
      break;
  }
}, [hoverState, fadeIn]);

  return (
    <main className="intro-page">
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <Link href="/" className="brand">SKINSTRIC</Link>
            <Image src="/location.png" alt="bracket" width={70} height={20} />
          </div>
          <button className="header-button">ENTER CODE</button>
        </div>
      </header>

      <div className="intro-content" style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px' }}>
        <h1
          className="intro-heading"
          ref={headingRef}
          style={{ opacity: 0 }}
        >
          Sophisticated <br />
          <span>skincare</span>
        </h1>

        <p className="intro-description desktop-only">
          Skinstric developed an A.I. that creates a highly-personalized
          routine tailored to what your skin needs.
        </p>

        <div className="intro-button-wrapper">
          <a href="/testing">
            <button className="intro-button">ENTER EXPERIENCE</button>
          </a>
        </div>
      </div>

      <HoverEffects onHoverChange={setHoverState} />

      <div className="rhombus-bg"></div>
    </main>
  );
}