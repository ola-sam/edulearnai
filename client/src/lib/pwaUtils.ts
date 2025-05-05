export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  }
}

export function checkOfflineCapability(): boolean {
  return 'caches' in window && 'serviceWorker' in navigator;
}

export function isOfflineContentAvailable(): boolean {
  const downloadedLessons = localStorage.getItem('cachedLessons');
  return !!downloadedLessons && JSON.parse(downloadedLessons).length > 0;
}

export async function cacheContent(urls: string[]): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }
  
  try {
    const cache = await caches.open('education-content-v1');
    await cache.addAll(urls);
    return true;
  } catch (error) {
    console.error('Failed to cache content:', error);
    return false;
  }
}

export async function removeCachedContent(urls: string[]): Promise<boolean> {
  if (!('caches' in window)) {
    return false;
  }
  
  try {
    const cache = await caches.open('education-content-v1');
    
    for (const url of urls) {
      await cache.delete(url);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to remove cached content:', error);
    return false;
  }
}

export function getInstallPrompt(): Promise<BeforeInstallPromptEvent | null> {
  return new Promise((resolve) => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    
    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      deferredPrompt = e;
      resolve(deferredPrompt);
      window.removeEventListener('beforeinstallprompt', handler as any);
    };
    
    window.addEventListener('beforeinstallprompt', handler as any);
    
    // If we already have a deferred prompt, resolve with it
    if (window.deferredPrompt) {
      resolve(window.deferredPrompt as BeforeInstallPromptEvent);
      window.deferredPrompt = null;
    }
    
    // Resolve with null after 1 second if no prompt event was fired
    setTimeout(() => {
      if (!deferredPrompt) {
        resolve(null);
      }
    }, 1000);
  });
}

export function checkAppInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      resolve(true);
      return;
    }
    
    // For iOS Safari
    if ((navigator as any).standalone === true) {
      resolve(true);
      return;
    }
    
    // For other browsers, assume not installed
    resolve(false);
  });
}

// Interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
  prompt(): Promise<void>;
}

// Extend Window interface
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}
