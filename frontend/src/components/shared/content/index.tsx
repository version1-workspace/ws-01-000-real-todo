"use client"

import styles from "@/app/main/layout.module.css"
import AuthContainer from "@/components/auth"
import Header from "@/components/shared/header/main"
import Sidebar from "@/components/shared/sidebar"
import { NotificaitonBarContainer } from "@/contexts/notificationBar"
import { ProjectsContainer } from "@/contexts/projects"
import { TaskListContainer } from "@/contexts/tasks"
import { ModalContainer } from "@/lib/modal"
import { ToastContainer } from "@/lib/toast"
import { position } from "@/lib/toast/config"

export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.body}>
      <AuthContainer>
        <ProjectsContainer>
          <TaskListContainer>
            <ToastContainer
              config={{
                position: position.TOP_RIGHT,
              }}
            >
              <ModalContainer config={{ width: "60%" }}>
                <NotificaitonBarContainer>
                  <Header />
                  <main className={styles.main}>
                    <Sidebar />
                    <div className={styles.mainContent}>{children}</div>
                  </main>
                </NotificaitonBarContainer>
              </ModalContainer>
            </ToastContainer>
          </TaskListContainer>
        </ProjectsContainer>
      </AuthContainer>
    </div>
  )
}

export const dynamic = "error"
