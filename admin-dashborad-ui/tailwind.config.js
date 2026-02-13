module.exports = {
  content: [
    "./index.html",
    "./app/**/*.{html,ts,tsx,jsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        "muted-foreground": "#6b7280",
        "input-background": "#ffffff",
        input: "#e5e7eb",
        ring: "#3b82f6",
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
}
