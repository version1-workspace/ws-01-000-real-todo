import {
  IoAddCircle,
  IoAddOutline,
  IoAnalytics,
  IoArchiveOutline,
  IoArrowBack,
  IoArrowDown,
  IoArrowForward,
  IoArrowUndoOutline,
  IoArrowUpOutline,
  IoBarChart,
  IoBulbOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoCaretDown,
  IoCheckmark,
  IoCheckmarkCircle,
  IoCheckmarkOutline,
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoCloseCircle,
  IoCloseOutline,
  IoCodeOutline,
  IoCompassOutline,
  IoDocumentOutline,
  IoDocumentText,
  IoEllipsisVerticalOutline,
  IoExit,
  IoFilter,
  IoGitCommit,
  IoGitCommitOutline,
  IoGridOutline,
  IoHelpCircleOutline,
  IoInformationCircleSharp,
  IoListOutline,
  IoLockClosedOutline,
  IoLogoGithub,
  IoLogoYoutube,
  IoMail,
  IoMailOutline,
  IoNotificationsSharp,
  IoPaperPlaneOutline,
  IoPencil,
  IoPerson,
  IoScanOutline,
  IoSearch,
  IoSettingsOutline,
  IoSwapVertical,
  IoTrashOutline,
} from "react-icons/io5";
import { classHelper } from "@/lib/cls";
import styles from "./index.module.css";

const icons = {
  unknown: IoCodeOutline,
  dashboard: IoBarChart,
  project: IoGridOutline,
  tasks: IoDocumentOutline,
  bulb: IoBulbOutline,
  help: IoHelpCircleOutline,
  settings: IoSettingsOutline,
  logout: IoExit,
  filter: IoFilter,
  folder: IoGridOutline,
  shouldbe: IoCompassOutline,
  arrowForward: IoArrowForward,
  arrowBack: IoArrowBack,
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
  clearCalendar: IoCalendarClearOutline,
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
  milestone: IoGitCommitOutline,
  task: IoDocumentText,
  menu: IoEllipsisVerticalOutline,
  layout: IoListOutline,
  github: IoLogoGithub,
  paperPlane: IoPaperPlaneOutline,
  mail: IoMailOutline,
  mailFilled: IoMail,
  youtube: IoLogoYoutube,
  lock: IoLockClosedOutline,
};

type IconType = typeof icons;
export type IconName = keyof IconType;

interface Props {
  name: IconName;
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
    <span
      className={classHelper({
        [styles.container]: true,
        [styles.interactive]: !!interactive,
        [styles.interactivePulse]: interactive === "pulse",
        [styles.interactiveHover]: interactive === "hover",
        [styles.interactiveHoverDark]: interactive === "hoverDark",
      })}
      onClick={onClick}
    >
      {<Component className={className} size={size} color={color} />}
    </span>
  );
};

export default Icon;
