const brandPalette = {
  50: '#f3f7fc',
  100: '#e5f0fa',
  200: '#bfdcf8',
  300: '#81bef8',
  400: '#1f91ff',
  500: '#0072e0',
  600: '#0052a1',
  700: '#004180',
  800: '#002f5c',
  900: '#001f3d',
};

export const brandTokens = {
  palette: {
    primary: brandPalette,
    neutral: {
      0: '#FFFFFF',
      50: '#EDEFF2',
      100: '#D2D8E0',
      200: '#B7C1CD',
      300: '#9CA9BA',
      400: '#8192A8',
      500: '#4B6382',
      600: '#445975',
      700: '#3C4F68',
      800: '#34455B',
      900: '#2D3B4E',
    },
  },
  colors: {
    // header & footer
    'header-bg': '{palette.primary.600}',
    'on-header': '{palette.neutral.0}',
    'footer-bg': '{palette.primary.600}',
    'on-footer': '{palette.neutral.0}',
  },
} as const;
