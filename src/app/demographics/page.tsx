'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function DemographicsPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <main className="demographics-page">
      
      {/* Header */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      {/* Top-left info */}
      <div className="top-left-info">
        <h1>A.I. ANALYSIS</h1>
        <p>
          A.I. has estimated the following.<br/>
          Fix estimated information if needed.
        </p>
      </div>

      {/* Diamond container */}
      <div className="diamond-container">

        {/* Background Rombuses */}
        <div className={`rombuses-background ${hovered ? 'visible' : ''}`}>
          <Image
            src="/rombuses.png"
            alt="Rotating Rombuses"
            fill
            style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
          />
        </div>

        {/* Top: Demographics (clickable) */}
        <button
          className="analysis-button top"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => router.push('/summary')}
        >
          <span>Demographics</span>
        </button>

        {/* Left: Cosmetic Concerns (disabled) */}
        <button className="analysis-button left disabled">
          <span>Cosmetic Concerns</span>
        </button>

        {/* Right: Skin Type Details (disabled) */}
        <button className="analysis-button right disabled">
          <span>Skin Type Details</span>
        </button>

        {/* Bottom: Weather (disabled) */}
        <button className="analysis-button bottom disabled">
          <span>Weather</span>
        </button>

      </div>

      <div className="testing-back">
        <Link href="/camera" className="back-link">
          <div className="back-group">
            <Image
              src="/back-button.png"
              alt="Back Button"
              width={120}
              height={64}
              className="back-image"
            />
          </div>
        </Link>
      </div>
    </main>
  );
}