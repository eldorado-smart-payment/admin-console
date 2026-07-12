import { type ComponentProps } from "react";

type IconProps = {
  name: string;
  filled?: boolean;
  className?: string;
} & ComponentProps<"span">;

export function Icon({ name, filled = false, className = "", ...props }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
