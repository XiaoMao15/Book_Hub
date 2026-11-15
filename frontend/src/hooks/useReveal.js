// Fungsi: menambahkan kelas "show" pada elemen ".reveal" saat masuk layar (efek muncul saat digulir)
import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll('.reveal:not(.show)').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}