export const expenseCategories = [
  {
    id: "food",
    name: "Food",
    emoji: "🍔",
  },
  {
    id: "travel",
    name: "Travel",
    emoji: "🚕",
  },
  {
    id: "shopping",
    name: "Shopping",
    emoji: "🛍️",
  },
  {
    id: "bills",
    name: "Bills",
    emoji: "💡",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    emoji: "🎬",
  },
  {
    id: "rent",
    name: "Rent",
    emoji: "🏠",
  },
  {
    id: "health",
    name: "Health",
    emoji: "💊",
  },
  {
    id: "other-expense",
    name: "Other",
    emoji: "📦",
  },
];

export const incomeCategories = [
  {
    id: "job",
    name: "Job",
    emoji: "💼",
  },
  {
    id: "freelance",
    name: "Freelance",
    emoji: "💻",
  },
  {
    id: "business",
    name: "Business",
    emoji: "🏢",
  },
  {
    id: "investment",
    name: "Investment",
    emoji: "📈",
  },
  {
    id: "gift",
    name: "Gift",
    emoji: "🎁",
  },
  {
    id: "other-income",
    name: "Other",
    emoji: "💰",
  },
];

// Used by components that need all categories
export const categories = [
  ...expenseCategories,
  ...incomeCategories,
];