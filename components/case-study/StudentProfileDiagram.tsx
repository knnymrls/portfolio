"use client";

import { motion } from "framer-motion";

interface DataField {
  name: string;
}

interface ProfileCategory {
  title: string;
  icon: string;
  fields: string[];
}

interface StudentProfileDiagramProps {
  onboardingFields?: DataField[];
  profiles?: ProfileCategory[];
  learnedCategories?: string[];
}

const defaultOnboarding: DataField[] = [
  { name: "Name & Email" },
  { name: "Graduation Year" },
  { name: "Location" },
  { name: "GPA" },
  { name: "SAT/ACT Scores" },
  { name: "Budget" },
  { name: "Household Income" },
  { name: "Areas of Interest" },
  { name: "Preferred Regions" },
];

const defaultProfiles: ProfileCategory[] = [
  {
    title: "Academic Profile",
    icon: "📚",
    fields: [
      "Learning Style",
      "Class Size Pref",
      "Study Habits",
      "Academic Strengths",
      "Course Rigor",
    ],
  },
  {
    title: "Interests Profile",
    icon: "🎯",
    fields: [
      "Extracurriculars",
      "Hobbies",
      "Sports",
      "Arts & Music",
      "Community Service",
    ],
  },
  {
    title: "Career Profile",
    icon: "🚀",
    fields: [
      "Dream Industries",
      "Work Style",
      "Grad School Plans",
      "Entrepreneurship",
      "Career Goals",
    ],
  },
];

const defaultCategories = [
  "Big Public Research",
  "Small Liberal Arts",
  "Mid-Size Private",
  "Technical/STEM",
  "Urban Campus",
  "Rural/Small Town",
];

export default function StudentProfileDiagram({
  onboardingFields = defaultOnboarding,
  profiles = defaultProfiles,
  learnedCategories = defaultCategories,
}: StudentProfileDiagramProps) {
  return (
    <div className="my-8 rounded-[20px] border border-border bg-surface p-6">
      {/* Onboarding Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-surface-secondary">
          Onboarding (Fixed)
        </div>
        <div className="flex flex-wrap gap-2">
          {onboardingFields.map((field, index) => (
            <motion.span
              key={field.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-surface-secondary"
            >
              {field.name}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Progressive Profiles Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-surface-secondary">
          Progressive Profiles (Evolving)
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {profiles.map((profile, profileIndex) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + profileIndex * 0.1 }}
              className="rounded-[20px] border border-border bg-background p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{profile.icon}</span>
                <h5 className="text-sm font-medium text-foreground">
                  {profile.title}
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.fields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-surface-secondary"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learned from Swipes Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="border-t border-border pt-6"
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-surface-secondary">
          Learned from Swipes
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {learnedCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex items-center gap-3 rounded-[20px] border border-border bg-background p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-foreground">
                  {category}
                </div>
              </div>
              {/* Simple bar indicator */}
              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${50 + index * 8}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="h-full rounded-full bg-foreground/30"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
