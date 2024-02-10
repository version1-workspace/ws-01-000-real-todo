"use client";
import styles from "@/app/main/layout.module.css";
import AuthContainer from "@/components/auth";
import Header from "@/components/common/header/main";
import Sidebar from "@/components/common/sidebar";
import { ModalContainer } from "@/lib/modal";
import { ToastContainer } from "@/lib/toast";
import { TaskListContainer } from "@/hooks/useTask";
import { position } from "@/lib/toast/config";
import { Inter } from "next/font/google";
import { ProjectsContainer } from "@/hooks/useProjects";
import { NotificaitonBarContainer } from "@/contexts/notificationBar";

const inter = Inter({ subsets: ["latin"] });
export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <body className={[inter.className, styles.body].join(" ")}>
      <ToastContainer
        config={{
          position: position.TOP_RIGHT,
        }}>
        <ModalContainer config={{ width: "60%" }}>
          <NotificaitonBarContainer>
            <AuthContainer>
              <ProjectsContainer>
                <TaskListContainer>
                  <Header />
                  <main className={styles.main}>
                    <Sidebar />
                    <div className={styles.mainContent}>{children}</div>
                  </main>
                </TaskListContainer>
              </ProjectsContainer>
            </AuthContainer>
          </NotificaitonBarContainer>
        </ModalContainer>
      </ToastContainer>
    </body>
  );
}

export const dynamic = "error";
