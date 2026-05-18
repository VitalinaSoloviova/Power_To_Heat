import { Box } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface DateChipProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
  colors: any;
}


export const CalendarIcon = ({ size }: { size?: number }) => (
  <CalendarMonthIcon sx={{ opacity: 0.7, fontSize: size ?? 16 }} />
);

const DateChip: React.FC<DateChipProps> = ({ label, onClick, open, colors }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: 40,
      gap: 0.75,
      px: 1.4,
      py: 2.7,
      borderRadius: 1,
      width: 'fit-content',
      border: `1px solid ${colors.border}`,
      bgcolor: open ? colors.bgCard : 'transparent',
      backdropFilter: open ? colors.backdropBlur : 'none',
      WebkitBackdropFilter: open ? colors.backdropBlur : 'none',
      color: colors.textPrimary,
      fontSize: 12,
      transition: 'background 0.2s',
      '&:hover': { bgcolor: colors.bgCard, backdropFilter: colors.backdropBlur },
    }}
  >
      <CalendarIcon size={25} />
    {label}
  </Box>
);

export default DateChip;
