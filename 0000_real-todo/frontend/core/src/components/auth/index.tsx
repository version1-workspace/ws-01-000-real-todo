"use client";
import api, { getAccessToken, getUserId } from "@/services/api";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, createContext } from "react";

const AuthContext = createContext({ user: undefined, initialized: false });

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!getAccessToken()) {
          const uuid = getUserId();
          const r1 = await api.refreshToken({ uuid });
          api.client.setAccessToken(r1.data.accessToken);
        }

        const r2 = await api.fetchUser();
        setUser(r2.data);
        setInitialized(true);
      } catch (e) {
        router.push("/login?error=loginRequired");
      }
    };

    init();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user } = useContext(AuthContext);

  return { user };
};

export default AuthContainer;
