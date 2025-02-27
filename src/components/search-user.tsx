import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserHeader } from "@/interface";
import { fetchAllUser } from "@/utils/fetchHandler/homeFetchHanlder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAlias } from "@/utils/string-utility";
import { Skeleton } from "./ui/skeleton";
import { debounce } from "lodash";
import Link from "next/link";
import { useSession } from "@/context/session-context";

const SearchUserSection = () => {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [userSearchResult, setUserSearchResult] = useState<UserHeader[]>([]);

  const fetchUsers = async (value: string) => {
    setLoading(true);
    if (value.trim().length > 0) {
      if (user) {
        const data = await fetchAllUser(value);
        setUserSearchResult(data);
      }
      setLoading(false);
    } else {
      setUserSearchResult([]);
      setLoading(false);
    }
  };

  const debounceFetchUsers = debounce(fetchUsers, 300);

  const handleChangeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const value = e.target.value;
    setSearchValue(value);
    setPopoverOpen(value.trim().length > 0);

    debounceFetchUsers(value);
  };

  return (
    <Popover open={popoverOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex items-center w-80">
          <Search className="absolute left-3" />
          <Input
            type="text"
            placeholder="Cari temanmu..."
            className="pl-10"
            value={searchValue}
            onChange={handleChangeSearch}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-4 items-start">
          {loading ? (
            <>
              <div className="flex flex-row items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </>
          ) : userSearchResult.length > 0 ? (
            userSearchResult.map((userRes) => (
              <Link
                href={
                  user && user.id !== userRes.id
                    ? `/users/${userRes.id}`
                    : "/profile"
                }
                key={userRes.id}
                className="flex flex-row items-center w-full"
              >
                <div className="flex flex-row items-center gap-3">
                  <div>
                    <Avatar className="rounded-full">
                      <AvatarImage
                        className="object-cover"
                        src={userRes.profile.imageProfile || "#"}
                      />
                      <AvatarFallback>
                        {createAlias(userRes.profile.fullname)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-sm">
                      {userRes.profile.fullname}
                    </span>
                    <span className="text-xs">{userRes.username}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <span className="text-xs text-gray-500">User tidak ditemukan</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchUserSection;
