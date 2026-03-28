'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function TestingPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false); // kept (even if unused visually)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      setError('Name can only contain letters and spaces');
      return;
    }

    setError(null);
    setSuccess(null);

    // ✅ Store name instead of calling API
    localStorage.setItem('name', trimmedName);

    // Optional success message (brief)
    setSuccess('Success! Redirecting...');
    setName('');

    // Redirect to location page
    router.push('/location');
  };

  return (
    <main className="testing-main">
      
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      <p className="start-analysis">TO START ANALYSIS</p>


      <div className="testing-content">
        {mounted && (
          <div className="rotating-background">
            <Image
              src="/rombuses.png"
              alt="Rotating Rhombuses"
              fill
              style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
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