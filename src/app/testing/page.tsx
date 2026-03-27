'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function TestingPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Fix hydration for rhombus
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        }
      );

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      console.log('API response:', data);
      setSuccess('Success! Redirecting...');
      setName('');
      
      // Redirect to /location page after success
      router.push('/location');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="testing-main">
      {/* Header */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/Rectangle2710.png" alt="left bracket" width={5} height={19} />
          <p>INTRO</p>
          <Image src="/Rectangle2711.png" alt="right bracket" width={5} height={19} />
        </div>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      {/* Main Content */}
      <div className="testing-content">
        {mounted && (
          <div className="rotating-background">
            <Image
              src="/rombuses.png"
              alt="Rotating Rhombuses"
              fill
              style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} // darker
            />
          </div>
        )}

        <div className="intro-wrapper">
          <p className="uppercase">CLICK TO TYPE</p>
          <form className="testing-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Introduce Yourself"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </form>

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