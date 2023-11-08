import { ThemeProvider, createTheme } from "@mui/material";
import colors from "./assets/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.background,
    },
    primary: {
      main: colors.logo
    },
    secondary: {
      main: colors.darkBlue
    },

  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        style: {
          textTransform: "none",
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: window.screen.width > 760 ? "small" : "medium",
      }
    }
  }
})

export const ThemeConfig = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
)