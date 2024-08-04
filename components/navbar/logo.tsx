import React from "react";
import Link from "next/link";
import { Sword } from "lucide-react";

const Logo = () => (
  <Link href="/" className="flex items-center text-2xl font-bold">
    <Sword size={32} className="mr-2 scale-x-[-1]" />
    Invincible
    <Sword size={32} className="ml-2" />
  </Link>
);

export default Logo;
