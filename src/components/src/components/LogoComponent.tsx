import { LocalFireDepartmentRounded } from "@mui/icons-material"
import { Box } from "@mui/material"
import { colors } from './theme/colors';

export const LogoComponent = () => {
  return (
    <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(135deg, ${colors.primary}, #8b5cf6)`,
          mb: 2,
          boxShadow: `0 8px 24px ${colors.primaryGlow}`,
        }}
      >
        <LocalFireDepartmentRounded sx={{ color: '#fff', fontSize: 22 }} />
      </Box>)
}

export default LogoComponent;