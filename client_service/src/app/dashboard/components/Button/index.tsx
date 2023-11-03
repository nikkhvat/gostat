import React from "react";

interface IButton {
  active?: boolean;

  className?: string;
  activeClass?: string;
  inActiveClass?: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  children?: React.ReactNode;
}

const Button: React.FC<IButton> = ({
  active,
  className,
  activeClass,
  inActiveClass,
  onClick,
  children,
}) => {
  return (
    <button
      className={`${className} ${active ? activeClass : inActiveClass}`}
      onClick={(e) => onClick?.(e)}
    >
      {children}
    </button>
  );
};

export default Button;