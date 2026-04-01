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
    const timer = setTimeout(() => setFadeIn(true), 300); // 0.3s delay
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    if (!headingRef.current) return;

    headingRef.current.style.transition =
      'transform 0.5s ease, text-align 0.5s ease, opacity 1s ease';

    
    switch (hoverState) {
      case 'hoverRight':
        headingRef.current.style.transform = 'translateX(-80px)'; // small shift left
        headingRef.current.style.textAlign = 'left';
        break;
      case 'hoverLeft':
        headingRef.current.style.transform = 'translateX(80px)'; // small shift right
        headingRef.current.style.textAlign = 'right';
        break;
      default:
        headingRef.current.style.transform = 'translateX(0)'; // centered
        headingRef.current.style.textAlign = 'center';
        break;
    }

   
    headingRef.current.style.opacity = fadeIn ? '1' : '0';
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