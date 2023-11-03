"use client"
import React, { useEffect, useState } from "react";

import style from '@/app/auth/confirm/page.module.css';
import { useSearchParams } from "next/navigation";
import Loader from "../components/loader";
import { confirmEmail } from "../api";

export default function Confirm() {

  const [status, setStatus] = useState(false)

  const searchParams = useSearchParams()
  const search = searchParams.get('code')

  const submit = async (code: string) => {
    const response = await confirmEmail({
      secret_number: code 
    })
    if (response.status === 200) {
      setStatus(true)
    }
  }

  useEffect(() => {
    if (search) {
      submit(search)
    }
  }, [search])

  return (
    <div className={style.box}>

      <div className={style.texts}>
        
        {
          status ? 
          <h2 className={style.alertText_one}>Verification successful!</h2> 
          :
          <h2 className={style.alertText_one}>Account Confirmation</h2> 
        }

        {
          status ?
          <h3 className={style.alertText_two}>You can now proceed to use our services without any restrictions</h3>
          :
          <h3 className={style.alertText_two}>Loading...</h3>
        }

        {
          status ?
          <></>
          :
          <Loader />
        }

      </div>

      <div className={status ? style.box__bottom : style.box__bottom__close}>
        <button className={style.continue__button}>Continue</button>
      </div>
    </div>
  )
}