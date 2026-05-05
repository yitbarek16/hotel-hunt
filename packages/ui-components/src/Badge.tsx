import React from "react";

type BadgeStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  status: BadgeStatus;
};

export const Badge = ({ status, ...props }: BadgeProps) => {
  return <span {...props}>{status}</span>;
};
