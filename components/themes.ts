export type Theme = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  ghost: string;
  accent: string;
};

export const lightTheme: Theme = {
  bg: '#F3EDE2',
  surface: '#FBF8F2',
  ink: '#1C1A17',
  muted: '#5E574D',
  line: '#DDD3C2',
  ghost: 'rgba(28,26,23,0.045)',
  accent: '#C4391D',
};

export const darkTheme: Theme = {
  bg: '#15140F',
  surface: '#1F1D18',
  ink: '#F1EBDF',
  muted: '#A69E90',
  line: '#35312A',
  ghost: 'rgba(241,235,223,0.05)',
  accent: '#E0643F',
};