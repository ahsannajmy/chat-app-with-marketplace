"use client";

import { fetchUserDataLoggedIn } from "@/utils/fetchHandler/homeFetchHanlder";
import { UserHeader } from "@/interface";
import { createContext, useContext, useEffect, useState } from "react";

interface SessionContextValue {
  user: UserHeader | null;
  loadingSession: boolean;
  updateSession: (user: UserHeader | null) => void;
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  loadingSession: true,
  updateSession: () => {},
});

export default function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserHeader | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  useEffect(() => {
    async function fetchUserSession() {
      const data = await fetchUserDataLoggedIn();
      if (data) {
        setUser(data);
      }
      setLoadingSession(false);
    }
    fetchUserSession();
  }, []);

  const updateSession = (newUser: UserHeader | null) => {
    setUser(newUser);
  };

  return (
    <SessionContext.Provider value={{ user, loadingSession, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
