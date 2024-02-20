import { useContext } from "react";
import { ToastContext } from ".";

const defaultDuration = 3000;

export const useToast = () => {
  const { push, remove } = useContext(ToastContext);
  const info = (message: string, options = { duration: defaultDuration }) => {
    const id = push({
      variant: "info",
      message,
    });

    setTimeout(() => {
      remove(id);
    }, options.duration);
  };

  const success = (
    message: string,
    options = { duration: defaultDuration },
  ) => {
    const id = push({
      variant: "success",
      message,
    });

    setTimeout(() => {
      remove(id);
    }, options.duration);
  };

  const error = (message: string, options = { duration: defaultDuration }) => {
    const id = push({
      variant: "error",
      message,
    });

    setTimeout(() => {
      remove(id);
    }, options.duration);
  };

  return {
    info,
    success,
    error,
  };
};
