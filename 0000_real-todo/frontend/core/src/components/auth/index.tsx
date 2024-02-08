"use client";
import api, { getAccessToken, getUserId } from "@/services/api";
import { factory } from "@/services/api/models";
import { User } from "@/services/api/models/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, createContext } from "react";
import route from "@/lib/route";

interface IAuthContext {
  user?: User;
  logout: () => void;
  initialized: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: undefined,
  logout: () => {},
  initialized: false,
});

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
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
        const user = factory.user(r2.data.data);
        setUser(user);
        setInitialized(true);
      } catch (e) {
        router.push(route.login.with("?error=loginRequired"));
      }
    };

    init();
  }, []);

  const logout = () => {
    router.push(route.login.toString());
    setUser(undefined);
    api.client.setAccessToken("");
  };

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, logout } = useContext(AuthContext);

  return { user, logout };
};

export default AuthContainer;
