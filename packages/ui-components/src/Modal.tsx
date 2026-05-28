import React from "react";

type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, children, ...props }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return <div {...props}>{children}</div>;
};
