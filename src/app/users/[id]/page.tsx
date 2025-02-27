"use client";
import { fetchFriends } from "@/utils/fetchHandler/homeFetchHanlder";
import { fetchRequestFriend } from "@/utils/fetchHandler/requestFriendHandler";
import { fetchUserProfile } from "@/utils/fetchHandler/userProfileFetchHandler";
import Header from "@/components/header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/context/session-context";

import { UserHeader, UserProfileHeader } from "@/interface";
import { checkFriend } from "@/utils/check-friends";
import { getYearMonth } from "@/utils/date-format";
import { createAlias } from "@/utils/string-utility";
import { Calendar, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FriendCard from "@/components/friend-card";

export default function FriendProfile() {
  const { user } = useSession(); // user logged in id
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [friends, setFriends] = useState<UserHeader[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfileHeader>({
    id: "",
    username: "",
    email: "",
    createdAt: new Date(),
    profile: {
      fullname: "",
    },
  });
  const pathname = usePathname();
  const friendId = pathname.split("/")[2]; // friendId

  useEffect(() => {
    async function profileFetch() {
      setLoading(true);
      if (user) {
        const [userFriends, userProfile] = await Promise.all([
          fetchFriends(friendId),
          fetchUserProfile(friendId),
        ]);

        if (userFriends) {
          setIsFriend(checkFriend(userFriends, user.id));
          setFriends(userFriends);
        }

        if (userProfile) {
          setProfile(userProfile);
        }
      }
      setLoading(false);
    }
    profileFetch();
  }, [friendId, user]);

  async function addFriend(friendId: string) {
    if (friendId && user) {
      const data = await fetchRequestFriend(friendId, user.id);
      if (data) {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Gagal melakukan fetching");
      }
    } else {
      toast.error("Session anda telah habis tidak ditemukan user id");
    }
  }

  return (
    <>
      <Header />
      <div className="grid grid-cols-3 gap-2 p-4 mt-4">
        <div className="col-span-2">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>
                {loading || profile.id === "" ? (
                  <Skeleton className="h-10 w-1/3" />
                ) : (
                  `${profile.profile.fullname || "Unknown User"}'s profile`
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-between relative">
                <div className="flex flex-col items-start gap-3">
                  <div>
                    {loading || profile.id === "" ? (
                      <Skeleton className="h-40 w-40 rounded-full" />
                    ) : (
                      <Avatar className="h-40 w-40">
                        <AvatarImage
                          className="object-cover"
                          src={profile.profile.imageProfile || "#"}
                        />
                        <AvatarFallback>
                          <span className="text-7xl">
                            {createAlias(profile.profile.fullname || "")}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    {loading || profile.id === "" ? (
                      <>
                        <Skeleton className="h-4 w-72" />
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-4 w-96" />
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-lg">
                          {profile.username}
                        </span>
                        <span className="font-semibold text-sm text-gray-500">
                          {profile.email}
                        </span>
                        <span>
                          {profile.profile.bio ||
                            `${profile.username} tidak memiliki bio`}
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {loading || profile.id === "" ? (
                        <Skeleton className="h-4 w-96" />
                      ) : (
                        <>
                          <Calendar />
                          <span>
                            Bergabung dengan ChattanKuy sejak{" "}
                            {getYearMonth(new Date(profile.createdAt))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0">
                  {loading || profile.id === "" ? (
                    <Skeleton className="h-10 w-32" />
                  ) : isFriend ? (
                    <Button>Sudah Berteman</Button>
                  ) : (
                    <Button type="button" onClick={() => addFriend(profile.id)}>
                      <div className="flex flex-row items-center gap-4">
                        <span>Tambah Teman</span>
                        <UserPlus />
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Teman beliau...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {friends.map((friend, index) => (
                  <FriendCard
                    key={index}
                    id={friend.id}
                    alias={createAlias(friend.profile.fullname)}
                    username={friend.username}
                    imageProfile={friend.profile.imageProfile || "#"}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
