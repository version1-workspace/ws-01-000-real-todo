import { useToast } from "@/lib/toast/hook";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Project, ProjectParams } from "@/services/api/models/project";
import { useEffect, useState } from "react";

export const useProjects = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const fetch = async () => {
    try {
      const res = await api.fetchProjects();
      const list = res.data.data;
      const projects = list.map((it: ProjectParams) => factory.project(it));

      setProjects(projects);
    } catch {
      toast.error("プロジェクトの取得に失敗しました");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return {
    fetch,
    projects,
  };
};
