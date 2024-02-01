import { createContext, useContext, useState } from "react";

interface ICheckContext {
  checked: Record<string, boolean>;
  allChecked: boolean;
  check: (id: string) => void;
  checkAll: (ids: string[]) => void;
}

const CheckContext = createContext<ICheckContext>({
  checked: {},
  allChecked: false,
  check: (_id) => {},
  checkAll: (_ids: string[]) => {},
});

interface Props {
  children: React.ReactNode;
}

export const CheckContainer = ({ children }: Props) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);

  const checkAll = (ids: string[]) => {
    if (allChecked) {
      setChecked({});
      setAllChecked(false);
      return;
    }

    const newChecked: Record<string, boolean> = {};
    ids.forEach((id) => {
      newChecked[id] = true;
    });

    setChecked(newChecked);
    setAllChecked(true);
  };

  const check = (id: string) => {
    const newChecked = JSON.parse(JSON.stringify(checked));
    newChecked[id] = !newChecked[id];

    setChecked(newChecked);
  };

  return (
    <CheckContext.Provider value={{ check, checked, allChecked, checkAll }}>
      {children}
    </CheckContext.Provider>
  );
};

const useCheck = () => {
  const { check, checked, allChecked, checkAll } = useContext(CheckContext);
  const ids = Object.keys(checked);

  return {
    ids,
    check,
    checked,
    allChecked,
    checkAll,
  };
};

export default useCheck;
