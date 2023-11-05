"use client"
import React, { useEffect, useState } from "react";

import style from '@/app/auth/confirm/page.module.css';
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/loader";
import { confirmEmail } from "../api";
import Link from "next/link";

export default function Confirm() {
  const router = useRouter();
  
  const [confirmed, setСonfirmed] = useState(false)

  const param = useSearchParams().get('code')

  const submit = async (code: string) => {
    const response = await confirmEmail({
      secret_number: code 
    })
    if (response.status === 200) {
      setСonfirmed(true)
    }
  }

  useEffect(() => {
    
    if (param) {
      submit(param)
    } else {
      router.push("/auth/alert", { scroll: false });
    }

  }, [param])

  return (
    <div className={style.box}>

      <div  className={style.texts}>
        
        {
          confirmed ? 
          <h2 className={style.title}>Verification successful!</h2> 
          :
          <h2 className={style.title}>Account Confirmation</h2> 
        }

        {
          confirmed ?
          <h3 className={style.subtitle}>You can now proceed to use our services without any restrictions</h3>
          :
          <h3 className={style.subtitle}>Loading...</h3>
        }

        { !confirmed && <Loader /> }

      </div>

      <div className={confirmed ? style.box__bottom : style.box__bottom__close}>
        <Link className={style.continue__button} href="/dashboard">
          Continue
        </Link>
      </div>

    </div>
  )
}
