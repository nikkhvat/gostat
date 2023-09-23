import React, { ChangeEvent } from 'react';
import styles from './index.module.css'

interface InputProps {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder}) => {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        // onChange={onChange}
      />
      
    </div>
  );
}

export default Input;