"use client";
import { useEffect, useState } from "react";
import { createAlias } from "@/utils/string-utility";
import UserSection, { UserSectionType } from "@/components/user-section";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { UserHeader, UserRequestHeader } from "@/interface";

import {
  fetchAllRequestedFriend,
  fetchFriends,
} from "@/utils/fetchHandler/homeFetchHanlder";
import { formatDate } from "@/utils/date-format";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import FriendCard from "@/components/friend-card";
import { useSession } from "@/context/session-context";
import Chat from "@/components/chat";

export default function Home() {
  const { user } = useSession();
  const [currentMessage, setCurrentMessage] = useState<UserHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<UserHeader[] | null>(null);
  const [requestedFriends, setRequestedFriends] = useState<UserRequestHeader[]>(
    []
  );

  async function updateRequestedFriends() {
    if (user) {
      const requestedFriends = await fetchAllRequestedFriend(user.id);
      setRequestedFriends(requestedFriends);
    }
  }

  function updateCurrentMessage(friendId: string) {
    const desiredUser = friends?.find((friend) => friend.id === friendId);
    if (desiredUser) {
      setCurrentMessage(desiredUser);
    }
  }

  useEffect(() => {
    async function homeFetch() {
      if (user) {
        const [requestedFriends, friends] = await Promise.all([
          fetchAllRequestedFriend(user.id),
          fetchFriends(user.id),
        ]);
        if (requestedFriends) {
          setRequestedFriends(requestedFriends);
        }
        if (friends) {
          setFriends(friends);
        }
      }
      setLoading(false);
    }

    homeFetch();
  }, [user]);

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2 mt-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Temanmu</CardTitle>
              <CardDescription>Tidak ada pertemanan</CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !friends ? (
                <>
                  <Card className="p-4">
                    <div className="flex flex-row items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </Card>
                </>
              ) : friends.length !== 0 ? (
                <>
                  <div className="flex flex-col gap-2">
                    {friends.map((friend, index) => (
                      <FriendCard
                        isSelected={currentMessage?.id === friend.id}
                        key={`friend${index}`}
                        id={friend.id}
                        username={friend.username}
                        imageProfile={friend.profile.imageProfile || "#"}
                        alias={createAlias(friend.profile.fullname)}
                        updateCurrentMessage={updateCurrentMessage}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-sm">Tidak ada pertemanan</span>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="sm:col-span-2">
          <Chat user={user} friend={currentMessage} />
        </div>
        <div>
          <Card className="p-2 w-auto">
            <CardHeader>
              <CardTitle>Anda Mengenali ?</CardTitle>
              <CardDescription>Seseorang meminta pertemanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {loading || !requestedFriends ? (
                  <>
                    <Card className="p-4 rounded-xl w-full">
                      <div className="flex flex-row items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col items-start gap-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    </Card>
                  </>
                ) : requestedFriends.length != 0 ? (
                  requestedFriends.map((user, index) => (
                    <UserSection
                      key={`requestedFriend${index}`}
                      username={user.username}
                      email={user.email}
                      alias={createAlias(user.username)}
                      id={user.id}
                      sectionType={UserSectionType.REQUESTEDUSER}
                      date={formatDate(new Date(user.createdAt))}
                      updateRequestSection={updateRequestedFriends}
                    />
                  ))
                ) : (
                  <span className="text-sm">Tidak ada permintaan</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
