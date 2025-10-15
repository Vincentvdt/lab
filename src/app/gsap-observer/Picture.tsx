import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { type CSSProperties, useRef } from "react";

interface PictureProps {
  picture: string;
  className?: string;
  style?: CSSProperties;
}

const Picture = ({ picture, className, style }: PictureProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const handleMouseEnter = contextSafe(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: -30,
      rotateX: 10,
      scale: 0.9,
      border: "5px solid white",
      duration: 0.3,
      ease: "power2.inOut",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: 0,
      rotateX: 0,
      scale: 1,
      border: "none",
      duration: 0.6,
      ease: "power2.inOut",
    });
  });

  return (
    <button
      ref={ref}
      type="button"
      key={picture}
      className={`cursor-pointer ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={picture}
        alt={`Picture`}
        className="object-cover"
        fill
        sizes="100%"
        priority
      />
    </button>
  );
};

export default Picture;
