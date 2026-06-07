
export class TimeControlManager {
  constructor(timeLimitSeconds, mode = 'per_game') {
    this.initialTime = timeLimitSeconds;
    this.remainingTime = timeLimitSeconds;
    this.mode = mode; // 'per_game' or 'per_move'
    this.isRunning = false;
    this.intervalId = null;
    this.onExpireCallback = null;
    this.lastTick = Date.now();
  }

  start(onExpire, onTick) {
    if (this.isRunning || this.remainingTime <= 0) return;
    
    this.onExpireCallback = onExpire;
    this.isRunning = true;
    this.lastTick = Date.now();

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - this.lastTick) / 1000);
      
      if (delta >= 1) {
        this.remainingTime -= delta;
        this.lastTick = now;
        
        if (onTick) onTick(this.remainingTime);

        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.pause();
          if (this.onExpireCallback) this.onExpireCallback();
        }
      }
    }, 250); // High frequency check to ensure accuracy
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume(onExpire, onTick) {
    this.start(onExpire || this.onExpireCallback, onTick);
  }

  reset(newTimeLimit = null) {
    this.pause();
    if (newTimeLimit !== null) this.initialTime = newTimeLimit;
    this.remainingTime = this.initialTime;
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  isExpired() {
    return this.remainingTime <= 0;
  }
}

export const parseTimeFormat = (format, customMinutes = 0) => {
  switch (format) {
    case '1min': return 60;
    case '3min': return 180;
    case '5min': return 300;
    case '10min': return 600;
    case '15min': return 900;
    case '30min': return 1800;
    case '60min': return 3600;
    case 'custom': return (parseInt(customMinutes) || 10) * 60;
    case 'no_limit':
    default: return 0; // 0 means no limit
  }
};

export const createTimer = (timeLimitSeconds, mode = 'per_game') => {
  return new TimeControlManager(timeLimitSeconds, mode);
};
