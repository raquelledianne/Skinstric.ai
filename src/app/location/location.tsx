'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LocationPage() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only render rhombus after client mounts
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city }),
        }
      );

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      setSuccess('Success! Your city was submitted.');
      setCity('');
      console.log('API response:', data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="testing-main">
      {/* Header */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">
            SKINSTRIC
          </Link>
          <Image src="/Rectangle2710.png" alt="left bracket" width={5} height={19} />
          <p>INTRO</p>
          <Image src="/Rectangle2711.png" alt="right bracket" width={5} height={19} />
        </div>

        <button className="testing-header-button">ENTER CODE</button>
      </header>

      {/* Main Content */}
      <div className="testing-content">
        {/* Rotating rhombus background */}
        {mounted && (
          <div className="rotating-background">
            <Image
              src="/rombuses.png"
              alt="Rotating Rhombuses"
              fill
              style={{ objectFit: 'cover', filter: 'brightness(0.6)' }} // darker
            />
          </div>
        )}

        {/* Form / Intro */}
        <div className="intro-wrapper">
          <p className="uppercase">CLICK TO TYPE</p>
          <form className="testing-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your city name"
              autoComplete="off"
              autoFocus
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <button type="submit" className="sr-only">
              Submit
            </button>
          </form>

          {/* Loading / Success / Error */}
          {loading && <p>Submitting...</p>}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </div>

      {/* Back button bottom-left */}
      <div className="testing-back">
        <Link href="/" className="back-link">
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