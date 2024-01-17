import styles from "@/app/main/layout.module.css";
import AuthContainer from "@/components/auth";
import Header from "@/components/common/header/main";
import Sidebar from "@/components/common/sidebar";
import { ToastContainer } from "@/lib/toast";
import { position } from "@/lib/toast/config";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <body className={[inter.className, styles.body].join(" ")}>
      <ToastContainer
        config={{
          position: position.TOP_RIGHT,
        }}>
        <AuthContainer>
          <Header />
          <main className={styles.main}>
            <Sidebar />
            <div className={styles.mainContent}>{children}</div>
          </main>
        </AuthContainer>
      </ToastContainer>
    </body>
  );
}

export const dynamic = "error";
