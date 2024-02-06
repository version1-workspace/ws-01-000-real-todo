import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { classHelper, join } from "@/lib/cls";
import TextInput from "@/components/common/input/text";
import DateInput from "@/components/common/input/date";

interface Props {
  defaultValue: string;
  type?: "text" | "date";
  placeholder?: string;
  onChangeEnd?: (value: string) => void;

  max?: string;
  min?: string;
  inputStyleClass?: string;
}

const EditableField = ({
  defaultValue,
  type,
  placeholder,
  onChangeEnd,
  inputStyleClass,
  ...rest
}: Props) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef<HTMLInputElement>(null);
  const refDirty = useRef<{ dirty: boolean; value: string }>({
    dirty: false,
    value,
  });
  const Component = {
    text: TextInput,
    date: DateInput,
  }[type || "text"];

  useEffect(() => {
    const unfocus = (e: MouseEvent) => {
      const parent = e.target?.closest("." + styles.container);
      if (parent) {
        return;
      }

      setEdit(false);
      const { dirty, value } = refDirty.current;
      if (dirty && onChangeEnd) {
        onChangeEnd(value);
        refDirty.current.dirty = false;
      }
    };

    document.addEventListener("click", (e) => unfocus(e));

    return () => {
      document?.removeEventListener("click", (e) => unfocus(e));
    };
  }, [edit, value, onChangeEnd]);

  return (
    <div
      className={styles.container}
      onClick={() => {
        if (!edit) {
          setEdit(true);
          refDirty.current.dirty = true;
        }
      }}>
      <Component
        ref={ref}
        value={value}
        placeholder={placeholder}
        containerClassName={classHelper({
          [styles.inputContainer]: true,
          [styles.hidden]: !edit,
          [styles.show]: edit,
        })}
        inputClassName={join(styles.inputContainer, inputStyleClass)}
        onChange={(e) => {
          let value = e.target.value;
          if (type === "date") {
            value = value.replaceAll("-", "/");
          }
          refDirty.current.value = value;
          setValue(value);
        }}
        {...rest}
      />
      <p
        className={classHelper({
          [styles.text]: true,
          [styles.placeholder]: !value,
          [styles.hidden]: edit,
          [styles.show]: !edit,
        })}>
        {value || placeholder}
      </p>
    </div>
  );
};

export default EditableField;
