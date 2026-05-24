import { cn } from '@/lib/utils';
import { useId } from 'react';

export const AppLogo = ({ className }: { className?: string }) => {
  const gradientId = useId().replace(/:/g, '');
  const accentId = `${gradientId}-accent`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="10"
          y1="6"
          x2="56"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#111827" />
          <stop offset="0.6" stopColor="#0f172a" />
          <stop offset="1" stopColor="#14532d" />
        </linearGradient>
        <linearGradient
          id={accentId}
          x1="15"
          y1="12"
          x2="48"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="18"
        fill={`url(#${gradientId})`}
      />
      <rect
        x="4.75"
        y="4.75"
        width="54.5"
        height="54.5"
        rx="17.25"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />

      <path d="M17 19.5h17v5H23v5.5h8.5v5H23v5.5h11v5H17z" fill="#F8FAFC" />
      <path
        d="M36 45V19.5h4.5L46.5 30l6-10.5H57V45h-5.5V30.5l-5 8.25h-.75l-5-8.25V45z"
        fill="#F8FAFC"
      />

      <path
        d="M17 13h16"
        stroke={`url(#${accentId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="49.5" cy="14.5" r="3.5" fill="#86EFAC" />
    </svg>
  );
};

export const Google = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2443"
      height="2500"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      id="google"
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      ></path>
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      ></path>
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      ></path>
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      ></path>
    </svg>
  );
};
