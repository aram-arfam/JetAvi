import { createTheme } from "@mui/material/styles";

// Theme configuration
const theme = createTheme({
  // Color palette configuration
  palette: {
    mode: "dark",
    primary: {
      main: "#EAB308", // yellow-500
      light: "#FDE047", // yellow-300
      dark: "#CA8A04", // yellow-600
      contrastText: "#0a0f24", // Improved contrast for readability
    },
    secondary: {
      main: "#131a38", // Card background
      light: "#1e2645",
      dark: "#0a0f24", // Page background
    },
    background: {
      default: "#0a0f24", // Dark background
      paper: "#131a38", // Card background
    },
    error: {
      main: "#ef4444", // red-500
    },
    warning: {
      main: "#f97316", // orange-500
    },
    success: {
      main: "#22c55e", // green-500
    },
    info: {
      main: "#3b82f6", // blue-500 (slightly brighter for better distinction)
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.4)", // Added for better accessibility
    },
  },

  // Typography configuration
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Base font size for better scaling
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#EAB308",
      letterSpacing: "-0.02em", // Subtle tightening for elegance
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5, // Improved readability
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
  },

  // Component-specific style overrides
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": {
          backgroundColor: "rgba(234, 179, 8, 0.4)", // Slightly more visible selection
          color: "#ffffff",
        },
        "*": {
          "&::-webkit-selection": {
            backgroundColor: "rgba(234, 179, 8, 0.4)",
            color: "#ffffff",
          },
          "&::-moz-selection": {
            backgroundColor: "rgba(234, 179, 8, 0.4)",
            color: "#ffffff",
          },
          scrollbarWidth: "thin", // Subtle scrollbar styling
          scrollbarColor: "rgba(234, 179, 8, 0.3) rgba(255, 255, 255, 0.1)",
        },
        "::-webkit-scrollbar": {
          width: "8px",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(234, 179, 8, 0.3)",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          padding: "8px 16px", // Slightly larger touch target
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)", // Subtler hover effect
            boxShadow: "0 4px 12px rgba(234, 179, 8, 0.2)",
          },
          "&:active": {
            transform: "translateY(0)", // Natural press feedback
          },
        },
        containedPrimary: {
          backgroundColor: "#EAB308",
          color: "#0a0f24",
          "&:hover": {
            backgroundColor: "#FDE047", // Lighter shade for hover
          },
        },
        outlined: {
          borderColor: "rgba(234, 179, 8, 0.5)",
          "&:hover": {
            borderColor: "#EAB308",
            backgroundColor: "rgba(234, 179, 8, 0.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#131a38",
          borderRadius: 12, // Slightly softer corners
          border: "1px solid rgba(255, 255, 255, 0.08)", // More subtle border
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "rgba(234, 179, 8, 0.2)",
            boxShadow: "0 4px 20px rgba(234, 179, 8, 0.1)", // Gentle lift on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.03)", // Softer background
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(234, 179, 8, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#EAB308",
              boxShadow: "0 0 8px rgba(234, 179, 8, 0.2)", // Subtle focus glow
            },
            "& input": {
              "&:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px #131a38 inset",
                WebkitTextFillColor: "#ffffff",
                caretColor: "#EAB308", // Match caret to primary color
                borderRadius: "inherit",
                "&:hover": {
                  WebkitBoxShadow: "0 0 0 100px #131a38 inset",
                },
                "&:focus": {
                  WebkitBoxShadow: "0 0 0 100px #131a38 inset",
                },
              },
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          padding: "12px 16px", // Slightly larger hit area
          transition: "all 0.2s ease-in-out",
          "&.Mui-selected": {
            color: "#EAB308",
            backgroundColor: "rgba(234, 179, 8, 0.05)", // Subtle highlight
          },
          "&:hover": {
            color: "#EAB308",
            backgroundColor: "rgba(234, 179, 8, 0.03)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#EAB308",
          height: "3px", // Slightly thicker for visibility
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1e2645",
          borderRadius: 6,
          fontSize: "0.875rem",
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Subtle shadow
        },
        arrow: {
          color: "#1e2645",
        },
      },
    },
  },

  // Global shape and spacing
  shape: {
    borderRadius: 8, // Consistent rounded corners
  },
  spacing: 8, // Default spacing unit
});

export default theme;
