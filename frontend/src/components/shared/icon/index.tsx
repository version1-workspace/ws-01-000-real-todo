import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeInfo,
  Bell,
  Calendar,
  CalendarX,
  ChartBar,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  CircleX,
  Code,
  Compass,
  File,
  FileText,
  Filter,
  Goal,
  Grid2X2,
  HelpCircle,
  List,
  Lock,
  LogOut,
  Mail,
  Menu,
  Milestone,
  Pencil,
  PersonStanding,
  Search,
  Send,
  Settings,
  Trash,
  Undo2,
  X,
} from "lucide-react"
import type { ComponentType } from "react"
import { IoLogoGithub, IoLogoYoutube } from "react-icons/io5"
import { classHelper } from "@/lib/cls"
import styles from "./index.module.css"

type IconComponent = ComponentType<{
  className?: string
  size?: number | string
  color?: string
}>

const icons = {
  unknown: Code,
  dashboard: ChartBar,
  project: Grid2X2,
  tasks: File,
  bulb: Goal,
  help: HelpCircle,
  settings: Settings,
  logout: LogOut,
  filter: Filter,
  folder: Grid2X2,
  shouldbe: Compass,
  arrowForward: ArrowRight,
  arrowBack: ArrowLeft,
  goal: Goal,
  close: X,
  closeCircle: CircleX,
  forward: ChevronRight,
  back: ChevronLeft,
  chevronDown: ChevronDown,
  up: ArrowUp,
  down: ArrowDown,
  caretDown: ChevronDown,
  person: PersonStanding,
  search: Search,
  notification: Bell,
  info: BadgeInfo,
  calendar: Calendar,
  clearCalendar: CalendarX,
  order: ArrowDown,
  check: CircleCheck,
  checkOutline: Check,
  add: CirclePlus,
  addCircle: CirclePlus,
  save: Check,
  undo: Undo2,
  complete: Check,
  edit: Pencil,
  archive: Archive,
  remove: Trash,
  barChart: ChartBar,
  lineChart: ChartLine,
  milestone: Milestone,
  task: FileText,
  menu: Menu,
  layout: List,
  github: IoLogoGithub,
  paperPlane: Send,
  mail: Mail,
  mailFilled: Mail,
  youtube: IoLogoYoutube,
  lock: Lock,
} satisfies Record<string, IconComponent>

type IconType = typeof icons
export type IconName = keyof IconType

interface Props {
  name: IconName
  className?: string
  interactive?: "pulse" | "hover" | "hoverDark"
  size?: number | string
  color?: string
  onClick?: () => void
}

const Icon = ({
  name,
  size,
  color,
  interactive,
  className,
  onClick,
}: Props) => {
  const Component = icons[name]
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
  )
}

export default Icon
