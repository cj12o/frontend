/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": ["11px", { lineHeight: "16px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["14px", { lineHeight: "20px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
      },
      spacing: {
        0: "0",
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        2.5: "10px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
      },
      borderRadius: {
        none: "0",
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      colors: {
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#000000",
        red: {
          50: "#FEF2F2",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7F7F8",
          tertiary: "#F0F0F2",
        },
        border: {
          DEFAULT: "rgba(0,0,0,0.08)",
          strong: "rgba(0,0,0,0.14)",
        },
        text: {
          primary: "#1A1A1C",
          secondary: "#5C5C61",
          muted: "#8A8A8F",
          disabled: "#B8B8BC",
        },
        accent: {
          DEFAULT: "#5E6AD2",
          hover: "#4F5BBF",
          subtle: "rgba(94,106,210,0.08)",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        "[&::-webkit-scrollbar]": {
          width: "6px",
        },
        "[&::-webkit-scrollbar-track]": {
          backgroundColor: "transparent",
        },
        "[&::-webkit-scrollbar-thumb]": {
          backgroundColor: "rgba(0,0,0,0.08)",
          borderRadius: "9999px",
        },
      });
    },
  ],
};
