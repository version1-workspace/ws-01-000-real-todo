import { createContext, useContext, useMemo } from "react";
import { useToast } from "@/lib/toast/hook";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Project, ProjectParams } from "@/services/api/models/project";
import { useEffect, useState } from "react";
import { Pagination } from "@/services/api/models/pagination";
import { getColors } from "@/lib/colors";

interface SearchParams {
  limit?: number;
  page?: number;
  status?: string[];
}

interface IProjectContext {
  data: Project[];
  paginated?: Pagination<Project>;
  fetch: (params: SearchParams) => Promise<void>;
}

interface OptionItem {
  label: string;
  value: string;
}

const ProjectsContext = createContext<IProjectContext>({
  data: [],
  fetch: async (_: SearchParams) => {},
});

interface Props {
  children?: React.ReactNode;
}

export const useProjectsWithoutContext = () => {
  const toast = useToast();
  const [data, setData] = useState<Pagination<Project>>(
    Pagination.create<Project>(),
  );
  const fetch = async (params: SearchParams) => {
    try {
      const res = await api.fetchProjects(params);
      const list = res.data.data;
      const colors = getColors(list.length);
      const projects = list.map((it: ProjectParams, index: number) =>
        factory.project({
          ...it,
          color: colors[index],
        }),
      );

      setData(
        new Pagination({
          list: projects,
          pageInfo: res.data.pageInfo,
        }),
      );
    } catch (e) {
      console.error(e);
      toast.error("プロジェクトの取得に失敗しました");
    }
  };

  return {
    data,
    fetch,
  };
};

export const ProjectsContainer = ({ children }: Props) => {
  const { data, fetch } = useProjectsWithoutContext();

  useEffect(() => {
    fetch({
      limit: 100,
    });
  }, []);

  return (
    <ProjectsContext.Provider
      value={{ data: data.list, paginated: data, fetch }}>
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
    refetch: () => fetch({ limit: 100 }),
    projects: data,
    options,
  };
};

export default useProjects;
