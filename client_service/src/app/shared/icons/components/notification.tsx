import { SVGProps } from 'react';

export const Notification = ({ width = 50, height = 50, ...props }: SVGProps<SVGSVGElement>) => (
  <svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
    <rect width="50" height="50" rx="15" fill="white"/>
    <path d="M30 21.6666C30 20.3405 29.4732 19.0688 28.5355 18.1311C27.5979 17.1934 26.3261 16.6666 25 16.6666C23.6739 16.6666 22.4021 17.1934 21.4645 18.1311C20.5268 19.0688 20 20.3405 20 21.6666C20 27.5 17.5 29.1666 17.5 29.1666H32.5C32.5 29.1666 30 27.5 30 21.6666Z" stroke="#181818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26.4414 32.5C26.2949 32.7526 26.0846 32.9622 25.8316 33.1079C25.5786 33.2537 25.2918 33.3304 24.9998 33.3304C24.7078 33.3304 24.4209 33.2537 24.1679 33.1079C23.9149 32.9622 23.7046 32.7526 23.5581 32.5" stroke="#181818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30.5" cy="18.5" r="3.5" fill="#F48E8E"/>
  </svg>
);
