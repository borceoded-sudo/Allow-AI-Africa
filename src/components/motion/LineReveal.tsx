"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

const lineVariants: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%" },
};

/**
 * Headline reveal by clip-wipe, one line at a time — the mechanic both
 * reference sites use for section titles. Each line sits in an overflow-hidden
 * box and slides up into it.
 *
 * Viewport detection has to live on the *parent*: the line spans start
 * translated fully outside their own clip box, so an observer attached to them
 * would measure zero intersection and the reveal would never fire.
 */
export function LineReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
}: {
  lines: readonly string[];
  as?: keyof typeof TAGS;
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className}>
        {lines.map((line) => (
          <span key={line} className={`block ${lineClassName ?? ""}`}>
            {line}
          </span>
        ))}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={lineVariants}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.1,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0.12 },
  visible: { opacity: 1 },
};

/**
 * Word-by-word opacity reveal: later words start faint and darken as the block
 * enters. Used for the large pull statements.
 */
export function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          variants={wordVariants}
          transition={{ duration: 0.5, delay: i * 0.028, ease: "easeOut" }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
