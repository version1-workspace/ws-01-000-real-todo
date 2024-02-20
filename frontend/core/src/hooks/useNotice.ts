import useNotificationBar from "@/contexts/notificationBar";
import {useToast} from "@/lib/toast/hook"
import {useEffect} from "react";

export function useNotice() {
  const toast = useToast();

  const unimplementedFunc = () => toast.info('未実装の機能です。')

  return {
    unimplementedFunc,
  }
}

export function useUnimplementedPage() {
  const notificationBar = useNotificationBar()

  useEffect(() => {
    notificationBar.push('未実装のページです。')
  }, [])

  return
}
