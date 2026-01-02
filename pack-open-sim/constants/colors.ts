export const RARITY_COLORS = {
  energy: { light: "#FFD700", dark: "#FFC107" },
  common: { light: "#78909C", dark: "#90A4AE" },
  uncommon: { light: "#4CAF50", dark: "#66BB6A" },
  rare: { light: "#2196F3", dark: "#42A5F5" },
  holoRare: { light: "#9C27B0", dark: "#BA68C8" },
};

// for now used for animations of pack openings, to be finetuned
export const TYPE_COLORS: Record<
  string,
  { primary: string; secondary: string }
> = {
  Grass: { primary: "#7AC74C", secondary: "#5A9A3B" },
  Fire: { primary: "#EE8130", secondary: "#C6611A" },
  Water: { primary: "#6390F0", secondary: "#4A6FC2" },
  Lightning: { primary: "#F7D02C", secondary: "#C9A820" },
  Psychic: { primary: "#F95587", secondary: "#D13A6A" },
  Fighting: { primary: "#C22E28", secondary: "#9C2420" },
  Darkness: { primary: "#705746", secondary: "#4D3B30" },
  Colorless: { primary: "#A8A77A", secondary: "#7A7A5C" },
  default: { primary: "#68A090", secondary: "#4A7A6A" },
};

export const THEME_COLORS = {
  dark: {
    background: "#121316",
    card: "#1E2024",
    border: "#2A2D32",
    textPrimary: "#FFFFFF",
    textSecondary: "#8B8F96",
    textMuted: "#6B7280",
  },
  light: {
    background: "#F3F4F6",
    card: "#FFFFFF",
    border: "#E8E8E8",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
  },
};
