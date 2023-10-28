"use client"
import React, { useEffect } from "react";

import style from '@/app/account/confirm/page.module.css';
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Confirm() {

  const searchParams = useSearchParams()
  const search = searchParams.get('code')
  console.log(search)

  useEffect(() => {

  }, [])

  return (
    <div className={style.box}>

      <div className={style.texts}>
        <h2 className={style.alertText_one}>Verification successful!</h2>
        <h3 className={style.alertText_two}>You can now proceed to use our services without any restrictions</h3>
      </div>

      <div className={style.box__bottom}>
        <button className={style.continue__button}>Continue</button>
      </div>
    </div>
  )
}