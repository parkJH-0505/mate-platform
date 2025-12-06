// Visible.vc Data Rooms Theme V2 - Dark Mode Premium
// 실제 사이트의 프리미엄 다크 테마를 반영한 고도화된 버전

export const themeV2 = {
  name: "Visible.vc Data Rooms Theme V2",
  version: "2.0.0",
  
  colors: {
    // 다크 모드 기본 색상
    background: {
      primary: "rgb(10, 10, 10)",        // #0a0a0a - 메인 배경
      secondary: "rgb(18, 18, 18)",      // #121212 - 카드 배경
      tertiary: "rgb(26, 26, 26)",       // #1a1a1a - 상승된 배경
      overlay: "rgba(0, 0, 0, 0.8)"      // 오버레이
    },
    
    // 글래스모피즘 효과
    glass: {
      light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.1)",
      heavy: "rgba(255, 255, 255, 0.15)",
      border: "rgba(255, 255, 255, 0.18)"
    },
    
    // 프라이머리 - 네온 블루
    primary: {
      main: "rgb(94, 162, 255)",         // 더 밝은 블루
      bright: "rgb(120, 180, 255)",      // 네온 효과
      dim: "rgb(50, 100, 200)",          // 어두운 버전
      glow: "0 0 40px rgba(94, 162, 255, 0.5)" // 글로우 효과
    },
    
    // 액센트 - 그라데이션
    accent: {
      purple: "rgb(147, 97, 253)",       // 보라색
      pink: "rgb(214, 93, 177)",         // 핑크
      gradient: "linear-gradient(135deg, rgb(147, 97, 253) 0%, rgb(94, 162, 255) 100%)",
      gradientHover: "linear-gradient(135deg, rgb(167, 117, 255) 0%, rgb(114, 182, 255) 100%)"
    },
    
    // 텍스트 색상
    text: {
      primary: "rgb(255, 255, 255)",     // 순백
      secondary: "rgb(200, 200, 200)",   // 밝은 회색
      tertiary: "rgb(150, 150, 150)",    // 중간 회색
      muted: "rgb(100, 100, 100)"        // 어두운 회색
    },
    
    // 시맨틱 색상
    semantic: {
      success: "rgb(76, 206, 148)",
      successGlow: "0 0 20px rgba(76, 206, 148, 0.4)",
      warning: "rgb(251, 191, 36)",
      error: "rgb(239, 68, 68)",
      info: "rgb(59, 130, 246)"
    }
  },
  
  effects: {
    // 블러 효과
    blur: {
      small: "blur(8px)",
      medium: "blur(16px)",
      large: "blur(24px)",
      backdrop: "backdrop-filter: blur(20px) saturate(180%)"
    },
    
    // 그림자 효과 (다크 모드용)
    shadow: {
      sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
      md: "0 4px 20px rgba(0, 0, 0, 0.4)",
      lg: "0 8px 40px rgba(0, 0, 0, 0.5)",
      xl: "0 20px 60px rgba(0, 0, 0, 0.6)",
      glow: "0 0 40px rgba(147, 97, 253, 0.3)",
      inset: "inset 0 2px 4px rgba(0, 0, 0, 0.5)"
    },
    
    // 보더 효과
    border: {
      default: "1px solid rgba(255, 255, 255, 0.1)",
      hover: "1px solid rgba(255, 255, 255, 0.2)",
      gradient: "1px solid transparent",
      gradientImage: "linear-gradient(135deg, rgba(147, 97, 253, 0.5) 0%, rgba(94, 162, 255, 0.5) 100%)"
    }
  },
  
  animation: {
    // 트랜지션
    transition: {
      fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      slow: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    },
    
    // 키프레임 애니메이션
    keyframes: {
      glow: {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.7 }
      },
      float: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-10px)" }
      },
      pulse: {
        "0%": { boxShadow: "0 0 0 0 rgba(147, 97, 253, 0.4)" },
        "70%": { boxShadow: "0 0 0 10px rgba(147, 97, 253, 0)" },
        "100%": { boxShadow: "0 0 0 0 rgba(147, 97, 253, 0)" }
      }
    }
  },
  
  typography: {
    // 더 현대적인 폰트 스택
    fontFamily: {
      display: '"Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace'
    },
    
    // 더 큰 폰트 사이즈
    fontSize: {
      xs: "0.75rem",      // 12px
      sm: "0.875rem",     // 14px
      base: "1rem",       // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "2rem",      // 32px
      "4xl": "2.5rem",    // 40px
      "5xl": "3rem",      // 48px
      "6xl": "3.75rem",   // 60px
      "7xl": "4.5rem",    // 72px
      "8xl": "6rem"       // 96px
    }
  },
  
  layout: {
    // 컨테이너
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
      full: "100%"
    },
    
    // 반경
    radius: {
      none: "0",
      sm: "6px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      "2xl": "32px",
      full: "9999px"
    }
  }
}

// 고도화된 컴포넌트 스타일
export const premiumStyles = {
  // 글래스 카드
  glassCard: `
    relative overflow-hidden
    bg-glass-light backdrop-blur-xl
    border border-glass-border
    rounded-xl
    shadow-xl
    transition-all duration-300 ease-out
    hover:bg-glass-medium
    hover:shadow-2xl hover:shadow-accent-purple/20
    hover:translate-y-[-2px]
    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-br before:from-transparent before:to-transparent
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-300
  `,
  
  // 네온 버튼
  neonButton: {
    primary: `
      relative px-8 py-4 
      bg-gradient-to-r from-accent-purple to-primary-main
      text-white font-semibold
      rounded-lg
      shadow-lg shadow-primary-main/25
      transition-all duration-300 ease-out
      hover:shadow-xl hover:shadow-primary-main/40
      hover:scale-[1.02]
      active:scale-[0.98]
      before:content-[''] before:absolute before:inset-0
      before:bg-gradient-to-r before:from-accent-purple before:to-primary-bright
      before:rounded-lg before:opacity-0 before:transition-opacity
      hover:before:opacity-100
      after:content-[''] after:absolute after:inset-0
      after:rounded-lg after:transition-all after:duration-300
      hover:after:shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]
    `,
    
    ghost: `
      relative px-8 py-4
      bg-transparent
      text-text-primary
      border border-glass-border
      rounded-lg
      transition-all duration-300 ease-out
      hover:bg-glass-light
      hover:border-primary-main/50
      hover:text-primary-bright
      hover:shadow-lg hover:shadow-primary-main/20
      active:scale-[0.98]
    `
  },
  
  // 그라데이션 텍스트
  gradientText: `
    bg-gradient-to-r from-accent-purple to-primary-bright
    bg-clip-text text-transparent
    font-bold
  `,
  
  // 플로팅 요소
  floating: `
    animation-float animation-duration-3s animation-iteration-infinite animation-timing-ease-in-out
  `,
  
  // 글로우 효과
  glowEffect: `
    shadow-[0_0_40px_rgba(147,97,253,0.3)]
    hover:shadow-[0_0_60px_rgba(147,97,253,0.5)]
    transition-shadow duration-300 ease-out
  `
}

// 다크 모드 유틸리티 함수
export const darkModeUtils = {
  // 배경 그라데이션 생성
  createBackgroundGradient: (opacity = 0.1) => `
    background-image: 
      radial-gradient(ellipse at top left, rgba(147, 97, 253, ${opacity}) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(94, 162, 255, ${opacity}) 0%, transparent 50%);
  `,
  
  // 노이즈 텍스처 추가
  addNoiseTexture: () => `
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
      pointer-events: none;
      opacity: 0.03;
    }
  `,
  
  // 그라데이션 보더 생성
  createGradientBorder: () => `
    background: linear-gradient(var(--bg-color, #121212), var(--bg-color, #121212)) padding-box,
                linear-gradient(135deg, rgba(147, 97, 253, 0.5) 0%, rgba(94, 162, 255, 0.5) 100%) border-box;
    border: 1px solid transparent;
  `
}

export default themeV2
