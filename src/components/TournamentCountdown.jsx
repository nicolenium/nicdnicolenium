
import React, { useState, useEffect } from 'react';

const TournamentCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!targetDate) return;
    
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isExpired: false
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return <div className="countdown-timer text-green-500 border-green-500/50">TOURNAMENT STARTED</div>;
  }

  return (
    <div className="countdown-timer grid grid-cols-4 gap-2 md:gap-4 text-primary">
      <div className="flex flex-col items-center">
        <span>{timeLeft.days.toString().padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">Mins</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">Secs</span>
      </div>
    </div>
  );
};

export default TournamentCountdown;
