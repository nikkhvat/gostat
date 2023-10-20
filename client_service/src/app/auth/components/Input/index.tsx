"use client"
import React, { ChangeEvent, useState } from 'react';
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

  const checkFunction = () => {
    setType(type === "password" ? "text" : "password");
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />

      {check && (
        <button
          type="button"
          className={styles.element}
          onClick={checkFunction}
          tabIndex={0}
          aria-pressed={type === "text"}
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          <Image src={type === "text" ? eye : eye_off} alt="eye icon" />
        </button>
      )}
    </div>
  );
}

export default Input;