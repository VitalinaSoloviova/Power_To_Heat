import { Box, Typography } from '@mui/material';
import { useColors } from '../../../theme/useTheme';

interface HeaderProps {
  historyYears: number;
  periodLabel: string;
}

const Header = ({ historyYears, periodLabel }: HeaderProps) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
        Should we buy electricity now?
      </Typography>
      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
        Compare with last {historyYears} years · {periodLabel}
      </Typography>
    </Box>
  );
};

export default Header;
