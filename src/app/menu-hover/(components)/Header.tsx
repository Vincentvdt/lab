"use client";

import { useGSAP } from "@gsap/react";
import NavItem from "@/app/menu-hover/(components)/NavItem";
import {
  type HoverView,
  useMenuContext,
} from "@/app/menu-hover/(context)/MenuContext";

const Header = () => {
  const { dispatch, state } = useMenuContext();

  useGSAP(() => {
    const onDone = () => {
      dispatch({ type: "reset" });
      dispatch({ type: "set-active", payload: false });
    };

    state.timeline.eventCallback("onReverseComplete", onDone);
    return () => state.timeline.eventCallback("onReverseComplete", null);
  }, [state.timeline, dispatch]);

  const handleOnMouseEnter = (args: Partial<HoverView>) => {
    dispatch({ type: "set", payload: args });
    dispatch({ type: "set-active", payload: true });
    state.timeline.timeScale(1).seek(0).play();
  };

  const handleOnMouseLeave = () => {
    // don’t reset/unmount yet — let reverse play out
    state.timeline.timeScale(1.5).reverse();
    // optional: if already at start, fire immediately
    if (state.timeline.progress() === 0) {
      dispatch({ type: "reset" });
      dispatch({ type: "set-active", payload: false });
    }
  };
  return (
    <header className="relative z-20 flex w-full items-center justify-between px-8 py-6">
      <span className="items-start font-bold">Menu Hover</span>
      <nav className="px-4 py-2" onMouseLeave={handleOnMouseLeave}>
        <ul className="flex gap-2 sm:gap-16">
          <NavItem
            onMouseEnter={() =>
              handleOnMouseEnter({
                name: "Legion",
                bgColor: "red",
                routeColor: "green",
                hoverTextColor: "green",
              })
            }
          >
            Legion
          </NavItem>
          <NavItem
            onMouseEnter={() =>
              handleOnMouseEnter({ name: "Sahara", bgColor: "orange" })
            }
          >
            Sahara
          </NavItem>
          <NavItem onMouseEnter={() => handleOnMouseEnter({ name: "Citrus" })}>
            Citrus
          </NavItem>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
