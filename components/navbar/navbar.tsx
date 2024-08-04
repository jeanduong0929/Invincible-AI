"use client";

import React from "react";
import Link from "next/link";
import UserDropdown from "./user-dropdown";
import Logo from "./logo";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "./theme-dropdown";
import { useUser } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { user, isLoaded } = useUser();

  return (
    <nav className="mx-auto flex w-11/12 max-w-screen-xl items-center justify-between py-5">
      <Logo />
      <div className="flex min-h-[40px] items-center gap-5">
        <ModeToggle />
        {renderUserSection(isLoaded, user)}
      </div>
    </nav>
  );
};

const renderUserSection = (isLoaded: boolean, user: any) => {
  if (!isLoaded) return <Loader2 className="w-5 animate-spin" />;
  if (user) return <UserDropdown />;
  return (
    <Link href="/sign-in">
      <Button>Sign in</Button>
    </Link>
  );
};

export default Navbar;
