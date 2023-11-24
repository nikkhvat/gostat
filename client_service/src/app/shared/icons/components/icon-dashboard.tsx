import { SVGProps } from 'react';
export const IconDashboard = ({ width = 50, height = 50, strokeWidth = 2, ...props }: SVGProps<SVGSVGElement>) => (
  <svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
    <rect width="50" height="50" rx="15" fill="#181818"/>
    <path d="M32 16H18C16.8954 16 16 16.8954 16 18V32C16 33.1046 16.8954 34 18 34H32C33.1046 34 34 33.1046 34 32V18C34 16.8954 33.1046 16 32 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 22H34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 34V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
