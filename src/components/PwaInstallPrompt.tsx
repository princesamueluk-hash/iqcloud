import React, { useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [iosInstructionsVisible, setIosInstructionsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const dismissedKey = 'netwho-install-dismissed';
    const storedDismissed = window.localStorage.getItem(dismissedKey) === 'true';
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    setDismissed(storedDismissed);
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPromptEvent(null);
    };

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    if (isIOS) {
      setIosInstructionsVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const shouldShowPrompt = useMemo(() => {
    if (isInstalled || dismissed || isStandalone) return false;
    return Boolean(installPromptEvent) || iosInstructionsVisible;
  }, [installPromptEvent, dismissed, isInstalled, isStandalone, iosInstructionsVisible]);

  const handleInstall = async () => {
    if (!installPromptEvent) {
      setIosInstructionsVisible(true);
      return;
    }

    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPromptEvent(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('netwho-install-dismissed', 'true');
    }
  };

  if (!shouldShowPrompt) return null;

  return (
    <div className="border-b-2 border-black bg-neutral-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-neutral-600">NETWHO on Mobile</div>
          <div className="text-sm font-bold text-black">Get faster access to NETWHO from your home screen.</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {installPromptEvent ? (
            <button
              type="button"
              onClick={handleInstall}
              className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black"
            >
              Install App
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIosInstructionsVisible((value) => !value)}
              className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black"
            >
              Install NETWHO
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black"
          >
            Not Now
          </button>
        </div>
      </div>

      {iosInstructionsVisible && !installPromptEvent && (
        <div className="max-w-7xl mx-auto mt-3 border-2 border-black bg-white p-4 text-sm text-neutral-800">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] font-bold text-neutral-700 mb-2">Install NETWHO</div>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Tap the Share button in Safari.</li>
            <li>Select “Add to Home Screen”.</li>
            <li>Tap Add.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
