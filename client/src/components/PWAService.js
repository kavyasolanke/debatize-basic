class PWAService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
    this.registration = null;
  }

  async registerServiceWorker() {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', this.registration);
      
      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, show update prompt
            this.showUpdatePrompt();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  showUpdatePrompt() {
    if (confirm('A new version of Debatize is available! Would you like to update?')) {
      window.location.reload();
    }
  }

  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  async unregisterServiceWorker() {
    if (this.registration) {
      await this.registration.unregister();
      console.log('Service Worker unregistered');
    }
  }

  isStandalone() {
    return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  }

  isInstalled() {
    return this.isStandalone() || window.navigator.standalone;
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeToPushNotifications() {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
      });

      console.log('Push notification subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async getInstalledRelatedApps() {
    if (!navigator.getInstalledRelatedApps) {
      return [];
    }

    try {
      const relatedApps = await navigator.getInstalledRelatedApps();
      return relatedApps;
    } catch (error) {
      console.error('Failed to get installed related apps:', error);
      return [];
    }
  }

  async installApp() {
    if (!window.deferredPrompt) {
      return false;
    }

    try {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      window.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Failed to install app:', error);
      return false;
    }
  }

  // Cache management
  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  async getCacheSize() {
    if (!('caches' in window)) {
      return 0;
    }

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  }

  // Offline functionality
  isOnline() {
    return navigator.onLine;
  }

  addOnlineListener(callback) {
    window.addEventListener('online', callback);
  }

  addOfflineListener(callback) {
    window.addEventListener('offline', callback);
  }

  removeOnlineListener(callback) {
    window.removeEventListener('online', callback);
  }

  removeOfflineListener(callback) {
    window.removeEventListener('offline', callback);
  }
}

// Create singleton instance
const pwaService = new PWAService();

export default pwaService; 