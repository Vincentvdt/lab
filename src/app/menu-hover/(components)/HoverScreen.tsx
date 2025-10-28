"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useMenuContext } from "@/app/menu-hover/(context)/MenuContext";

const HoverScreen = () => {
  const { state, add } = useMenuContext();
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!container.current || !textRef.current || !bgRef.current) return;

      const local = gsap.timeline().to(bgRef.current, { scaleY: 1 }).fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
        },
        "<",
      );

      add(local, "enter");
    },
    { scope: container, dependencies: [state.view.name, state.timeline] },
  );

  if (!state.active) return null;

  return (
    <div
      ref={container}
      className="absolute inset-0 z-10 grid h-screen w-screen place-items-center overflow-hidden"
    >
      <span
        ref={textRef}
        className="relative z-40 font-extrabold text-5xl"
        style={{ color: state.view.routeColor }}
      >
        {state.view.name}
      </span>
      <div
        ref={bgRef}
        className="absolute inset-0 z-20 h-full w-full origin-center scale-y-0"
        style={{ backgroundColor: state.view.bgColor }}
      ></div>
    </div>
  );
};

export default HoverScreen;
