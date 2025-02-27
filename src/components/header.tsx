"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import SearchUserSection from "./search-user";
import Link from "next/link";
import { useSession } from "@/context/session-context";
import { createAlias } from "@/utils/string-utility";
import { redirect } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

async function logoutHanlder() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (response.ok) {
    toast.success(data.message);
    redirect("/login");
  }
  toast.error(data.message);
}

const Header = () => {
  const { user, loadingSession } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
    setIsDark(!isDark);
  };

  return (
    <>
      <div className="p-4 rounded-b-xl drop-shadow-xl bg-background">
        <div className="flex justify-between items-center">
          <div>
            <Link href={"/"}>
              <span className="text-2xl font-bold">ChattanKuy</span>
            </Link>
          </div>
          <div>
            <SearchUserSection />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
            {loadingSession ? (
              <>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </>
            ) : user ? (
              <>
                <span>{user.username}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar onClick={toggleDropdown}>
                      <AvatarImage
                        className="object-cover cursor-pointer"
                        src={user.profile.imageProfile || "#"}
                      />
                      <AvatarFallback>
                        {createAlias(user.profile.fullname)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 mr-4">
                    <DropdownMenuLabel>
                      Selamat datang, {user.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup className="w-full">
                      <Link href={"/profile"}>
                        <DropdownMenuItem className="flex flex-row justify-between items-center">
                          <span>Profile</span>
                          <ChevronRight />
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-auto px-2 py-1 mt-2"
                      onClick={logoutHanlder}
                    >
                      Logout
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
