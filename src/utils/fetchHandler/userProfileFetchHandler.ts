export async function fetchUserProfile(userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/profile/${userId}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
}

export async function editProfile(userId: string, payload: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/profile/${userId}`,
    {
      method: "PUT",
      body: payload,
    }
  );
  const data = await response.json();
  if (data.success) {
    return data;
  }
}
