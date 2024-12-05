"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Header from "@/components/shared/header/public";
import Footer from "@/components/shared/footer";
import LoginForm from "@/components/auth/loginForm";
import {
  Login as LoginCover,
  SignUp as SignUpCover,
} from "@/components/auth/cover";
import SignUpForm from "@/components/auth/signupForm";
import Transition from "../transition";
import { useToast } from "@/lib/toast/hook";

interface Props {
  light?: boolean;
  initialScene?: Scene;
}

function SceneContent({
  scene,
  login,
  signup,
}: {
  scene: Scene;
  login: React.ReactNode;
  signup: React.ReactNode;
}) {
  if (scene === "login") {
    return login;
  }

  if (scene === "signup") {
    return signup;
  }

  return null;
}

type Scene = "login" | "signup" | "transition";

const Content = ({ light, initialScene }: Props) => {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [rendered, setRendered] = useState(false);
  const [scene, setScene] = useState<Scene>(initialScene || "login");

  const position = scene === "login" ? "left" : "right";

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      if (!rendered && error === "loginRequired") {
        toast.error("ログインが必要です");
      }
    }
    setRendered(true);
  }, [searchParams, toast, rendered]);

  return (
    <>
      <Header light={light} />
      <section className={styles.content}>
        <div className={styles.card}>
          <Transition
            duration={500}
            transitioning={scene === "transition"}
            position={position}
            on={
              <SceneContent
                scene={scene}
                login={<LoginForm />}
                signup={<SignUpForm />}
              />
            }
            off={
              <SceneContent
                scene={scene}
                login={
                  <SignUpCover
                    onSwitch={() => {
                      setScene("transition");
                      setTimeout(() => setScene("signup"), 200);
                    }}
                  />
                }
                signup={
                  <LoginCover
                    onSwitch={() => {
                      setScene("transition");
                      setTimeout(() => setScene("login"), 200);
                    }}
                  />
                }
              />
            }
          />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Content;
