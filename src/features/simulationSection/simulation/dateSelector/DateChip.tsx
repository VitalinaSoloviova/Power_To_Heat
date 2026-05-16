import { Box } from '@mui/material';

interface DateChipProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
  colors: any;
}


const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
    <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DateChip: React.FC<DateChipProps> = ({ label, onClick, open, colors }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1.4,
      py: 0.5,
      borderRadius: 2,
      border: `1px solid ${colors.border}`,
      bgcolor: open ? colors.bgCardSolid : 'transparent',
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background 0.15s',
      '&:hover': { bgcolor: colors.bgCardSolid },
    }}
  >
    <CalendarIcon />
    {label}
  </Box>
);

export default DateChip;
