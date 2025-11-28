"use client";

import { motion } from "framer-motion";

interface DataStat {
  value: string;
  label: string;
  icon: string;
  percentage: number; // 0-100 for bar width
  color?: string;
}

interface DataStatsVisualizationProps {
  stats: DataStat[];
  title?: string;
}

const defaultStats: DataStat[] = [
  { value: "6,500+", label: "Schools", icon: "🏫", percentage: 100 },
  { value: "41,000+", label: "Programs", icon: "📚", percentage: 85 },
  { value: "26,000+", label: "Scholarships", icon: "💰", percentage: 65 },
  { value: "20,900+", label: "Deadlines", icon: "📅", percentage: 55 },
  { value: "6,100+", label: "Campus Images", icon: "📸", percentage: 45 },
];

export default function DataStatsVisualization({
  stats = defaultStats,
  title = "What We Built",
}: DataStatsVisualizationProps) {
  return (
    <div className="my-12 py-8 px-6 bg-surface-secondary/5 rounded-2xl border border-border/50">
      {title && (
        <motion.h4
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg font-semibold text-foreground mb-6 text-center"
        >
          {title}
        </motion.h4>
      )}

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl w-8 text-center">{stat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground/80">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold text-foreground tabular-nums">
                    {stat.value}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="ml-12 h-2 bg-surface-secondary/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-project-findu to-project-findu/70 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-xs text-surface-secondary text-center mt-6"
      >
        Data synced daily from multiple sources
      </motion.p>
    </div>
  );
}
