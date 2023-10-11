"use client"
import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.css'
import Image from 'next/image';

import eye from '../../../assets/auth/eye.svg';
import eye_off from '../../../assets/auth/eye-off.svg';

interface InputProps {
  typeProp: string;
  placeholder: string;
  check?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ typeProp, placeholder, check, onChange}) => {

  let [type, setType] = useState(typeProp)

  const checkFunction = (type: string, check: boolean) => {

    if (type === 'password' && check) {
      setType('text')
    } else if (type === 'text' && check) {
      setType('password')
    }

  }

  return (
    <div className={styles.container}>

      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    
      {
        (type === 'password' && check) 
        ? 
        <div className={styles.element} onClick={() => {checkFunction(type, check)}}>
          <Image 
            src={eye}
            alt='eye icon'
          />
        </div>
        : 
        (type === 'text' && check)
        ?
        <div className={styles.element} onClick={() => {checkFunction(type, check)}}>
          <Image 
            src={eye_off}
            alt='eye icon'
          />
        </div> 
        :
        <></>
      }

    </div>
  );
}

export default Input;