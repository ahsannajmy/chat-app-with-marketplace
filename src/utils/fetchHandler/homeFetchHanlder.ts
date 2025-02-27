import { getSession } from "@/app/api/auth/service";

export async function fetchUserDataLoggedIn() {
  const session = await getSession();
  if (session) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.userId}`
    );
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      console.log(data.message);
    }
  }
  return null;
}

export async function fetchAllUser(username: string) {
  if (username) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?username=${username}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  }
}

export async function fetchAllRequestedFriend(userId: string) {
  if (userId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-friend?userId=${userId}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  }
}

export async function fetchFriends(userId: string) {
  if (userId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/${userId}`
    );
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  }
}
