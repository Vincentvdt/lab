"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type Reducer,
  useContext,
  useMemo,
  useReducer,
} from "react";

type RouteArgs = {
  name: string;
  description: string;
};

export type HoverView = {
  route: RouteArgs;
  bgColor: string;
  routeColor: string;
  hoverTextColor: string;
};

type State = {
  active: boolean;
  view: HoverView;
  timeline: GSAPTimeline;
};

type Action =
  | { type: "set"; payload: Partial<HoverView> }
  | { type: "reset" }
  | { type: "set-active"; payload: boolean };

export type MenuContextValue = {
  state: State;
  dispatch: Dispatch<Action>;
};

const DEFAULT_VIEW = {
  route: {
    name: "default",
    description: "default",
  },
  bgColor: "#ffffff",
  routeColor: "#222222",
  hoverTextColor: "#000000",
} as const satisfies HoverView;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        view: { ...DEFAULT_VIEW, ...action.payload },
      };
    case "reset":
      return {
        ...state,
        view: DEFAULT_VIEW,
      };
    case "set-active":
      return { ...state, active: action.payload };
    default:
      return state;
  }
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

type InitialState = {
  active?: boolean;
  view?: Partial<HoverView>;
  timeline?: GSAPTimeline;
};
interface MenuProviderProps {
  children: ReactNode;
  initialState?: InitialState;
}

export const MenuProvider = ({ children, initialState }: MenuProviderProps) => {
  const sharedTimeline = useMemo<GSAPTimeline>(
    () =>
      initialState?.timeline ??
      gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.inOut",
          duration: 1,
        },
      }),
    [initialState?.timeline],
  );

  const initial: State = {
    view: { ...DEFAULT_VIEW, ...(initialState?.view ?? {}) },
    active: initialState?.active ?? false,
    timeline: sharedTimeline,
  };

  const [state, dispatch] = useReducer(reducer, initial);

  const value: MenuContextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenuContext = (): MenuContextValue => {
  const ctx = useContext(MenuContext);
  if (!ctx)
    throw new Error("useMenuContext must be used within a MenuProvider");
  return ctx;
};
