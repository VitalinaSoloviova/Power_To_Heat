import { motion } from 'framer-motion';
import { useColors } from '@theme/useTheme';

interface IslandBadgeProps {
  text: string;
  label?: string;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

const IslandBadge: React.FC<IslandBadgeProps> = ({ 
  text, 
  label,
  color, 
  bgColor, 
  icon 
}) => {
  const colors = useColors();

  const defaultColor = color || colors.textPrimary;
  const defaultBgColor = bgColor || colors.bgCardSolid;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: label ? '8px 12px' : '6px 12px',
        borderRadius: 12,
        background: defaultBgColor,
        border: `1px solid ${colors.border}`,
        boxShadow: `
          0 4px 12px rgba(0,0,0,0.15),
          0 2px 4px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        marginTop: 4,
        minWidth: 120,
      }}
    >
      {label && (
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: colors.textPrimary,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 4,
        }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 800,
        color: defaultColor,
        textShadow: `0 1px 2px rgba(0,0,0,0.3)`,
      }}>
        {icon && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: 14,
            color: defaultColor
          }}>
            {icon}
          </div>
        )}
        {text}
      </div>
    </motion.div>
  );
};

export default IslandBadge;