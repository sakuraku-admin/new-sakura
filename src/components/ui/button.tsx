import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({
  className = "",
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border bg-transparent"
      : "border border-transparent";
  return (
    <button
      type={type}
      className={`${variantClass} inline-flex items-center justify-center transition ${className}`}
      {...props}
    />
  );
}
