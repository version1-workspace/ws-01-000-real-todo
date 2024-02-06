import { useState } from "react";
import api from "@/services/api";
import { Task, TaskParams } from "@/services/api/models/task";
import { factory } from "@/services/api/models";

const useMilestones = () => {
  const [orphans, setOrphans] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Task[]>([]);

  const fetch = async ({ slug }: { slug: string }) => {
    const res = await api.fetchMilestones({ slug });
    const { milestones, orphans } = res.data.data
    setMilestones(milestones.map((it: TaskParams) => factory.task(it)));
    setOrphans(orphans.map((it: TaskParams) => factory.task(it)));
  };

  return {
    milestones,
    orphans,
    fetch,
  };
};

export default useMilestones;
