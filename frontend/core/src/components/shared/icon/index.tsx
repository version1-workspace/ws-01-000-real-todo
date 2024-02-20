import {
  IoArrowUndoOutline,
  IoAddOutline,
  IoAnalytics,
  IoArchiveOutline,
  IoArrowDown,
  IoArrowUpOutline,
  IoBarChart,
  IoCalendarOutline,
  IoCheckmark,
  IoCheckmarkCircle,
  IoCheckmarkOutline,
  IoChevronBack,
  IoChevronForward,
  IoCloseCircle,
  IoCloseOutline,
  IoCaretDown,
  IoDocumentText,
  IoEllipsisVerticalOutline,
  IoGitCommit,
  IoInformationCircleSharp,
  IoNotificationsSharp,
  IoPencil,
  IoPerson,
  IoSearch,
  IoSwapVertical,
  IoTrashOutline,
  IoListOutline,
  IoCompassOutline,
  IoScanOutline,
  IoCodeOutline,
  IoChevronDown,
  IoFilter,
  IoGridOutline,
  IoAddCircle,
} from "react-icons/io5";
import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";

const icons = {
  unknown: IoCodeOutline,
  filter: IoFilter,
  folder: IoGridOutline,
  shouldbe: IoCompassOutline,
  goal: IoScanOutline,
  close: IoCloseOutline,
  closeCircle: IoCloseCircle,
  forward: IoChevronForward,
  back: IoChevronBack,
  chevronDown: IoChevronDown,
  up: IoArrowUpOutline,
  down: IoArrowDown,
  caretDown: IoCaretDown,
  person: IoPerson,
  search: IoSearch,
  notification: IoNotificationsSharp,
  info: IoInformationCircleSharp,
  calendar: IoCalendarOutline,
  order: IoSwapVertical,
  check: IoCheckmarkCircle,
  checkOutline: IoCheckmarkOutline,
  add: IoAddOutline,
  addCircle: IoAddCircle,
  save: IoCheckmark,
  undo: IoArrowUndoOutline,
  complete: IoCheckmark,
  edit: IoPencil,
  archive: IoArchiveOutline,
  remove: IoTrashOutline,
  barChart: IoBarChart,
  lineChart: IoAnalytics,
  milestone: IoGitCommit,
  task: IoDocumentText,
  menu: IoEllipsisVerticalOutline,
  layout: IoListOutline,
};

type IconType = typeof icons;

interface Props {
  name: keyof IconType;
  className?: string;
  interactive?: "pulse" | "hover" | "hoverDark";
  size?: number | string;
  color?: string;
  onClick?: () => void;
}

const Icon = ({
  name,
  size,
  color,
  interactive,
  className,
  onClick,
}: Props) => {
  const Component = icons[name];
  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.interactive]: !!interactive,
        [styles.interactivePulse]: interactive === "pulse",
        [styles.interactiveHover]: interactive === "hover",
        [styles.interactiveHoverDark]: interactive === "hoverDark",
      })}
      onClick={onClick}>
      {<Component className={className} size={size} color={color} />}
    </div>
  );
};

export default Icon;
