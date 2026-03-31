'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LocationPage() {
  const searchParams = useSearchParams();
  const nameFromQuery = searchParams.get('name') || '';
  const router = useRouter();

  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isValidCity = (value: string) => /^[A-Za-z\s]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    const storedName =
      nameFromQuery || localStorage.getItem('name')?.trim() || '';

    if (!trimmedCity) {
      setError('City is required.');
      return;
    }
    if (!isValidCity(trimmedCity)) {
      setError('City can only contain letters and spaces.');
      return;
    }
    if (!storedName) {
      setError('Name is missing. Please go back and enter your name.');
      return;
    }

    setError(null);
    setLoading(true);

    const startTime = Date.now();

    try {
      const res = await fetch(
        'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: storedName, location: trimmedCity }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || 'API request failed.');

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 2000 - elapsed);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setCity('');
      }, delay);
    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 2000 - elapsed);

      setTimeout(() => {
        if (err instanceof Error) setError(err.message);
        else setError('Something went wrong.');
        setLoading(false);
      }, delay);
    }
  };

  return (
    <main className="testing-main">
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">
            SKINSTRIC
          </Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>

        <p className="start-analysis">TO START ANALYSIS</p>

        <button className="testing-header-button">ENTER CODE</button>
      </header>

      <div className="testing-content">
        {mounted && (
          <div className="rotating-background">
            <Image
              src="/rombuses.png"
              alt="Rotating Rhombuses"
              fill
              style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
            />
          </div>
        )}

        <div className="intro-wrapper">
          {!loading && !success && !error && (
            <p className="uppercase">CLICK TO TYPE</p>
          )}

          <form className="testing-form" onSubmit={handleSubmit}>
            <div className="input-container">
              {!loading && !success && (
                <input
                  type="text"
                  placeholder="Your city name"
                  autoComplete="off"
                  autoFocus
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              )}

              {loading && (
                <div className="loading-box">
                  Processing submission
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}

              {success && !loading && (
                <div className="success-box">
                  Success! Proceed to the next step.
                </div>
              )}
            </div>
          </form>

          {error && !loading && (
            <div className="status-message">
              <p className="error-message">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ ALWAYS MOUNTED → animation now works */}
      <Image
        src="/proceed.png"
        alt="Proceed"
        width={140}
        height={72}
        className={`proceed-button ${success && !loading ? 'show' : ''}`}
        onClick={() => success && router.push('/camera')}
      />

      <div className="testing-back">
        <Link href="/testing" className="back-link">
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