import { createContext, ReactNode } from "react";

interface INotificationBarContext {
  message: string;
  duration: number;
  show: boolean;
  push: (message: string) => void;
}

const NotificationBarContext = createContext<INotificationBarContext>({
  message: "",
  duration: 1000,
  show: false,
  push: (_m) => {},
});

export function NotificaitonBarContainer({
  children,
  duration,
}: {
  children: ReactNode;
  duration?: number;
}) {
  return (
    <NotificaitonBarContext.Provider value>
      {children}
    </NotificaitonBarContext.Provider>
  );
}
