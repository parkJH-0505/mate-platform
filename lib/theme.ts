// MATE Dark Theme - Inspired by Zerobase.ca & Fundra.app
// 다크 모드 기반, 대담한 인터랙션, 모던한 SaaS 스타일

export const theme = {
  name: "MATE Dark Theme",
  version: "2.0.0",

  colors: {
    // Primary - 코랄 레드/오렌지 (Zerobase 스타일)
    primary: {
      main: "#ea492e",
      hover: "#d43d24",
      light: "rgba(234, 73, 46, 0.15)",
      glow: "rgba(234, 73, 46, 0.4)"
    },
    // Secondary - 에메랄드 그린 (Fundra 스타일)
    secondary: {
      main: "#10B981",
      hover: "#059669",
      light: "rgba(16, 185, 129, 0.15)",
      dark: "#064E3B",
      glow: "rgba(16, 185, 129, 0.4)"
    },
    // Accent Colors
    accent: {
      blue: "#116dff",
      blueLight: "rgba(17, 109, 255, 0.15)",
      purple: "#9146FF",
      purpleLight: "rgba(145, 70, 255, 0.15)",
      yellow: "#FFFC00",
      yellowLight: "rgba(255, 252, 0, 0.15)"
    },
    // Background - 다크 모드
    background: {
      primary: "#0A0A0A",
      secondary: "#111111",
      tertiary: "#1A1A1A",
      elevated: "#222222",
      overlay: "rgba(0, 0, 0, 0.8)"
    },
    // Surface - 인터랙티브 요소
    surface: {
      default: "#1A1A1A",
      hover: "#252525",
      active: "#303030",
      disabled: "#151515"
    },
    // Text Colors
    text: {
      primary: "#FFFFFF",
      secondary: "#E5E5E5",
      tertiary: "#A3A3A3",
      muted: "#737373",
      disabled: "#525252"
    },
    // Border Colors
    border: {
      default: "#2A2A2A",
      light: "#3A3A3A",
      focus: "#ea492e",
      subtle: "rgba(255, 255, 255, 0.1)"
    },
    // Status Colors
    status: {
      success: "#10B981",
      successBg: "rgba(16, 185, 129, 0.15)",
      warning: "#F59E0B",
      warningBg: "rgba(245, 158, 11, 0.15)",
      error: "#EF4444",
      errorBg: "rgba(239, 68, 68, 0.15)",
      info: "#3B82F6",
      infoBg: "rgba(59, 130, 246, 0.15)"
    },
    // Alpha/Transparency
    alpha: {
      white5: "rgba(255, 255, 255, 0.05)",
      white10: "rgba(255, 255, 255, 0.1)",
      white20: "rgba(255, 255, 255, 0.2)",
      black50: "rgba(0, 0, 0, 0.5)",
      black65: "rgba(0, 0, 0, 0.65)",
      black80: "rgba(0, 0, 0, 0.8)",
      dark70: "rgba(32, 32, 32, 0.7)"
    },
    // Legacy support (기존 호환성)
    neutral: {
      black: "#000000",
      dark: "#0A0A0A",
      darkGray: "#1A1A1A",
      gray: "#737373",
      lightGray: "#A3A3A3",
      lighter: "#E5E5E5",
      border: "#2A2A2A",
      light: "#1A1A1A",
      white: "#FFFFFF"
    }
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #ea492e 0%, #d43d24 100%)",
    secondary: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    accent: "linear-gradient(135deg, #116dff 0%, #9146FF 100%)",
    dark: "linear-gradient(180deg, #111111 0%, #0A0A0A 100%)",
    radialGlow: "radial-gradient(circle at center, rgba(234, 73, 46, 0.15) 0%, transparent 70%)",
    borderShine: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)"
  },

  typography: {
    fontFamily: {
      primary: '"Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica", Arial, sans-serif',
      mono: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Monaco, Consolas, monospace'
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "40px",
      "5xl": "48px",
      "6xl": "60px",
      "7xl": "72px"
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      none: 1,
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    }
  },

  spacing: {
    0: "0px",
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
    32: "128px"
  },

  borderRadius: {
    none: "0",
    sm: "4px",
    default: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px"
  },

  boxShadow: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
    default: "0 2px 4px rgba(0, 0, 0, 0.5)",
    md: "0 4px 8px rgba(0, 0, 0, 0.5)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.5)",
    xl: "0 16px 32px rgba(0, 0, 0, 0.6)",
    "2xl": "0 24px 48px rgba(0, 0, 0, 0.7)",
    glow: "0 0 20px rgba(234, 73, 46, 0.4)",
    glowSecondary: "0 0 20px rgba(16, 185, 129, 0.4)",
    glowBlue: "0 0 20px rgba(17, 109, 255, 0.4)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.4)",
    card: "0 4px 20px rgba(0, 0, 0, 0.5)",
    elevated: "0 8px 30px rgba(0, 0, 0, 0.6)"
  },

  blur: {
    none: "0",
    sm: "4px",
    default: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px"
  },

  transitions: {
    fast: "all 0.2s ease",
    default: "all 0.4s ease",
    slow: "all 0.6s cubic-bezier(0.37, 0, 0.63, 1)",
    slower: "all 0.8s cubic-bezier(0.37, 0, 0.63, 1)",
    color: "color 0.2s ease",
    opacity: "opacity 0.4s ease",
    transform: "transform 0.4s cubic-bezier(0.37, 0, 0.63, 1)",
    shadow: "box-shadow 0.3s ease",
    bounce: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "all 0.6s cubic-bezier(0.83, 0, 0.17, 1)"
  },

  animation: {
    duration: {
      fast: "200ms",
      default: "400ms",
      slow: "600ms",
      slower: "800ms"
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.83, 0, 0.17, 1)"
    }
  },

  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },

  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    toast: 70,
    tooltip: 80
  }
}

// Theme-based utility CSS classes generator
export const generateThemeClasses = () => {
  const style = document.createElement('style')

  const colorClasses = `
    /* Background Colors */
    .bg-background-primary { background-color: ${theme.colors.background.primary}; }
    .bg-background-secondary { background-color: ${theme.colors.background.secondary}; }
    .bg-background-tertiary { background-color: ${theme.colors.background.tertiary}; }
    .bg-background-elevated { background-color: ${theme.colors.background.elevated}; }

    /* Primary Colors */
    .text-primary { color: ${theme.colors.primary.main}; }
    .bg-primary { background-color: ${theme.colors.primary.main}; }
    .bg-primary-light { background-color: ${theme.colors.primary.light}; }
    .hover\\:bg-primary-hover:hover { background-color: ${theme.colors.primary.hover}; }

    /* Secondary Colors */
    .text-secondary { color: ${theme.colors.secondary.main}; }
    .bg-secondary { background-color: ${theme.colors.secondary.main}; }
    .bg-secondary-light { background-color: ${theme.colors.secondary.light}; }
    .bg-secondary-dark { background-color: ${theme.colors.secondary.dark}; }

    /* Text Colors */
    .text-white { color: ${theme.colors.text.primary}; }
    .text-gray { color: ${theme.colors.text.tertiary}; }
    .text-muted { color: ${theme.colors.text.muted}; }

    /* Neutral Colors (Legacy) */
    .text-neutral-black { color: ${theme.colors.neutral.black}; }
    .bg-neutral-black { background-color: ${theme.colors.neutral.black}; }
    .text-neutral-dark { color: ${theme.colors.neutral.dark}; }
    .bg-neutral-dark { background-color: ${theme.colors.neutral.dark}; }
    .text-neutral-dark-gray { color: ${theme.colors.neutral.darkGray}; }
    .bg-neutral-dark-gray { background-color: ${theme.colors.neutral.darkGray}; }
    .text-neutral-gray { color: ${theme.colors.neutral.gray}; }
    .bg-neutral-gray { background-color: ${theme.colors.neutral.gray}; }
    .text-neutral-light-gray { color: ${theme.colors.neutral.lightGray}; }
    .bg-neutral-light-gray { background-color: ${theme.colors.neutral.lightGray}; }
    .text-neutral-lighter { color: ${theme.colors.neutral.lighter}; }
    .bg-neutral-lighter { background-color: ${theme.colors.neutral.lighter}; }
    .border-neutral-border { border-color: ${theme.colors.neutral.border}; }
    .bg-neutral-light { background-color: ${theme.colors.neutral.light}; }
    .text-neutral-white { color: ${theme.colors.neutral.white}; }
    .bg-neutral-white { background-color: ${theme.colors.neutral.white}; }

    /* Alpha Colors */
    .bg-alpha-white5 { background-color: ${theme.colors.alpha.white5}; }
    .bg-alpha-white10 { background-color: ${theme.colors.alpha.white10}; }
    .bg-alpha-white20 { background-color: ${theme.colors.alpha.white20}; }
    .bg-alpha-black50 { background-color: ${theme.colors.alpha.black50}; }
    .bg-alpha-black65 { background-color: ${theme.colors.alpha.black65}; }
    .bg-alpha-black80 { background-color: ${theme.colors.alpha.black80}; }
    .bg-alpha-dark70 { background-color: ${theme.colors.alpha.dark70}; }

    /* Border Colors */
    .border-default { border-color: ${theme.colors.border.default}; }
    .border-subtle { border-color: ${theme.colors.border.subtle}; }

    /* Surface Colors */
    .bg-surface { background-color: ${theme.colors.surface.default}; }
    .hover\\:bg-surface-hover:hover { background-color: ${theme.colors.surface.hover}; }

    /* Glow Effects */
    .shadow-glow { box-shadow: ${theme.boxShadow.glow}; }
    .shadow-glow-secondary { box-shadow: ${theme.boxShadow.glowSecondary}; }
  `

  style.textContent = colorClasses
  document.head.appendChild(style)
}

// Export commonly used style objects - Premium Digital Style
export const commonStyles = {
  button: {
    primary: `
      bg-gradient-to-r from-primary to-[#ff6b4a] text-white px-6 py-3 rounded-md text-sm font-semibold tracking-wide uppercase
      transition-all duration-300 ease-out
      hover:shadow-[0_0_30px_rgba(234,73,46,0.5),0_0_60px_rgba(234,73,46,0.2)] hover:scale-[1.02]
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-neutral-dark
      active:scale-[0.98]
      border border-primary/30
    `,
    secondary: `
      bg-transparent text-white border border-white/20 px-6 py-3 rounded-md text-sm font-semibold tracking-wide uppercase
      backdrop-blur-sm
      transition-all duration-300 ease-out
      hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
      focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-neutral-dark
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-neutral-light-gray px-6 py-3 rounded-md text-sm font-medium tracking-wide
      transition-all duration-300 ease-out
      hover:text-white hover:bg-white/5
      focus:outline-none
      active:scale-[0.98]
    `
  },

  card: `
    bg-gradient-to-br from-[#151515] to-[#0d0d0d] rounded-lg p-6
    border border-white/[0.08]
    shadow-[0_4px_24px_rgba(0,0,0,0.4)]
    backdrop-blur-sm
    transition-all duration-300 ease-out
  `,

  cardHover: `
    hover:border-white/[0.15]
    hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]
    hover:-translate-y-0.5
  `,

  cardGlass: `
    bg-white/[0.03] backdrop-blur-2xl rounded-lg p-6
    border border-white/[0.08]
    shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
  `,

  cardNeon: `
    bg-gradient-to-br from-[#151515] to-[#0d0d0d] rounded-lg p-6
    border border-primary/20
    shadow-[0_0_30px_rgba(234,73,46,0.1),0_4px_24px_rgba(0,0,0,0.4)]
    transition-all duration-300 ease-out
    hover:border-primary/40 hover:shadow-[0_0_50px_rgba(234,73,46,0.2),0_8px_40px_rgba(0,0,0,0.5)]
  `,

  input: `
    bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm text-white
    placeholder:text-neutral-gray
    focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(234,73,46,0.1)]
    transition-all duration-200 ease-out
    backdrop-blur-sm
  `,

  link: `
    text-primary no-underline transition-all duration-200 ease-out
    hover:text-[#ff6b4a]
  `,

  heading: {
    h1: "text-6xl font-bold leading-[1.1] tracking-[-0.02em] text-white",
    h2: "text-5xl font-bold leading-[1.15] tracking-[-0.02em] text-white",
    h3: "text-4xl font-semibold leading-[1.2] tracking-[-0.01em] text-white",
    h4: "text-2xl font-semibold leading-[1.3] text-white",
    h5: "text-xl font-medium leading-[1.4] text-white",
    body: "text-base font-normal leading-relaxed text-neutral-lighter"
  },

  // 섹션 스타일
  section: `
    py-24 px-6
    bg-[#0a0a0a]
  `,

  sectionAlt: `
    py-24 px-6
    bg-gradient-to-b from-[#0a0a0a] to-[#111111]
  `,

  // 컨테이너
  container: `
    max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  `,

  // Glow 효과
  glowPrimary: `
    shadow-[0_0_30px_rgba(234,73,46,0.3)]
    hover:shadow-[0_0_50px_rgba(234,73,46,0.4)]
  `,

  glowSecondary: `
    shadow-[0_0_30px_rgba(16,185,129,0.3)]
    hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]
  `,

  // 새로운 고급 스타일
  glassMorphism: `
    bg-white/[0.02] backdrop-blur-2xl
    border border-white/[0.05]
    shadow-[0_8px_32px_rgba(0,0,0,0.3)]
  `,

  neonBorder: `
    border border-primary/30
    shadow-[0_0_15px_rgba(234,73,46,0.2),inset_0_0_15px_rgba(234,73,46,0.05)]
  `,

  gradientText: `
    bg-gradient-to-r from-white via-white to-neutral-light-gray bg-clip-text text-transparent
  `,

  subtleGrid: `
    bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
    bg-[size:60px_60px]
  `
}

// Keyframes for animations
export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(234, 73, 46, 0.4);
    }
    50% {
      box-shadow: 0 0 40px rgba(234, 73, 46, 0.6);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`

export default theme
