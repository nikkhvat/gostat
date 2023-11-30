"use client";

import React, { ChangeEvent, useState } from "react";

import { Eye, EyeOff } from "@/app/shared/icons/components/icon-eye";
import debounce from "@/app/shared/libs/debounce/debounce";

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

  const debouncedOnChange = debounce(onChange as any, 200);

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={type === "password" ? eyeMode : type}
        placeholder={placeholder}
        onChange={debouncedOnChange}
        autoComplete={autoComplete}
      />

      {type === "password" && (
        <button
          type="button"
          className={styles.element}
          onClick={checkFunction}
          tabIndex={0}
          aria-pressed={eyeMode === EyeMode.Hide}
          aria-label={EyeMode.Hide ? "Show password" : "Hide password"}
        >
          {eyeMode === EyeMode.Show ? <Eye /> : <EyeOff />}
        </button>
      )}
    </div>
  );
};

export default Input;