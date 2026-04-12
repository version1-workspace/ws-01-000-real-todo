import dayjs from "dayjs";

export const StatsType = {
  todo: "todo",
  completed: "completed",
};

export interface StatsParams {
  label: string;
  type: keyof typeof StatsType;
  data: Data[];
}

interface Data {
  date: number;
  value: number;
}

export class StatsModel {
  readonly _raw: StatsParams;

  constructor(params: StatsParams) {
    this._raw = params;
  }

  labels(unit: string) {
    if (!this._raw) {
      return [];
    }

    const dataset = this._raw;
    switch (unit) {
      case "year":
        return dataset.data.map((item) => dayjs(item.date).format("YYYY"));
      case "month":
        return dataset.data.map((item) => dayjs(item.date).format("YYYY / MM"));
      case "week":
        return dataset.data.map(
          (item) => dayjs(item.date).format("MM-DD") + " ~ ",
        );
      case "day":
        return dataset.data.map((item) => dayjs(item.date).format("M / DD"));
      default:
        return dataset.data.map((item) =>
          dayjs(item.date).format("YYYY-MM-DD"),
        );
    }
  }
}

const chartOptions = {
  completed: {
    borderColor: "#8fe3c7",
    backgroundColor: "#8fe3c7",
    stack: "stack-0",
  },
  todo: {
    borderColor: "#8fe3c7",
    backgroundColor: "#8fe3c740",
    stack: "stack-0",
  },
};

export const dataset = (data: Stats[], unit: string) => {
  if (data.length === 0) {
    return [];
  }

  return {
    labels: data[0].labels(unit),
    datasets: data.map((item) => {
      return {
        label: item.label,
        data: item.data.map((it) => it.value),
        ...chartOptions[item.type]
      };
    }),
  };
};

export type Stats = StatsParams & StatsModel;
