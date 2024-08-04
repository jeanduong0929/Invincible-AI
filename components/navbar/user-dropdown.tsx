import React, { useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UploadFileDialog from "./upload-file-dialog";

// Define types for menu items
type MenuItem = {
  label: string;
  href: string;
};

// Define menu items outside the component
const MENU_ITEMS: MenuItem[] = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

const UserDropdown: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleFileDialog = () => setIsFileDialogOpen(!isFileDialogOpen);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-mono">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MENU_ITEMS.map(({ label, href }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href}>{label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={toggleFileDialog}>
            Upload File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isFileDialogOpen && (
        <UploadFileDialog
          open={isFileDialogOpen}
          setOpen={setIsFileDialogOpen}
        />
      )}
    </div>
  );
};

export default UserDropdown;
