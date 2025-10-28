import Link from "next/link";
import type { ReactNode } from "react";
import { useMenuContext } from "@/app/menu-hover/(context)/MenuContext";

type Props = {
  href?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
};

const NavItem = ({
  href = "/menu-hover",
  onMouseEnter,
  onMouseLeave,
  children,
}: Props) => {
  const { state } = useMenuContext();

  const handleOnMouseEnter = () => onMouseEnter?.();
  const handleOnMouseLeave = () => onMouseLeave?.();

  return (
    <li
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className="cursor-pointer hover:underline"
    >
      <Link
        className="curs-pointer"
        href={href}
        style={{ color: state.active ? state.view.hoverTextColor : "" }}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
