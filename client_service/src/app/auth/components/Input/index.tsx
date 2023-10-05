"use client"
import React, { ChangeEvent, useEffect } from 'react';
import styles from './index.module.css'
import Image from 'next/image';

import eye from '../../../assets/auth/eye.svg';

interface InputProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder}) => {

  useEffect(() => {
    console.log('useEffect')
  },[])

  const click = () => {
    console.log('click')
  }

  return (
    <div className={styles.container}>

      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        // onChange={onChange}
      />

      {
        type === "password" && 
          <div className={styles.element} onClick={() => {console.log(12345)}}>
            <Image 
              src={eye}
              alt='eye icon'
            />
          </div>
      }

    </div>
  );
}

export default Input;