'use client';
import { useEffect, useRef, useState } from 'react';

export default function TaskCamera({ onCapture, onClose, onFallback }) {
  const video = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let stream;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1600 }, height: { ideal: 1200 } } });
        if (cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
      } catch (e) {
        if (cancelled) return;
        setError(e.name === 'NotAllowedError'
          ? 'Kameraga ruxsat berilmadi. Brauzer sozlamasidan ruxsat bering yoki rasm tanlang.'
          : e.name === 'NotFoundError'
            ? 'Kamera topilmadi. Qurilmangizdan tayyor rasm tanlashingiz mumkin.'
            : 'Kamera ochilmadi. Saytni HTTPS orqali oching yoki quyidagi tugmadan foydalaning.');
      }
    }
    start();
    return () => { cancelled = true; stream?.getTracks().forEach(track => track.stop()); };
  }, []);
  function capture() {
    if (!ready || capturing || !video.current?.videoWidth) return;
    setCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1600 / Math.max(video.current.videoWidth, video.current.videoHeight));
      canvas.width = Math.round(video.current.videoWidth * scale);
      canvas.height = Math.round(video.current.videoHeight * scale);
      canvas.getContext('2d').drawImage(video.current, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg', 0.8);
      if (photo.length >= 2000000) throw new Error('Rasm hajmi katta. Qayta urinib ko‘ring yoki rasm tanlang.');
      onCapture(photo);
    } catch (e) { setError(e.message || 'Surat olinmadi. Qayta urinib ko‘ring.'); setCapturing(false); }
  }
  return <section className="task-camera" aria-label="Vazifa uchun surat olish">
    <video ref={video} autoPlay muted playsInline onLoadedData={() => setReady(true)} aria-label="Kameradagi jonli tasvir" />
    {!ready && !error && <p role="status">Kameraga ruxsat bering. Kamera ochilmoqda…</p>}
    {error && <p className="alert error" role="alert">{error}</p>}
    <div className="photo-actions">
      <button type="button" className="button primary" disabled={!ready || capturing} onClick={capture}>Suratga olish</button>
      <button type="button" className="button light" onClick={onClose}>Kamerani yopish</button>
      {error && <button type="button" className="button light" onClick={onFallback}>Telefon kamerasi / rasm tanlash</button>}
    </div>
  </section>;
}
