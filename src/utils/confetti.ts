export const triggerConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    for (let i = 0; i < 5; i++) {
      createConfettiPiece(
        Math.random(),
        Math.random(),
        colors[Math.floor(Math.random() * colors.length)]
      );
    }
  }, 250);
};

function createConfettiPiece(x: number, y: number, color: string) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-piece';
  confetti.style.left = `${x * 100}%`;
  confetti.style.top = `${y * 100}%`;
  confetti.style.backgroundColor = color;
  confetti.style.position = 'fixed';
  confetti.style.width = '10px';
  confetti.style.height = '10px';
  confetti.style.borderRadius = '50%';
  confetti.style.pointerEvents = 'none';
  confetti.style.zIndex = '10000';
  confetti.style.animation = 'confetti-fall 3s ease-out forwards';

  document.body.appendChild(confetti);

  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
