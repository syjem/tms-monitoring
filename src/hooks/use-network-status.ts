'use client';

import { useEffect, useMemo, useState } from 'react';

type BrowserConnection = {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: BrowserConnection;
  mozConnection?: BrowserConnection;
  webkitConnection?: BrowserConnection;
};

type NetworkStatus = 'online' | 'offline' | 'unstable';

const POOR_CONNECTION_TYPES = new Set(['slow-2g', '2g']);

function getConnection(): BrowserConnection | undefined {
  if (typeof window === 'undefined') return undefined;

  const navigatorWithConnection = navigator as NavigatorWithConnection;
  return (
    navigatorWithConnection.connection ||
    navigatorWithConnection.mozConnection ||
    navigatorWithConnection.webkitConnection
  );
}

function connectionLooksUnstable(connection?: BrowserConnection): boolean {
  if (!connection) return false;

  const isPoorType =
    typeof connection.effectiveType === 'string' &&
    POOR_CONNECTION_TYPES.has(connection.effectiveType);
  const highRtt = typeof connection.rtt === 'number' && connection.rtt > 600;
  const lowDownlink =
    typeof connection.downlink === 'number' && connection.downlink < 1;

  return isPoorType || highRtt || lowDownlink;
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isUnstable, setIsUnstable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateStatus = () => {
      setIsOnline(navigator.onLine);
      setIsUnstable(connectionLooksUnstable(getConnection()));
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = getConnection();
    connection?.addEventListener?.('change', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      connection?.removeEventListener?.('change', updateStatus);
    };
  }, []);

  const status: NetworkStatus = useMemo(() => {
    if (!isOnline) return 'offline';
    if (isUnstable) return 'unstable';
    return 'online';
  }, [isOnline, isUnstable]);

  return {
    status,
    isOffline: status === 'offline',
    isUnstable: status === 'unstable',
    isOnline: status === 'online',
  };
}

