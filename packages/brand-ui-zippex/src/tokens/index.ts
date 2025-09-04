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
  },
  colors: {
    'header-bg': '{palette.primary.700}',
  },
} as const;
