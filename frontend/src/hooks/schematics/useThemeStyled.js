import { useTheme } from '@mui/material/styles';

export const useCardTheme = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return {
    isDark,
    cardBg: isDark
      ? 'linear-gradient(135deg, #08273b, #365468)'
      : 'linear-gradient(135deg, #f16731, #f4926c)',
    hoverBg: isDark
      ? 'linear-gradient(135deg, #051926, #20314a)'
      : 'linear-gradient(135deg, #b74e24, #d07f5e)',
    imgFilter: isDark ? 'brightness(0.8)' : 'brightness(0.85)'
  };
};
