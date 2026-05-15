import { useRef, useEffect, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useColors } from '@theme/useTheme';
import type { SimulationPoint } from '@services/types/SimulationTypes';

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

const TickerCard: React.FC<{ entry: TickerEntry; colors: ReturnType<typeof useColors> }> = ({ entry, colors }) => {
    const ts = new Date(entry.timestamp);
    const label = ts.toLocaleString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

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
                border: `1px solid ${entry.isCheap ? colors.cool : colors.warning}55`,
                bgcolor: entry.isCheap ? `${colors.cool}12` : `${colors.warning}12`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.5,
            }}>
                <Typography sx={{ fontSize: 10, color: colors.textMuted, lineHeight: 1, minWidth: 72 }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: entry.isCheap ? colors.cool : colors.warning, lineHeight: 1, flex: 1 }}>
                    {entry.priceEurMwh.toFixed(1)}
                    <Typography component="span" sx={{ fontSize: 10, fontWeight: 400, ml: 0.4 }}>€/MWh</Typography>
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                    {entry.costEur.toFixed(2)} €
                </Typography>
            </Box>
        </motion.div>
    );
};

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
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
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
