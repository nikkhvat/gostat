"use client"
import React, { useEffect, useState } from "react";

import style from '@/app/auth/components/loader/index.module.css';

export default function Loader() {

  return (
      <div className={style.loader}></div>
  )
}