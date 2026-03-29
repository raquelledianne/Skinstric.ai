'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CameraPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera access
  useEffect(() => {
    if (mode === 'camera' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => setError('Camera access denied'));
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [mode]);

  // Capture photo from camera
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const apiPromise = fetch(
        'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        }
      ).then(res => res.json());

      const delay = new Promise(resolve => setTimeout(resolve, 3000));

      await Promise.all([apiPromise, delay]);
      
      // ✅ Show success popup
      setShowSuccessPopup(true);

    } catch {
      setError('Failed to send image to API.');
    } finally {
      setProcessing(false);
    }
  };

  // Upload photo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setMode('upload');
    setProcessing(true);

    const reader = new FileReader();
    reader.readAsDataURL(selected);
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (!base64) return;

      try {
        const apiPromise = fetch(
          'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          }
        ).then(res => res.json());

        const delay = new Promise(resolve => setTimeout(resolve, 3000));

        await Promise.all([apiPromise, delay]);
        
        // ✅ Show success popup
        setShowSuccessPopup(true);

      } catch {
        setError('Failed to send image to API.');
      } finally {
        setProcessing(false);
      }
    };
  };

  return (
    <main className="camera-page">
      {/* Header */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="bracket" width={70} height={20} />
        </div>
        <p className="start-analysis">TO START ANALYSIS</p>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      {/* Loading state */}
      {processing ? (
        <div className="loading-screen">
          {file && (
            <div className="preview-box">
              <span className="preview-label">Preview</span>
              <img src={URL.createObjectURL(file)} alt="Preview" className="preview-image" />
            </div>
          )}
          <div className="rotating-background">
            <Image
              src="/rombuses.png"
              alt="Spinning Rhombus Background"
              fill
              style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
            />
          </div>
          <div className="loading-text-container">
            <p className="loading-text">Preparing your analysis</p>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top-right preview */}
          {file && !processing && (
            <div className="preview-box">
              <span className="preview-label">Preview</span>
              <img src={URL.createObjectURL(file)} alt="Preview" className="preview-image" />
            </div>
          )}

          {/* Selection Mode */}
          {mode === 'select' && (
            <div className="camera-selection-row">
              {/* Camera Card */}
              <div className="camera-card" onClick={() => setMode('camera')}>
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" alt="Spinning Rhombus" fill style={{ objectFit: 'contain', filter: 'brightness(0.3)' }} className="spinning-rombuses" />
                  <Image src="/camera.png" alt="Camera Icon" width={280} height={280} className="camera-icon-large" />
                </div>
                <p className="camera-label">
                  ALLOW A.I.<br />TO SCAN YOUR FACE
                </p>
              </div>

              {/* Gallery Card */}
              <div className="camera-card">
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" alt="Spinning Rhombus" fill style={{ objectFit: 'contain', filter: 'brightness(0.3)' }} className="spinning-rombuses" />
                  <label htmlFor="file-upload">
                    <Image src="/gallery.png" alt="Gallery Icon" width={280} height={280} className="camera-icon-large" />
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                </div>
                <p className="camera-label">
                  ALLOW A.I.<br />ACCESS GALLERY
                </p>
              </div>
            </div>
          )}

          {/* Camera Mode */}
          {mode === 'camera' && (
            <div className="camera-mode-container">
              {error && <p className="error-message">{error}</p>}
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button className="capture-button" onClick={handleCapture}>Capture</button>
            </div>
          )}

          {/* Upload Mode */}
          {mode === 'upload' && file && (
            <div className="upload-mode-placeholder">
              <p>{`Uploaded: ${file.name}`}</p>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
      <div className="testing-back">
        <Link href="/location" className="back-link">
          <div className="back-group">
            <Image src="/back-button.png" alt="Back Button" width={120} height={64} className="back-image" />
          </div>
        </Link>
      </div>

      {/* Canvas hidden */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <p>Image uploaded successfully!</p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                router.push('/demographics');
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}