import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export function GoogleIcon() {
  return (
    <SvgIcon sx={{ width: 20, height: 20 }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.2 8.18182V12.1091H15.0364C14.8182 13.2727 14.1273 14.2545 13.1091 14.9091L16.3818 17.4182C18.1636 15.7818 19.2 13.3636 19.2 10.4545C19.2 9.73636 19.1364 9.04545 19.0182 8.38182H10.2V8.18182Z"
          fill="#4285F4"
        />
        <path
          d="M4.58545 11.9636L3.85091 12.5091L1.22727 14.5455C2.81818 17.7091 6.27273 20 10.2 20C12.7091 20 14.8364 19.1818 16.3818 17.4182L13.1091 14.9091C12.2545 15.4727 11.1273 15.8182 10.2 15.8182C7.8 15.8182 5.74545 14.1636 4.98182 11.9818L4.58545 11.9636Z"
          fill="#34A853"
        />
        <path
          d="M1.22727 5.45455C0.436364 7.02727 0 8.80909 0 10.6909C0 12.5727 0.436364 14.3545 1.22727 15.9273C1.22727 15.9455 4.98182 11.9636 4.98182 11.9636C4.74545 11.4 4.6 10.7818 4.6 10.1455C4.6 9.50909 4.74545 8.89091 4.98182 8.32727L1.22727 5.45455Z"
          fill="#FBBC05"
        />
        <path
          d="M10.2 4.18182C11.2364 4.18182 12.1636 4.55455 12.8909 5.23636L15.8 2.32727C14.2182 0.872727 12.0909 0 10.2 0C6.27273 0 2.81818 2.29091 1.22727 5.45455L4.98182 8.32727C5.74545 6.14545 7.8 4.18182 10.2 4.18182Z"
          fill="#EA4335"
        />
      </svg>
    </SvgIcon>
  );
}

export function FacebookIcon() {
  return (
    <SvgIcon sx={{ width: 20, height: 20 }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z"
          fill="#1877F2"
        />
      </svg>
    </SvgIcon>
  );
}

export function AppTrackrIcon() {
  return (
    <SvgIcon sx={{ width: 32, height: 32 }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
        <path
          d="M16 8L10 13L16 18L22 13L16 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M16 18L10 23L16 28L22 23L16 18Z"
          fill="white"
          opacity="0.6"
        />
        <defs>
          <linearGradient
            id="gradient"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </SvgIcon>
  );
}
