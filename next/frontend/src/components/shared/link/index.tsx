import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export default function AppLink({
  children,
  disabled,
  href,
  className,
}: Props) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
