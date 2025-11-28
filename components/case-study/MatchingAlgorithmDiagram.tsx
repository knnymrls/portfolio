"use client";

import { motion } from "framer-motion";

const v1Components = [
  { name: "Academic", weight: "50%", icon: "📚" },
  { name: "Major", weight: "25%", icon: "🎯" },
  { name: "Financial", weight: "25%", icon: "💰" },
];

const categories = [
  "Big Public",
  "Liberal Arts",
  "Mid-Size Private",
  "STEM/Tech",
  "Urban",
  "Rural",
];

export function V1AlgorithmDiagram() {
  return (
    <div className="my-8 rounded-[20px] border border-border bg-surface p-6">
      {/* Formula */}
      <div className="mb-6 text-center">
        <code className="rounded-full border border-border bg-background px-4 py-2 text-sm text-surface-secondary">
          base_score = (academic × 0.50) + (major × 0.25) + (financial × 0.25)
        </code>
      </div>

      {/* Score Components */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {v1Components.map((component, i) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[20px] border border-border bg-background p-4 text-center"
          >
            <div className="mb-2 text-2xl">{component.icon}</div>
            <div className="text-sm font-medium text-foreground">
              {component.name}
            </div>
            <div className="text-xs text-surface-secondary">
              {component.weight}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Learning */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="rounded-[20px] border border-border bg-background p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            + Category Boost (±0.1)
          </span>
          <span className="text-xs text-surface-secondary">
            Learned from swipes
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-surface-secondary"
            >
              {cat}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Arrow */}
      <div className="my-4 flex justify-center text-surface-secondary">↓</div>

      {/* Final Score */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="rounded-[20px] border border-border bg-background p-4 text-center"
      >
        <span className="text-xs text-surface-secondary">Match Score</span>
        <div className="font-mono text-xl font-medium text-foreground">
          0.0 → 1.0
        </div>
      </motion.div>
    </div>
  );
}

export function V2AlgorithmDiagram() {
  const inputs = [
    { icon: "👤", label: "Student Profile" },
    { icon: "🏫", label: "School Data" },
    { icon: "👆", label: "Swipe History" },
    { icon: "💰", label: "Aid by Income" },
  ];

  const reasoning = [
    "Harvard costs $0-5K for low-income families",
    '"Software Engineering" = "Computer Science"',
    '"Anywhere" means don\'t penalize distance',
  ];

  return (
    <div className="my-8 rounded-[20px] border border-border bg-surface p-6">
      {/* Inputs */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {inputs.map((input, i) => (
          <motion.div
            key={input.label}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-[20px] border border-border bg-background p-3 text-center"
          >
            <div className="mb-1 text-xl">{input.icon}</div>
            <div className="text-xs text-surface-secondary">{input.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Arrow */}
      <div className="my-4 flex justify-center text-surface-secondary">↓</div>

      {/* LLM */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-4 rounded-[20px] border border-border bg-background p-5"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="text-sm font-medium text-foreground">
            GPT-4o-mini
          </span>
        </div>

        <p className="mb-3 text-center text-xs text-surface-secondary">
          The model reasons about context:
        </p>

        <div className="space-y-2">
          {reasoning.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground"
            >
              {r}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Arrow */}
      <div className="my-4 flex justify-center text-surface-secondary">↓</div>

      {/* Output */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between rounded-[20px] border border-border bg-background p-4"
      >
        <div>
          <span className="text-xs text-surface-secondary">Output</span>
          <div className="text-sm font-medium text-foreground">
            Ranked Schools + Reasoning
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-surface-secondary">Latency</span>
          <div className="font-mono text-base text-foreground">2-5s</div>
        </div>
      </motion.div>
    </div>
  );
}
