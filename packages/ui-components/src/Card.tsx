import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Card = ({ children, ...props }: CardProps) => {
  return <div {...props}>{children}</div>;
};
