
export const checkPWAInstallability = () => {
  return 'BeforeInstallPromptEvent' in window;
};

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

export const promptInstallation = async () => {
  if (!deferredPrompt) {
    console.log('Installation prompt not available.');
    return false;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome === 'accepted';
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const checkOfflineStatus = () => {
  return !navigator.onLine;
};

export const syncGameData = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-game-data');
      console.log('Background sync registered');
      return true;
    } catch (err) {
      console.error('Background sync failed', err);
      return false;
    }
  }
  return false;
};
