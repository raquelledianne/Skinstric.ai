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

  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // CAMERA ACCESS
  useEffect(() => {
    if (mode === 'camera' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setError('Camera access denied'));
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [mode]);

  // PERMISSION FLOW
  const handleAllowCamera = () => {
    setShowPermissionPopup(false);
    setCameraLoading(true);

    setTimeout(() => {
      setCameraLoading(false);
      setMode('camera');
    }, 3000);
  };

  const handleDenyCamera = () => setShowPermissionPopup(false);

  // CAPTURE
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Full = canvas.toDataURL('image/jpeg');
    const base64 = base64Full.split(',')[1];

    // Freeze + flash
    setCapturedFrame(base64Full);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    try {
      setProcessing(true);
      await fetch(
        'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        }
      );
      localStorage.setItem('capturedImage', base64);
      setShowSuccessPopup(true);
    } catch {
      setError('Failed to send image to API.');
    } finally {
      setProcessing(false);
    }
  };

  // UPLOAD
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
        await fetch(
          'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          }
        );
        localStorage.setItem('capturedImage', base64);
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
      {/* HEADER */}
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="" width={70} height={20} />
        </div>
        <p className="start-analysis">TO START ANALYSIS</p>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

      {/* CAMERA LOADING */}
      {cameraLoading && (
        <div className="camera-loading-screen">
          <div className="camera-stack">
            <div className="camera-overlay">
              <div className="camera-loading-rombuses">
                <Image src="/rombuses.png" fill alt="" className="rombuses-img" />
              </div>
              <div className="camera-glow" />
              <div className="camera-main-wrapper">
                <img src="/camera-setup.png" alt="Camera" className="camera-main-img" />
                <p className="camera-loading-text">Setting up your camera...</p>
              </div>
            </div>
            <img src="/setup.png" alt="Setup" className="camera-setup-base" />
          </div>
        </div>
      )}

      {/* MAIN UI */}
      {!cameraLoading && (
        <>
          {mode === 'select' && (
            <div className="camera-selection-row">
              <div className="camera-card" onClick={() => setShowPermissionPopup(true)}>
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" fill alt="" className="spinning-rombuses-2" />
                  <Image src="/camera.png" alt="" width={280} height={280} />
                </div>
                <p className="camera-label">ALLOW A.I.<br />TO SCAN YOUR FACE</p>
              </div>

              <div className="camera-card">
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" fill alt="" className="spinning-rombuses" />
                  <label htmlFor="file-upload">
                    <Image src="/gallery.png" alt="" width={280} height={280} />
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} hidden />
                </div>
                <p className="camera-label">ALLOW A.I.<br />ACCESS GALLERY</p>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="camera-mode-container-fullscreen">
              {error && <p className="error-message">{error}</p>}

              {!capturedFrame ? (
                <video ref={videoRef} autoPlay playsInline className="camera-video-fullscreen" />
              ) : (
                <img src={capturedFrame} className="camera-video-fullscreen" />
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {flash && <div className="camera-flash" />}

              {showSuccessPopup && (
                <>
                  <div className="camera-dim" />
                  <div className="great-shot-wrapper">
                    <Image src="/great-shot.png" alt="Great Shot" width={400} height={120} />
                  </div>
                  <Image
                    src="/proceed-white.png"
                    alt="Proceed"
                    width={70}
                    height={30}
                    className="proceed-button show"
                    onClick={() => router.push('/demographics')}
                  />
                </>
              )}

              <div className="take-pic-wrapper">
                <Image
                  src="/take-pic.png"
                  alt="Take Picture"
                  width={160}
                  height={60}
                  onClick={!showSuccessPopup ? handleCapture : undefined}
                  className="take-pic-button"
                />
              </div>

              {/* BACK BUTTON */}
              {mode === 'camera' && (
                <div className="testing-back">
                  <Link href="/location" className="back-link">
                    <div className="back-group">
                      <Image src="/camera-back.png" alt="Back" className="back-image" width={120} height={64} />
                    </div>
                  </Link>
                </div>
              )}

              <div className="camera-text-bottom">
                <Image src="/camera-text.png" alt="" width={570} height={70} />
              </div>
            </div>
          )}
        </>
      )}

      {/* PERMISSION POPUP */}
      {showPermissionPopup && (
        <div className="camera-popup-overlay">
          <div className="camera-popup">
            <p>Allow A.I to access your camera</p>
            <div className="camera-popup-buttons">
              <button onClick={handleDenyCamera}>Deny</button>
              <button onClick={handleAllowCamera}>Allow</button>
            </div>
          </div>
        </div>
      )}

      {/* BACK BUTTON FOR NON-CAMERA PAGES */}
      {mode !== 'camera' && (
        <div className="testing-back">
          <Link href="/location" className="back-link">
            <div className="back-group">
              <Image src="/back-button.png" alt="Back" className="back-image" width={120} height={64} />
            </div>
          </Link>
        </div>
      )}
    </main>
  );
}