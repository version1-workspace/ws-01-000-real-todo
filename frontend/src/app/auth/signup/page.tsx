import { Suspense } from "react"
import { Metadata } from "next"
import { ToastContainer } from "@/lib/toast"
import { position } from "@/lib/toast/config"
import Content from "../components/content"

export const metadata: Metadata = {
  title: "Turvo | 新規登録",
}

export default function Login() {
  return (
    <main>
      <ToastContainer config={{ position: position.BOTTOM_LEFT }}>
        <Suspense>
          <Content light initialScene="signup" />
        </Suspense>
      </ToastContainer>
    </main>
  )
}
