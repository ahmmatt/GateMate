/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed": "#1c1b1b",
        "surface-tint": "#b62413",
        "surface-container-high": "#e9e8e7", // updated from blade
        "secondary": "#5f5e5e",
        "inverse-primary": "#ffb4a7",
        "secondary-container": "#e5e2e1",
        "on-primary": "#ffffff",
        "on-tertiary": "#ffffff",
        "inverse-on-surface": "#f2f0f0", // updated
        "outline": "#8f706a",
        "surface-container-low": "#f5f3f3", // updated
        "secondary-fixed": "#e5e2e1",
        "on-surface-variant": "#5b403c",
        "surface-dim": "#dbdad9", // updated
        "on-secondary-container": "#656464",
        "tertiary": "#006579",
        "on-secondary": "#ffffff",
        "surface-variant": "#e4e2e2", // updated
        "on-tertiary-fixed-variant": "#004e5e",
        "on-error-container": "#93000a",
        "secondary-fixed-dim": "#c8c6c5",
        "on-primary-fixed-variant": "#910900",
        "surface-container-lowest": "#ffffff",
        "on-background": "#1b1c1c", // updated
        "inverse-surface": "#303031", // updated
        "outline-variant": "#e3beb8",
        "surface-container": "#efeded", // updated
        "tertiary-fixed": "#b2ebff",
        "on-error": "#ffffff",
        "on-surface": "#1b1c1c", // updated
        "surface-bright": "#fbf9f8", // updated
        "on-primary-container": "#fffbff",
        "surface": "#fbf9f8", // updated
        "error": "#ba1a1a",
        "on-secondary-fixed-variant": "#474646",
        "error-container": "#ffdad6",
        "surface-container-highest": "#e4e2e2", // updated
        "on-primary-fixed": "#400200",
        "primary": "#b22110",
        "primary-container": "#d63b27",
        "on-tertiary-container": "#f9fdff",
        "primary-fixed": "#ffdad4",
        "tertiary-fixed-dim": "#68d4f3",
        "on-tertiary-fixed": "#001f27",
        "tertiary-container": "#007f99",
        "background": "#fbf9f8", // updated
        "primary-fixed-dim": "#ffb4a7",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "sidebar-width": "240px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "24px",
        "page-padding": "24px",
        "max-container": "1200px",
        "gutter": "16px",
        "card-padding": "0.75rem",
        "gap-tight": "1rem",
        "gap-default": "1.25rem",
        "container-padding": "1.5rem",
      },
      fontFamily: {
        "body-sm": ["Inter"],
        "body-md": ["Inter"],
        "label-md": ["Inter"],
        "label-lg": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "h1": ["Inter"],
        "h1-mobile": ["Inter"],
        "h2": ["Inter"],
        "caption": ["Inter"],
        "h3": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "headline-sm": ["Inter"],
      },
      fontSize: {
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "body-lg": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "h1": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "500" }],
        "h1-mobile": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "h2": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "caption": ["11px", { lineHeight: "14px", fontWeight: "400" }],
        "h3": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "headline-sm": ["16px", { lineHeight: "1.4", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
}
