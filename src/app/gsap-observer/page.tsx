"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Observer from "gsap/Observer";
import { button, useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import Picture from "@/app/gsap-observer/Picture";

gsap.registerPlugin(useGSAP, Observer);

const Page = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Tween | null>(null);

  const MAX_PICTURES = 20;
  const [picturesLength, setPicturesLength] = useState(10);
  const [sliderRadius, setSliderRadius] = useState(500);
  const [cameraPosition, setCameraPosition] = useState({ x: 50, y: 30 });
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const imageSize = { width: 200, height: 250 };

  const minRadius = useMemo(
    () => imageSize.width / (2 * Math.sin(Math.PI / picturesLength)),
    [picturesLength],
  );

  const reset = () => {
    console.log("reset");
    setSpeed(1);
    setSliderRadius(500);
    setCameraPosition({ x: 50, y: 30 });
    setPicturesLength(10);
  };

  const btnText = paused ? "Play" : "Pause";

  useControls({
    "Reset all": button(() => reset()),
  });

  useControls("Camera", {
    x: {
      value: cameraPosition.x,
      step: 1,
      min: 0,
      max: 100,
      onChange: (value) => setCameraPosition((prev) => ({ ...prev, x: value })),
    },
    y: {
      value: cameraPosition.y,
      step: 1,
      min: 0,
      max: 100,
      onChange: (value) => setCameraPosition((prev) => ({ ...prev, y: value })),
    },
  });

  const [, setSliderControls] = useControls(
    "Slider",
    () => ({
      radius: {
        value: sliderRadius,
        min: minRadius,
        max: 1000,
        step: 10,
        onChange: (value) => setSliderRadius(value),
      },
      speed: {
        value: speed,
        min: 1,
        max: 10,
        step: 1,
        onChange: (value) => setSpeed(value),
      },
      [btnText]: button(() => togglePause()),
    }),
    [picturesLength, btnText],
  );

  useControls("Pictures", {
    number: {
      value: picturesLength,
      min: 7,
      max: MAX_PICTURES,
      step: 1,
      onChange: (value) => setPicturesLength(value),
    },
  });

  useEffect(() => {
    if (sliderRadius < minRadius) {
      setSliderRadius(minRadius);
      setSliderControls({ radius: minRadius });
    }
  }, [minRadius, sliderRadius, setSliderControls]);

  useGSAP(() => {
    if (!sliderRef.current) return;

    tl.current = gsap.to(sliderRef.current, {
      rotateY: "+=360",
      ease: "none",
      repeat: -1,
      duration: 20,
    });

    Observer.create({
      target: window,
      type: "wheel,touch",
      debounce: true,
    });

    return () => tl.current?.kill();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    tl.current.timeScale(speed);
  }, [speed]);

  useEffect(() => {
    if (!tl.current) return;
    tl.current.paused(paused);
  }, [paused]);

  const togglePause = () => {
    if (!tl.current) return;
    tl.current.paused(!tl.current.paused());
    setPaused(tl.current.paused());
  };

  const pictures = useMemo(
    () =>
      Array.from(
        { length: MAX_PICTURES },
        (_, i) => `https://picsum.photos/200/250?random=${i + 1}`,
      ),
    [],
  );

  return (
    <div
      className="grid h-screen w-screen place-items-center overflow-hidden"
      style={{
        perspective: "1000px",
        perspectiveOrigin: `${cameraPosition.x}% ${cameraPosition.y}%`,
      }}
    >
      <div
        ref={sliderRef}
        className="transform-3d pointer-events-none relative inset-0 select-none"
        style={{
          ...imageSize,
        }}
      >
        {pictures.slice(0, picturesLength).map((picture, i) => (
          <Picture
            key={picture}
            picture={picture}
            className="pointer-events-auto absolute inset-0"
            style={{
              transform: `
                rotateY(${(360 / picturesLength) * i}deg)
                translateZ(${sliderRadius}px)
              `,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
