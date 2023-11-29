"use client"
import React, { ChangeEvent, useState } from 'react';
import styles from './index.module.css'

import { Eye, EyeOff } from '@/app/shared/icons/components/icon-eye';

interface InputProps {
  typeProp: string;
  placeholder: string;
  check?: boolean;
  value?: string;
  autoComplete?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  typeProp,
  placeholder,
  check,
  autoComplete, 
  onChange,
}) => {
  let [type, setType] = useState(typeProp);

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
        autoComplete={autoComplete}
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
          {type === "text" ? <Eye /> : <EyeOff />}
        </button>
      )}
    </div>
  );
};

export default Input;