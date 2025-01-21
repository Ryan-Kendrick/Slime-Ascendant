type Difficulty = "beginner" | "novice" | "intermediate"

interface AchievementTier {
  difficulty: Difficulty
  modifier: number
}

type AchievementConfig = Record<string, Record<string, Achievement[]>>

const ACHIEVEMENT_TIER_CONFIG: Record<Difficulty, AchievementTier> = {
  beginner: {
    difficulty: "beginner",
    modifier: 0.05,
  },
  novice: {
    difficulty: "novice",
    modifier: 0.1,
  },
  intermediate: {
    difficulty: "intermediate",
    modifier: 0.2,
  },
}

export interface Achievement {
  id: string
  title: string
  description: string
  condition: number
  difficulty: Difficulty
  modifier: number
}

// Feature{} > Achievement[] per category > Achievement{}
export const ACHIEVEMENT_CONFIG: AchievementConfig = {
  zone: {
    count: [
      {
        id: "zone-count.1",
        title: "Geological Genesis",
        description: "Complete 50 zones",
        condition: 50,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-count.2",
        title: "Tectonic Trascendence",
        description: "Complete 250 zones",
        condition: 250,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-count.3",
        title: "Sedimentary Sage",
        description: "Complete 500 zones",
        condition: 500,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-count.4",
        title: "Metamorphic Mastery",
        description: "Complete 1000 zones",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-count.5",
        title: "Supercontinental Serenity",
        description: "Complete 2500 zones",
        condition: 2500,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    progression: [
      {
        id: "zone-progression.1",
        title: "First Steps",
        description: "Complete zone 10",
        condition: 10,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-progression.2",
        title: "The Regions",
        description: "Complete zone 20",
        condition: 20,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-progression.3",
        title: "The Rhythms",
        description: "Complete zone 30",
        condition: 30,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    farm: [
      {
        id: "zone-farm.1",
        title: "Farmhand",
        description: "Complete 10 farm zones",
        condition: 10,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-farm.2",
        title: "Farmer",
        description: "Complete 50 farm zones",
        condition: 50,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-farm.3",
        title: "Agriculturalist",
        description: "Complete 100 farm zones",
        condition: 100,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "zone-farm.4",
        title: "Modern Farmer I: Youtube Thumbnail Artist",
        description: "Complete 250 farm zones",
        condition: 250,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-farm.5",
        title: "Modern Farmer II: Relationship Drama Post by ChatGPT",
        description: "Complete 1000 farm zones",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-farm.6",
        title: "Modern Farmer III: Sleeping Livestream",
        description: "Complete 5000 farm zones",
        condition: 5000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "zone-farm.7",
        title: "Modern Farmer IV: Automated Harvest Hero",
        description: "Complete 10000 farm zones",
        condition: 10000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
      {
        id: "zone-farm.8",
        title: "Modern Farmer V: Eco-Friendly Innovator",
        description: "Complete 15000 farm zones",
        condition: 15000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
      {
        id: "zone-farm.9",
        title: "Modern Farmer VI: ChatGPT Wrote The Last 2 Farming Achievements",
        description: "Complete 20000 farm zones",
        condition: 20000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
  },
  click: {
    value: [
      {
        id: "click-value.1",
        title: "Mousepad Welcome Mat",
        description: "Reach 100 damage per click",
        condition: 100,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-value.2",
        title: "Value Clicking: Macro Button Maestro",
        description: "Reach 500 damage per click",
        condition: 500,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-value.3",
        title: "Extended Mousepad Territory",
        description: "Reach 1000 damage per click",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-value.4",
        title: "Desk-Wide Mousepad Soverignty",
        description: "Reach 5000 damage per click",
        condition: 5000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-value.5",
        title: "12-Button Side Panel Savant",
        description: "Reach 25000 damage per click",
        condition: 25000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-value.6",
        title: "Mousepad RGB Mattress",
        description: "Reach 100000 damage per click",
        condition: 100000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    count: [
      {
        id: "click-count.1",
        title: "Clicker",
        description: "Click monsters 100 times",
        condition: 100,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-count.2",
        title: "Mouse User",
        description: "Click monsters 500 times",
        condition: 500,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-count.3",
        title: "Certified Mouse User",
        description: "Click monsters 1000 times",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-count.4",
        title: "Certificate in Applied Mouse Usership: Full Range-Of-Motion Clicker",
        description: "Click monsters 2500 times",
        condition: 2500,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-count.5",
        title: "Bachelor of Mouse Operations",
        description: "Click monsters 10000 times",
        condition: 10000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-count.6",
        title: "Doctor of Pointer Arithmetic",
        description: "Click monsters 25000 times",
        condition: 25000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    damage: [
      {
        id: "click-damage.1",
        title: "Slime Splattered Mouse",
        description: "Deal 5000 click damage",
        condition: 5000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-damage.2",
        title: "Mouse-based Harm Enthusiast",
        description: "deal 25000 click damage",
        condition: 25000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "click-damage.3",
        title: "Scroll Wheel Slime Keelhauling",
        description: "deal 100000 click damage",
        condition: 100000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-damage.4",
        title: "Drawn Quartered on the Palm Rest",
        description: "deal 500000 click damage",
        condition: 500000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "click-damage.5",
        title: "DPI Disembowelment",
        description: "deal 10000000 click damage",
        condition: 10000000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
  },
  dot: {
    value: [
      {
        id: "dot-value.1",
        title: "TODO",
        description: "Deal 100 Damage Per Second",
        condition: 100,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "dot-value.2",
        title: "TODO",
        description: "Deal 1000 Damage Per Second",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "dot-value.3",
        title: "TODO",
        description: "Deal 10000 Damage Per Second",
        condition: 10000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "dot-value.4",
        title: "TODO",
        description: "Deal 25000 Damage Per Second",
        condition: 25000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "dot-value.5",
        title: "TODO",
        description: "Deal 100000 Damage Per Second",
        condition: 100000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    damage: [
      {
        id: "dot-damage.1",
        title: "TODO",
        description: "Deal 10000 Damage Passively",
        condition: 10000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "dot-damage.2",
        title: "TODO",
        description: "Deal 100000 Damage Passively",
        condition: 100000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "dot-damage.3",
        title: "TODO",
        description: "Deal 1000000 Damage Passively",
        condition: 1000000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "dot-damage.4",
        title: "TODO",
        description: "Deal 10000000 Damage Passively",
        condition: 10000000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "dot-damage.5",
        title: "TODO",
        description: "Deal 100000000 Damage Passively",
        condition: 100000000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
  },
  prestige: {
    count: [
      {
        id: "prestige-count.1",
        title: "Stratigraphy of Rock Bottom",
        description: "Prestige 1 time",
        condition: 1,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "prestige-count.2",
        title: "TODO",
        description: "Prestige 3 times",
        condition: 3,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "prestige-count.3",
        title: "TODO",
        description: "Prestige 10 times",

        condition: 10,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "prestige-count.4",
        title: "TODO",
        description: "Prestige 15 times",
        condition: 15,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "prestige-count.5",
        title: "TODO",
        description: "Prestige 20 times",
        condition: 20,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
    plasmaSpent: [
      {
        id: "prestige-plasmaspent.1",
        title: "Reveries in Autocytoplasm",
        description: "Spend 100 Plasma",
        condition: 100,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "prestige-plasmaspent.2",
        title: "Exquisite Paroxsyms of Progress",
        description: "Spend 1000 Plasma",
        condition: 1000,
        ...ACHIEVEMENT_TIER_CONFIG.beginner,
      },
      {
        id: "prestige-plasmaspent.3",
        title: "TODO",
        description: "Spend 10000 Plasma",
        condition: 10000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "prestige-plasmaspent.4",
        title: "TODO",
        description: "Spend 100000 Plasma",
        condition: 100000,
        ...ACHIEVEMENT_TIER_CONFIG.novice,
      },
      {
        id: "prestige-plasmaspent.5",
        title: "TODO",
        description: "Spend 1000000 Plasma",
        condition: 1000000,
        ...ACHIEVEMENT_TIER_CONFIG.intermediate,
      },
    ],
  },
} as const

export const ACHIEVEMENTS = structuredClone(ACHIEVEMENT_CONFIG)
