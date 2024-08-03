"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Loader2, Sword } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import UserDropdown from "./user-dropdown";

const Navbar = () => {
  const { user, isLoaded } = useUser();

  return (
    <nav className="mx-auto flex w-11/12 max-w-4xl items-center justify-between py-5">
      <ul>
        <Link href={"/"} className="flex text-2xl font-bold">
          <Sword size={32} className="mr-2 scale-x-[-1]" />
          Invincible
          <Sword size={32} className="ml-2" />
        </Link>
      </ul>
      <ul className="flex min-h-[40px] items-center gap-5">
        {!isLoaded ? (
          <Loader2 className="w-5 animate-spin" />
        ) : user ? (
          <UserDropdown />
        ) : (
          <Link href={"/sign-in"}>
            <Button>Sign in</Button>
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
