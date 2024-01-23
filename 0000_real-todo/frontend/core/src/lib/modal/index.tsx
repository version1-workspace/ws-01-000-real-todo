"use client";
import { ReactNode, createContext, useContext, useState } from "react";
import Modal, { ContainerConfig } from "./components";

interface Content {
  content: ReactNode;
}

interface IModalContext {
  show: boolean;
  stack: Content[];
  peak?: Content;
  push?: (content: Content) => void;
  pop?: () => void;
  open?: (content: Content) => void;
  hide?: () => void;
}

const ModalContext = createContext<IModalContext>({
  show: false,
  stack: [] as Content[],
});

interface Props {
  config: ContainerConfig;
  children: ReactNode;
}

export const ModalContainer = ({ config, children }: Props) => {
  const [show, setShow] = useState(false);
  const [stack, setStack] = useState<Content[]>([]);

  const push = (content: Content) => {
    setStack([...stack, content]);
  };

  const pop = () => {
    const _stack = JSON.parse(JSON.stringify(stack));
    const content = _stack.pop();
    setStack(_stack);

    return content;
  };

  const peak = stack[0];

  const open = (content: Content) => {
    push(content);
    setShow(true);
  };

  const hide = () => {
    pop();
    setShow(false);
  };

  return (
    <ModalContext.Provider value={{ show, stack, peak, push, pop, open, hide }}>
      {children}
      <Modal config={config} show={show} onClose={hide}>
        {peak?.content || null}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const { show, push, pop, peak, open, hide } = useContext(ModalContext);

  return {
    show,
    push: push!,
    pop: pop!,
    peak: peak!,
    open: open!,
    hide: hide!,
  };
};
