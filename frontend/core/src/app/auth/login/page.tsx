import { Metadata } from "next";
import { ToastContainer } from "@/lib/toast";
import { position } from "@/lib/toast/config";
import Content from "../components/content";

export const metadata: Metadata = {
  title: "Turvo | サインイン",
};

export default function Login() {
  return (
    <main>
      <ToastContainer config={{ position: position.BOTTOM_LEFT }}>
        <Content light initialScene="login" />
      </ToastContainer>
    </main>
  );
}
