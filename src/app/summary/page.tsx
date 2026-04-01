'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type APIData = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

type ActualData = {
  race: string | null;
  age: string | null;
  gender: string | null;
};

export default function SummaryPage() {
  const router = useRouter();

  const [data, setData] = useState<APIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actual, setActual] = useState<ActualData>({
    race: null,
    age: null,
    gender: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<keyof APIData>('race');
  const [animatedValue, setAnimatedValue] = useState(0);

  
  useEffect(() => {
    const fetchResults = async () => {
      const base64 = localStorage.getItem('capturedImage');
      if (!base64) return router.push('/camera');

      try {
        const res = await fetch(
          'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          }
        );

        
        const json: { data: APIData } = (await res.json()) as { data: APIData };

        if (!json.data) throw new Error('No data returned from API');

        setData(json.data);

        
        const getHighestKey = (obj: Record<string, number>): string | null => {
          const entries = Object.entries(obj);
          if (!entries.length) return null;
          return entries.sort((a, b) => b[1] - a[1])[0][0];
        };

        setActual({
          race: getHighestKey(json.data.race),
          age: getHighestKey(json.data.age),
          gender: getHighestKey(json.data.gender),
        });
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  
  useEffect(() => {
    if (!data) return;

    const selectedData = data[selectedCategory];
    const highestValue = Math.max(...Object.values(selectedData)) * 100;

    let start = 0;
    const increment = highestValue / 60; // ~60 frames

    const interval = setInterval(() => {
      start += increment;
      if (start >= highestValue) {
        setAnimatedValue(highestValue);
        clearInterval(interval);
      } else {
        setAnimatedValue(start);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [data, selectedCategory]);

  if (loading) return <p className="summary-loading">Loading summary...</p>;
  if (!data) return <p className="summary-loading">No data available.</p>;

  const sortScores = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ key, value: (value * 100).toFixed(2) }));

  const highestLabel = Object.entries(data[selectedCategory])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const handleUpdateActual = (category: keyof ActualData, value: string) => {
    setActual(prev => ({ ...prev, [category]: value }));
  };

  return (
    <main className="summary-page">

      {/* ===== Header ===== */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      
      <div className="summary-header-text">
        <p className="start-analysis-summary">A.I. ANALYSIS</p>
        <h3 className="summary-h3">DEMOGRAPHICS</h3>
        <p className="start-analysis-summary">PREDICTED RACE & AGE</p>
      </div>

      
      <div className="summary-layout-wrapper">
        <div className="summary-layout">

          {/* Sidebar */}
          <aside className="summary-card summary-sidebar">
            <h2>A.I. Confidence</h2>
            {(['race', 'age', 'gender'] as (keyof ActualData)[]).map(category => (
              <div
                key={category}
                className={`attribute-item ${selectedCategory === category ? 'font-semibold' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}: {actual[category] ?? 'N/A'}
              </div>
            ))}
          </aside>

          
          <div className="summary-card summary-chart-container">
            <svg width="200" height="200">
              <circle cx="100" cy="100" r="90" stroke="#e5e7eb" strokeWidth="20" fill="none" />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#111"
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${(animatedValue / 100) * 565.48} 565.48`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <p>{highestLabel}: {animatedValue.toFixed(1)}%</p>
          </div>

          
          <div className="summary-card summary-confidence-list">
            <div className="confidence-section">
              <h3>{selectedCategory.toUpperCase()}</h3>
              <ul className="confidence-list">
                {sortScores(data[selectedCategory]).map(({ key, value }) => (
                  <li key={key} onClick={() => handleUpdateActual(selectedCategory, key)}>
                    {key}: {value}%
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      
      <p className="summary-instruction">
        If A.I estimate is wrong, select the correct one
      </p>

     
      <div className="testing-back">
        <Link href="/demographics" className="back-link">
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

      
      <div className="summary-actions">
        <Link href="/" className="action-btn">
          <Image
            src="/reset.png"
            alt="Reset"
            width={100}
            height={40}
            className="action-image"
          />
        </Link>

        <div className="action-btn">
          <Image
            src="/confirm.png"
            alt="Confirm"
            width={100}
            height={40}
            className="action-image"
          />
        </div>
      </div>

    </main>
  );
}