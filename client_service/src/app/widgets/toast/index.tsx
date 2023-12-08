"use client";

import { useActor, useMachine, normalizeProps } from "@zag-js/react";
import * as toast from "@zag-js/toast";
import React, { createContext, useContext, ReactNode } from "react";

import styles from "./index.module.css";
import { Close } from "@/app/shared/icons/components/close";

interface ToastProps {
  actor: any;
}

function Toast({ actor }: ToastProps) {
  const [state, send] = useActor(actor);
  const api = toast.connect(state as any, send, normalizeProps);

  return (
    <div {...api.rootProps} className={styles.container}>
      <h3 {...api.titleProps} className={styles.title}>
        {api.title}
      </h3>
      <p {...api.descriptionProps} className={styles.subtitle}>
        {api.description}
      </p>
      <button onClick={api.dismiss} className={styles.close}>
        <Close />
      </button>
    </div>
  );
}

interface ToastContextType {
  [key: string]: any;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): any => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, send] = useMachine(toast.group.machine({ id: "1" }));

  const api = toast.group.connect(state, send, normalizeProps);

  return (
    <ToastContext.Provider value={api}>
      {Object.entries(api.toastsByPlacement).map(([placement, toasts]) => (
        <div key={placement} {...api.getGroupProps({ placement } as any)}>
          {toasts.map((toastActor) => (
            <Toast key={toastActor.id} actor={toastActor} />
          ))}
        </div>
      ))}

      {children}
    </ToastContext.Provider>
  );
}
