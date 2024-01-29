import { createContext, useContext, useMemo } from "react";
import { useToast } from "@/lib/toast/hook";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Project, ProjectParams } from "@/services/api/models/project";
import { useEffect, useState } from "react";

interface IProjectContext {
  data: Project[];
  fetch: () => Promise<void>;
}

interface OptionItem {
  label: string;
  value: string;
}

const ProjectsContext = createContext<IProjectContext>({
  data: [],
  fetch: async () => {},
});

interface Props {
  children?: React.ReactNode;
}

export const ProjectsContainer = ({ children }: Props) => {
  const toast = useToast();
  const [data, setData] = useState<Project[]>([]);
  const fetch = async () => {
    try {
      const res = await api.fetchProjects();
      const list = res.data.data;
      const projects = list.map((it: ProjectParams) => factory.project(it));

      setData(projects);
    } catch {
      toast.error("プロジェクトの取得に失敗しました");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <ProjectsContext.Provider value={{ data, fetch }}>
      {children}
    </ProjectsContext.Provider>
  );
};

const useProjects = () => {
  const { fetch, data } = useContext(ProjectsContext);

  const options = useMemo(() => {
    return data.reduce((acc: OptionItem[], it: Project) => {
      return [...acc, { label: it.name, value: it.id }];
    }, []);
  }, [data]);

  return {
    fetch,
    projects: data,
    options
  };
};

export default useProjects;
