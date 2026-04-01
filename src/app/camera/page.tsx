'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CameraPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
  const [file, setFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  
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

  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    setGalleryPreview(URL.createObjectURL(selected));
    setShowLoading(true);

    const startTime = Date.now(); // track 3-second minimum

    const reader = new FileReader();
    reader.readAsDataURL(selected);

    reader.onload = async () => {
      try {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) {
          setError('Failed to process image.');
          setShowLoading(false);
          return;
        }

        const response = await fetch(
          'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
          }
        );

        if (!response.ok) {
          setError(`API error: ${response.status} ${response.statusText}`);
          setShowLoading(false);
          return;
        }

        localStorage.setItem('capturedImage', base64);

        
        const elapsed = Date.now() - startTime;
        const delay = elapsed < 3000 ? 3000 - elapsed : 0;
        setTimeout(() => {
          setShowSuccessPopup(true); // show popup on loading screen
        }, delay);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to upload: ${errorMsg}`);
        setShowLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setShowLoading(false);
    };

    reader.onabort = () => {
      setError('File read was cancelled.');
      setShowLoading(false);
    };
  };

  return (
    <main className="camera-page">
    
      <header className="testing-header">
        <div className="testing-header-left">
          <Link href="/" className="testing-brand">SKINSTRIC</Link>
          <Image src="/location.png" alt="" width={70} height={20} />
        </div>
        <p className="start-analysis">TO START ANALYSIS</p>
        <button className="testing-header-button">ENTER CODE</button>
      </header>

     
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

      
      {showLoading && galleryPreview && (
        <div className="loading-screen">
          <div className="camera-loading-rombuses">
            <Image src="/rombuses.png" fill alt="" className="rombuses-img" />
          </div>
          <p className="loading-text">Preparing your analysis...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          {/* Gallery preview with text ABOVE the image */}
          <div
            style={{
              position: 'absolute',
              top: '100px',
              right: '40px',
              zIndex: 50,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                marginBottom: '4px',
                fontWeight: 'bold',
                color: '#1a202c',
                fontSize: '14px',
                letterSpacing: '0.5px',
              }}
            >
              Preview
            </p>
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              }}
            >
              <Image
                src={galleryPreview}
                alt="Gallery Preview"
                width={150}
                height={150}
                style={{ objectFit: 'cover', width: '150px', height: '150px' }}
              />
            </div>
          </div>
        </div>
      )}

      
      {!cameraLoading && !showLoading && (
        <>
          {mode === 'select' && (
            <div className="camera-selection-row">
              {/* CAMERA CARD */}
              <div className="camera-card" onClick={() => setShowPermissionPopup(true)}>
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" fill alt="" className="spinning-rombuses-2" />
                  <Image src="/camera.png" alt="" width={280} height={280} />
                </div>
                <p className="camera-label">ALLOW A.I.<br />TO SCAN YOUR FACE</p>
              </div>

              {/* GALLERY CARD */}
              <div className="camera-card">
                <div className="icon-with-rombuses">
                  <Image src="/rombuses.png" fill alt="" className="spinning-rombuses" />
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      cursor: 'pointer',
                      display: 'block',
                      width: '280px',
                      height: '280px',
                      position: 'relative',
                      zIndex: 10,
                    }}
                  >
                    <Image src="/gallery.png" alt="Gallery" width={280} height={280} style={{ pointerEvents: 'none' }} />
                  </label>
                </div>
                <p className="camera-label">ALLOW A.I.<br /> TO ACCESS GALLERY</p>
              </div>

              
              {galleryPreview && (
                <div
                  style={{
                    position: 'absolute',
                    top: '80px',
                    right: '40px',
                    zIndex: 50,
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      marginBottom: '4px',
                      fontWeight: 'bold',
                      color: '#1a202c',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Preview
                  </p>
                  <div
                    className="gallery-preview-select"
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Image
                      src={galleryPreview}
                      alt="Gallery Preview"
                      width={150}
                      height={150}
                      style={{ objectFit: 'cover', width: '150px', height: '150px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
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

          <div className="testing-back">
            <Link href="/location" className="back-link">
              <div className="back-group">
                <Image src="/camera-back.png" alt="Back" className="back-image" width={120} height={64} />
              </div>
            </Link>
          </div>

          <div className="camera-text-bottom">
            <Image src="/camera-text.png" alt="" width={570} height={70} />
          </div>
        </div>
      )}

     
      {showSuccessPopup && showLoading && (
        <div className="camera-popup-overlay" style={{ zIndex: 100 }}>
          <div className="camera-popup">
            <p>Image successfully analyzed</p>
            <div className="camera-popup-buttons">
              <button
                onClick={() => {
                  setShowLoading(false);
                  router.push('/demographics');
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      
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
      <div className="testing-back">
        <Link href="/location" className="back-link">
          <div className="back-group">
            <Image src="/back-button.png" alt="Back Button" width={120} height={64} className="back-image"/>
          </div>
        </Link>
      </div>
    </main>
  );
}