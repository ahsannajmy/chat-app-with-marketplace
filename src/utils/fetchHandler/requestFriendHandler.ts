export async function fetchRequestFriend(friendId: string, userId: string) {
  if (friendId && userId) {
    const response = await fetch("/api/request-friend", {
      method: "POST",
      body: JSON.stringify({
        requesterId: userId,
        requestedId: friendId,
      }),
    });
    const data = await response.json();
    return data;
  }
}

export async function fetchAcceptRequestFriend(
  friendId: string,
  userId: string
) {
  if (friendId && userId) {
    const response = await fetch("/api/accept-request", {
      method: "PUT",
      body: JSON.stringify({
        friendId: friendId,
        userId: userId,
      }),
    });
    const data = await response.json();
    return data;
  }
}

export async function fetchRejectRequestFriend(
  friendId: string,
  userId: string
) {
  if (friendId && userId) {
    const response = await fetch("/api/accept-request", {
      method: "PUT",
      body: JSON.stringify({
        friendId: friendId,
        userId: userId,
      }),
    });
    const data = await response.json();
    return data;
  }
}
