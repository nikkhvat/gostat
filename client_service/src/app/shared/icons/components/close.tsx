import React from "react";
import { SVGProps } from "react";

export const Close = ({ width = 17, height = 17, ...props }: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17 17" fill="none" {...props} >
    <path d="M12.8184 4.81836L4.81836 12.8184" stroke="#181818" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.81836 4.81836L12.8184 12.8184" stroke="#181818" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);
