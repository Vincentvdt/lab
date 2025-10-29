"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Limelight } from "next/font/google";
import { useEffect, useMemo, useRef } from "react";
import { useMenuContext } from "@/app/menu-hover/(context)/MenuContext";

export const limelight = Limelight({
  weight: "400",
  subsets: ["latin"],
});

const HoverScreen = () => {
  const { state } = useMenuContext();
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
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
          {
            scaleY: 1,
            duration: 0.55,
            ease: "power3.out",
            immediateRender: false,
          },
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, ease: "power3.out" },
          "<+=0.35",
        )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
          },
          "<+=0.2",
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

  const animateDescriptionChange = useMemo(
    () =>
      contextSafe(() => {
        if (!descriptionRef.current) return;
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
        );
      }),
    [contextSafe],
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
          lazy: true,
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
      animateDescriptionChange();
    } else {
      hasAnimatedContent.current = true;
    }

    animateBackgroundColor(state.view.bgColor);
  }, [
    state.active,
    state.view.bgColor,
    animateBackgroundColor,
    animateTextChange,
    animateDescriptionChange,
  ]);

  return (
    <div
      ref={container}
      style={{ color: state.view.routeColor }}
      className="absolute inset-0 z-10 grid h-screen w-screen place-items-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-20 h-full w-full origin-center scale-y-0 overflow-hidden"
        style={{
          backgroundColor: state.view.bgColor,
        }}
      ></div>
      <span
        ref={textRef}
        className="z-40 font-extrabold text-8xl"
        style={{ fontFamily: limelight.style.fontFamily }}
      >
        {state.view.route.name}
      </span>
      <p
        ref={descriptionRef}
        className="absolute bottom-[5dvw] left-[5dvw] z-40 w-[25dvw] text-xs leading-5 tracking-widest opacity-0"
      >
        {state.view.route.description}
      </p>
    </div>
  );
};

export default HoverScreen;
