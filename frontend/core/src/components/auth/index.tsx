"use client";
import api, { getAccessToken, getUserId } from "@/services/api";
import { factory } from "@/services/api/models";
import { User } from "@/services/api/models/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, createContext } from "react";
import route from "@/lib/route";
import { AxiosError } from "axios";

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

interface Props {
  children: React.ReactNode;
  isPublic?: boolean;
}

const AuthContainer = ({ children, isPublic }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!getAccessToken()) {
          const uuid = getUserId();
          const r1 = await api.refreshToken({ uuid });
          api.client.setAccessToken(r1.data.data.accessToken);
        }

        const r2 = await api.fetchUser();
        const user = factory.user(r2.data.data);
        setUser(user);
        if (isPublic) {
          router.push(route.main.toString());
        }
      } catch (e) {
        const error = e as AxiosError;
        if (!isPublic && error.response?.status === 401) {
          router.push(route.auth.login.with("?error=loginRequired"));
          return;
        }

        if (error.response?.status === 401) {
          return;
        }
        throw e;
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, []);

  const logout = async () => {
    await api.logout();
    setUser(undefined);
    api.client.setAccessToken("");

    router.push(route.auth.login.toString());
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
