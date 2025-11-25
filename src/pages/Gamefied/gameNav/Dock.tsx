"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  href: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  mouseX: MotionValue;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  href: string;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockItem({
  children,
  className = "",
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  href,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        className={`relative inline-flex items-center justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md ${className}`}
        tabIndex={0}
        role="button"
      >
        {Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          if (child.type === DockLabel) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return cloneElement(child as React.ReactElement<any>, { isHovered });
          }

          return child; // DockIcon stays unchanged
        })}
      </motion.div>
    </Link>
  );
}

function DockLabel({ children, className = "", ...rest }: DockLabelProps) {
  const { isHovered } = rest as { isHovered: MotionValue<number> };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered?.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-0.5 text-xs text-white`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div
      className={`flex text-white font-bold items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center "
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-1 pb-2 px-4 backdrop-blur-xl`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            href={item.href}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
