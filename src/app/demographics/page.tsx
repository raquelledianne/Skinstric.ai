'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function DemographicsPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const goToSummary = () => router.push('/summary');

  return (
    <main className="demographics-page">
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      <div className="top-left-info">
        <h1>A.I. ANALYSIS</h1>
        <p>
          A.I. has estimated the following.<br/>
          Fix estimated information if needed.
        </p>
      </div>

      <div className="diamond-container">
        <div className={`rombuses-background ${hovered ? 'visible' : ''}`}>
          <Image src="/rombuses.png" alt="Rotating Rombuses" fill style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} />
        </div>

        {/* Top Diamond */}
        <button className="analysis-button top" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={goToSummary}>
          <span>Demographics</span>
        </button>

        {/* Other diamonds disabled */}
        <button className="analysis-button left disabled"><span>Cosmetic Concerns</span></button>
        <button className="analysis-button right disabled"><span>Skin Type Details</span></button>
        <button className="analysis-button bottom disabled"><span>Weather</span></button>
      </div>

      {/* Get Summary button */}
      <Image src="/summary.png" alt="Get Summary" width={150} height={70} className="summary-button" onClick={goToSummary} />

      <div className="testing-back">
        <Link href="/camera" className="back-link">
          <div className="back-group">
            <Image src="/back-button.png" alt="Back Button" width={120} height={64} className="back-image"/>
          </div>
        </Link>
      </div>
    </main>
  );
}