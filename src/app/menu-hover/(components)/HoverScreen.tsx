"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { useMenuContext } from "@/app/menu-hover/(context)/MenuContext";

const HoverScreen = () => {
  const { state } = useMenuContext();
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedContent = useRef(false);

  const { contextSafe } = useGSAP({ scope: container });

  useGSAP(
    () => {
      if (!bgRef.current || !textRef.current) return;

      state.timeline.clear();
      state.timeline
        .fromTo(
          bgRef.current,
          {
            scaleY: 0,
            transformOrigin: "center center",
            backgroundColor: state.view.bgColor,
          },
          { scaleY: 1, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          "-=0.25",
        );

      state.timeline.pause(0);

      if (state.active) {
        state.timeline.timeScale(1).play(0);
      }

      return () => {
        state.timeline.clear();
      };
    },
    { scope: container, dependencies: [state.timeline, state.active] },
  );

  const animateTextChange = useMemo(
    () =>
      contextSafe(() => {
        if (!textRef.current) return;
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
      }),
    [contextSafe],
  );

  const animateBackgroundColor = useMemo(
    () =>
      contextSafe((color: string) => {
        if (!bgRef.current) return;
        gsap.to(bgRef.current, {
          backgroundColor: color,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }),
    [contextSafe],
  );

  useEffect(() => {
    if (!state.active) {
      hasAnimatedContent.current = false;
      return;
    }

    if (hasAnimatedContent.current) {
      animateTextChange();
    } else {
      hasAnimatedContent.current = true;
    }

    animateBackgroundColor(state.view.bgColor);
  }, [
    state.active,
    state.view.bgColor,
    animateBackgroundColor,
    animateTextChange,
  ]);

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
