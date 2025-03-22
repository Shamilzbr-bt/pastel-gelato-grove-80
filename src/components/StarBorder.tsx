
import { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";
import "./StarBorder.css";

interface StarBorderProps<T extends ElementType = "button"> {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  children: ReactNode;
}

type Props<T extends ElementType> = StarBorderProps<T> & 
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps>;

const StarBorder = <T extends ElementType = "button">({
  as,
  className = "",
  color = "#e81cff",
  speed = "6s",
  children,
  ...rest
}: Props<T>) => {
  const Component = as || "button";
  
  return (
    <Component className={`star-border-container ${className}`} {...rest}>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;
