import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { AppColors } from '@theme/colors';

interface TickerEntry {
    key: string;
    timestamp: string;
    priceEurMwh: number;
    costEur: number;
    isCheap: boolean;
    isEmergency: boolean;
}

const TickerCard: React.FC<{ entry: TickerEntry; colors: AppColors }> = ({ entry, colors }) => {
    const ts = new Date(entry.timestamp);
    const label = ts.toLocaleString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const accentColor = entry.isCheap ? colors.cool : entry.isEmergency ? colors.danger : colors.warning;

    return (
        <motion.div
            layout
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <Box sx={{
                p: 1.25,
                borderRadius: 2,
                border: `1px solid ${accentColor}55`,
                bgcolor: `${accentColor}12`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.5,
            }}>
                <Typography sx={{ fontSize: 10, color: colors.textMuted, lineHeight: 1, minWidth: 72 }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: accentColor, lineHeight: 1, flex: 1 }}>
                    {entry.priceEurMwh.toFixed(1)}
                    <Typography component="span" sx={{ fontSize: 10, fontWeight: 400, ml: 0.4 }}>€/MWh</Typography>
                </Typography>
                {entry.isEmergency && (
                    <Typography sx={{ fontSize: 9, fontWeight: 700, color: colors.danger, letterSpacing: 0.5 }}>
                        NOTFALL
                    </Typography>
                )}
                <Typography sx={{ fontSize: 12, color: colors.textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                    {entry.costEur.toFixed(2)} €
                </Typography>
            </Box>
        </motion.div>
    );
};

export default TickerCard;
