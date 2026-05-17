import { useRef, useEffect, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useColors } from '@theme/useTheme';
import type { SimulationPoint } from '@services/types';
import TickerCard from './TickerCard';

interface Props {
    series: SimulationPoint[];
    currentIndex: number;
}

interface TickerEntry {
    key: string;
    timestamp: string;
    priceEurMwh: number;
    costEur: number;
    isCheap: boolean;
}

function buildEntries(series: SimulationPoint[], upTo: number): TickerEntry[] {
    return series
        .slice(0, upTo + 1)
        .filter((p) => p.energy.generated > 0)
        .map((p, i) => ({
            key: `${p.timestamp}-${i}`,
            timestamp: p.timestamp,
            priceEurMwh: p.energy.price,
            costEur: (p.energy.generated * p.energy.price) / 1_000,
            isCheap: p.energy.price < 60,
        }))
        .reverse(); // newest first
}

// TickerCard extracted to its own file

const SimulationPriceTicker: React.FC<Props> = ({ series, currentIndex }) => {
    const colors = useColors();
    const scrollRef = useRef<HTMLDivElement>(null);

    const entries = buildEntries(series, currentIndex);
    const totalCost = entries.reduce((sum, e) => sum + e.costEur, 0);

    // Auto-scroll to top (newest entry)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [entries.length]);

    return (
        <Box sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 2.5,
            bgcolor: colors.bgCardSolid,
            overflow: 'hidden',
            flex: 1,
            minHeight: { xs: 120, sm: 180 },
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
        }}>
            {/* Label */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', flex: 1 }}>
                    Purchase Log
                </Typography>
                <Typography sx={{ fontSize: 10, color: colors.textMuted }}>
                    ↑ new
                </Typography>
            </Box>

            {/* Vertical ticker — newest on top, scroll down for history */}
            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    px: 1.5,
                    py: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth',
                    flex: 1,
                    minHeight: 0,
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-thumb': { borderRadius: 2, bgcolor: `${colors.border}` },
                }}
            >
                {entries.length === 0 ? (
                    <Typography sx={{ fontSize: 11, color: colors.textMuted, px: 1 }}>
                        No purchases yet…
                    </Typography>
                ) : (
                    <AnimatePresence initial={false} mode="popLayout">
                        {entries.map((entry) => (
                            <TickerCard key={entry.key} entry={entry} colors={colors} />
                        ))}
                    </AnimatePresence>
                )}
            </Box>

            {/* Total */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                minHeight: 40,
                borderTop: `1px solid ${colors.border}`,
                bgcolor: `${colors.primary}0d`,
            }}>
                <Typography sx={{ fontSize: 11, color: colors.textSecondary }}>
                    Total Cost
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.primary }}>
                    {totalCost.toFixed(2)} €
                </Typography>
            </Box>
        </Box>
    );
};

export default memo(SimulationPriceTicker);
