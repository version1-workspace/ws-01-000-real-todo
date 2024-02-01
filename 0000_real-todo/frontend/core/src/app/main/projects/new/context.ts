import { createContext } from "react";
import dayjs from "dayjs";
import { Project } from "@/services/api/models/project";
import { Errors } from "@/models/validator";
import { factory } from "@/services/api/models";

interface FormContextValue {
  project: Project;
  errors?: Errors;
  mutations: {
    setProject: (project: Project) => void;
    setErrors: (errors: Errors) => void;
  };
}

export const FormContext = createContext<FormContextValue>({
  project: factory.project({
    name: "",
    deadline: dayjs().format("YYYY-MM-DD"),
    slug: "",
    goal: "",
    shouldbe: "",
    milestones: [],
    createdAt: dayjs().format(),
    updatedAt: dayjs().format(),
    status: "initial",
  }),
  errors: undefined,
  mutations: {
    setProject: (_: Project) => {},
    setErrors: (_: Errors) => {},
  },
});
