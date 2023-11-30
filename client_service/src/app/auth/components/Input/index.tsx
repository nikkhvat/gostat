"use client";

import React, { ChangeEvent, useState } from "react";

import { Eye, EyeOff } from "@/app/shared/icons/components/icon-eye";

import styles from "./index.module.css";
import { InputType, AutoCompleteType } from "./index.d";

interface InputProps {
  type: InputType;
  placeholder: string;
  value?: string | number | null;
  autoComplete?: AutoCompleteType;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

enum EyeMode {
  Show = "text",
  Hide = "password",
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  autoComplete, 
  onChange,
}) => {
  const [eyeMode, setEyeMode] = useState(EyeMode.Hide);

  const checkFunction = () => {
    if (eyeMode === EyeMode.Hide) setEyeMode(EyeMode.Show);
    else setEyeMode(EyeMode.Hide);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={type === "password" ? eyeMode : type}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
      />

      {type === "password" &&
        <button
          type="button"
          className={styles.element}
          onClick={checkFunction}
          tabIndex={0}
          aria-pressed={eyeMode === EyeMode.Hide}
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          {eyeMode === EyeMode.Hide ? <Eye /> : <EyeOff />}
        </button>}
    </div>
  );
};

export default Input;