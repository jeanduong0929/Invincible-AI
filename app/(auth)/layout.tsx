import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
