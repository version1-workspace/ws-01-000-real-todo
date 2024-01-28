import styles from "./index.module.css";
import ShowIf from "../showIf";

interface Props {
  message?: string;
}

const ErrorMessage = ({ message }: Props) => {
  return (
    <ShowIf value={message}>
      <p className={styles.message}>{message}</p>
    </ShowIf>
  );
};

export default ErrorMessage;
