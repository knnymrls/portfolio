"use client";

import { motion } from "framer-motion";

interface DataSource {
  name: string;
  icon: string;
  description: string;
}

interface DataPipelineDiagramProps {
  sources?: DataSource[];
  processing?: string[];
  output?: string;
}

const defaultSources: DataSource[] = [
  {
    name: "College Scorecard API",
    icon: "🏛️",
    description: "Federal education data",
  },
  {
    name: "Web Scraping",
    icon: "🌐",
    description: "Campus images & content",
  },
  {
    name: "Clearbit API",
    icon: "🎨",
    description: "School logos & branding",
  },
];

const defaultProcessing = ["Extract", "Transform", "AI Processing", "Validate"];

export default function DataPipelineDiagram({
  sources = defaultSources,
  processing = defaultProcessing,
  output = "Unified Database",
}: DataPipelineDiagramProps) {
  return (
    <div className="my-8 rounded-[20px] border border-border bg-surface p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* Data Sources */}
        <div className="flex-1">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-surface-secondary">
            Data Sources
          </div>
          <div className="flex flex-col gap-2">
            {sources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 rounded-[20px] border border-border bg-background p-3"
              >
                <span className="text-xl">{source.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {source.name}
                  </div>
                  <div className="truncate text-xs text-surface-secondary">
                    {source.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow - Desktop */}
        <div className="hidden text-surface-secondary lg:block">→</div>
        {/* Arrow - Mobile */}
        <div className="flex justify-center text-surface-secondary lg:hidden">
          ↓
        </div>

        {/* Processing */}
        <div className="flex-1">
          <div className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-surface-secondary">
            Processing
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-[20px] border border-border bg-background p-4"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {processing.map((step, index) => (
                <span
                  key={step}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Arrow - Desktop */}
        <div className="hidden text-surface-secondary lg:block">→</div>
        {/* Arrow - Mobile */}
        <div className="flex justify-center text-surface-secondary lg:hidden">
          ↓
        </div>

        {/* Output */}
        <div className="flex-1">
          <div className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-surface-secondary lg:text-right">
            Output
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="rounded-[20px] border border-border bg-background p-6 text-center"
          >
            <div className="mb-2 text-2xl">🗄️</div>
            <div className="text-sm font-medium text-foreground">{output}</div>
            <div className="mt-1 text-xs text-surface-secondary">
              Clean, structured, ready to use
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
