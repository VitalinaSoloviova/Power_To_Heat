import { useCallback, useRef, useState } from 'react';
import { Box, Typography, Slider, Switch, TextField, Divider, Button, Autocomplete, CircularProgress } from '@mui/material';
import { RestartAltRounded, SaveRounded } from '@mui/icons-material';
import { useColors } from '@theme/useTheme';
import { getGlassSx, getSectionLabelSx } from '@theme/colors';
import { tx, fw, radii, duration } from '@theme/tokens';
import { useSettings } from './useSettings';
import { DEFAULT_SETTINGS, type AppSettings } from './settingsTypes';

// ── Section card ──────────────────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const colors = useColors();
  return (
    <Box sx={{ ...getGlassSx(colors), p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      <Typography sx={{ ...getSectionLabelSx(colors), pb: 0.5, borderBottom: `1px solid ${colors.border}` }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

// ── Field row ─────────────────────────────────────────────────────────────────

const FieldRow: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => {
  const colors = useColors();
  return (
    <Box>
      <Typography sx={{ fontSize: tx.sm, fontWeight: fw.medium, color: colors.textSecondary, mb: 0.5 }}>
        {label}
      </Typography>
      {children}
      {hint && <Typography sx={{ fontSize: tx.xs, color: colors.textMuted, mt: 0.4 }}>{hint}</Typography>}
    </Box>
  );
};

// ── Slider row ────────────────────────────────────────────────────────────────

const SliderRow: React.FC<{
  label: string; value: number; min: number; max: number; step?: number;
  unit: string; hint?: string; onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 1, unit, hint, onChange }) => {
  const colors = useColors();
  return (
    <FieldRow label={label} hint={hint}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={value} min={min} max={max} step={step}
          onChange={(_, v) => onChange(v as number)}
          sx={{
            flex: 1, color: colors.primary,
            '& .MuiSlider-thumb': { width: 14, height: 14 },
            '& .MuiSlider-rail': { opacity: 0.3 },
          }}
        />
        <Typography sx={{ fontSize: tx.base, fontWeight: fw.bold, color: colors.textPrimary, minWidth: 56, textAlign: 'right' }}>
          {value} {unit}
        </Typography>
      </Box>
    </FieldRow>
  );
};

// ── Toggle row ────────────────────────────────────────────────────────────────

const ToggleRow: React.FC<{ label: string; value: boolean; hint?: string; onChange: (v: boolean) => void }> = ({ label, value, hint, onChange }) => {
  const colors = useColors();
  return (
    <FieldRow label={label} hint={hint}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Switch
          checked={value} onChange={(e) => onChange(e.target.checked)} size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: colors.primary },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: colors.primary },
          }}
        />
        <Typography sx={{ fontSize: tx.sm, color: value ? colors.primary : colors.textMuted, fontWeight: fw.medium }}>
          {value ? 'On' : 'Off'}
        </Typography>
      </Box>
    </FieldRow>
  );
};

// ── Text field ────────────────────────────────────────────────────────────────

const TextRow: React.FC<{ label: string; value: string | number; type?: 'text' | 'number'; hint?: string; onChange: (v: string) => void }> = ({ label, value, type = 'text', hint, onChange }) => {
  const colors = useColors();
  return (
    <FieldRow label={label} hint={hint}>
      <TextField
        value={value} type={type} size="small" variant="outlined"
        onChange={(e) => onChange(e.target.value)}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            fontSize: tx.base, color: colors.textPrimary,
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: colors.primary },
            '&.Mui-focused fieldset': { borderColor: colors.primary },
          },
          '& .MuiInputBase-input': { py: 0.8, px: 1.2 },
        }}
      />
    </FieldRow>
  );
};

// ── Horizontal zone bar ───────────────────────────────────────────────────────

const ZoneBar: React.FC<{
  critical: number; nearCritical: number; halfCapacity: number; maxCharge: number;
}> = ({ critical, nearCritical, halfCapacity, maxCharge }) => {
  const colors = useColors();

  // Zones from left (0 %) to right (100 %)
  const zones = [
    { from: 0,            to: critical,     color: colors.danger,  label: `0 – ${critical} %`,                   description: 'Charge immediately — regardless of price' },
    { from: critical,     to: nearCritical, color: colors.warning, label: `${critical} – ${nearCritical} %`,     description: 'Charge if price is below average' },
    { from: nearCritical, to: halfCapacity, color: colors.energy,  label: `${nearCritical} – ${halfCapacity} %`, description: 'Charge if price is very cheap (bottom 10 %)' },
    { from: halfCapacity, to: maxCharge,    color: colors.primary, label: `${halfCapacity} – ${maxCharge} %`,    description: 'Charge only at negative prices (surplus energy)' },
    { from: maxCharge,    to: 100,          color: colors.border,  label: `> ${maxCharge} %`,                    description: 'Full — no charging' },
  ];

  // Boundary positions for dashed divider lines (skip 0 and 100)
  const dividers = [critical, nearCritical, halfCapacity, maxCharge];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Bar with dashed dividers */}
      <Box sx={{ position: 'relative', height: 22, mx: '4px' }}>
        {/* Colored zones — clipped inside the bar */}
        <Box sx={{ display: 'flex', height: '100%', borderRadius: radii.sm, overflow: 'hidden', border: `1px solid ${colors.borderStrong}` }}>
          {zones.map((z) => (
            <Box
              key={z.from}
              sx={{
                width: `${z.to - z.from}%`,
                bgcolor: z.color,
                opacity: z.color === colors.border ? 0.18 : 0.75,
                transition: `width ${duration.slow}`,
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
        {/* Dashed vertical dividers — protrude 4 px beyond bar top and bottom */}
        {dividers.map((pct) => (
          <Box
            key={pct}
            sx={{
              position: 'absolute', top: -4, bottom: -4,
              left: `${pct}%`,
              width: 0,
              borderLeft: `2px dashed ${colors.textSecondary}`,
              opacity: 0.85,
              transition: `left ${duration.slow}`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </Box>

      {/* Legend — same color, no extra opacity so it matches the bar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        {zones.slice(0, -1).map((z) => (
          <Box key={z.from} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: z.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: tx.xs, fontWeight: fw.bold, color: z.color, minWidth: 72 }}>
              {z.label}
            </Typography>
            <Typography sx={{ fontSize: tx.xs, color: colors.textSecondary }}>
              {z.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ── kWh info row ──────────────────────────────────────────────────────────────

const KwhRow: React.FC<{ label: string; kwh: number; color?: string }> = ({ label, kwh, color }) => {
  const colors = useColors();
  const mwh = (kwh / 1000).toFixed(0);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary }}>{label}</Typography>
      <Box sx={{ textAlign: 'right' }}>
        <Typography component="span" sx={{ fontSize: tx.sm, fontWeight: fw.bold, color: color ?? colors.textPrimary }}>
          {Number(kwh).toLocaleString('en-US')} kWh
        </Typography>
        <Typography component="span" sx={{ fontSize: tx.xs, color: colors.textMuted, ml: 0.5 }}>
          ({mwh} MWh)
        </Typography>
      </Box>
    </Box>
  );
};

// ── City autocomplete ─────────────────────────────────────────────────────────

interface CityOption {
  displayName: string;
  cityName: string;
  postalCode: string;
  lat: number;
  lon: number;
  population?: number;
}

interface OpenPlzLocality {
  name: string;
  postalCode: string;
  municipality: { name: string };
}

interface NominatimGeoResult {
  lat: string;
  lon: string;
  extratags?: { population?: string };
}

async function geocode(cityName: string, postalCode: string): Promise<{ lat: number; lon: number; population?: number } | null> {
  try {
    const headers = { 'Accept-Language': 'de', 'User-Agent': 'Power2Heat-Dashboard/1.0' };
    const [geoRes, popRes] = await Promise.all([
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${postalCode} ${cityName}`)}&format=json&countrycodes=de&limit=1`, { headers }),
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&countrycodes=de&extratags=1&limit=1`, { headers }),
    ]);
    const [geoData, popData]: [NominatimGeoResult[], NominatimGeoResult[]] = await Promise.all([geoRes.json(), popRes.json()]);
    if (!geoData[0]) return null;
    const population = popData[0]?.extratags?.population ? parseInt(popData[0].extratags.population, 10) : undefined;
    return { lat: parseFloat(geoData[0].lat), lon: parseFloat(geoData[0].lon), population };
  } catch { return null; }
}

const CityAutocomplete: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onSelect: (opt: CityOption) => void;
}> = ({ value, onChange, onSelect }) => {
  const colors = useColors();
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((query: string) => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) { setOptions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://openplzapi.org/de/Localities?name=${encodeURIComponent(query)}*&page=1&pageSize=20`,
        );
        const data: OpenPlzLocality[] = await res.json();
        const seen = new Set<string>();
        const opts: CityOption[] = data
          .filter((d) => {
            if (seen.has(d.name)) return false;
            seen.add(d.name);
            return true;
          })
          .map((d) => ({
            displayName: `${d.name} (${d.postalCode})`,
            cityName: d.name,
            postalCode: d.postalCode,
            lat: 0,
            lon: 0,
          }));
        setOptions(opts);
      } catch { /* network error — silently ignore */ }
      finally { setLoading(false); }
    }, 350);
  }, []);

  const handleSelect = useCallback(async (opt: CityOption) => {
    const coords = await geocode(opt.cityName, opt.postalCode);
    onSelect({ ...opt, lat: coords?.lat ?? opt.lat, lon: coords?.lon ?? opt.lon, population: coords?.population });
  }, [onSelect]);

  const fieldSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      fontSize: tx.base, color: colors.textPrimary,
      '& fieldset': { borderColor: colors.border },
      '&:hover fieldset': { borderColor: colors.primary },
      '&.Mui-focused fieldset': { borderColor: colors.primary },
    },
    '& .MuiInputBase-input': { py: 0.8, px: 1.2 },
  };

  return (
    <FieldRow label="City name">
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        filterOptions={(x) => x}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.cityName)}
        inputValue={value}
        onInputChange={(_, newVal) => { onChange(newVal); search(newVal); }}
        onChange={(_, selected) => { if (selected && typeof selected !== 'string') void handleSelect(selected); }}
        renderOption={(props, opt) => (
          <li {...props} key={opt.displayName}>
            <Box>
              <Typography sx={{ fontSize: tx.sm, color: colors.textPrimary, fontWeight: fw.medium }}>
                {opt.cityName}{opt.postalCode ? ` (${opt.postalCode})` : ''}
              </Typography>
              <Typography sx={{ fontSize: tx.xs, color: colors.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 340 }}>
                {opt.displayName}
              </Typography>
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            variant="outlined"
            sx={fieldSx}
            slotProps={{
              ...params.slotProps,
              input: {
                ...(params.slotProps?.input as object),
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={14} sx={{ color: colors.primary, mr: 0.5 }} />}
                    {(params.slotProps?.input as { endAdornment?: React.ReactNode })?.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </FieldRow>
  );
};

// ── Residents row ─────────────────────────────────────────────────────────────

const ResidentsRow: React.FC<{
  cityPopulation: number;
  residents: number;
  onChange: (v: number) => void;
}> = ({ cityPopulation, residents, onChange }) => {
  const colors = useColors();
  const base = (isFinite(cityPopulation) && cityPopulation > 0) ? cityPopulation
             : (isFinite(residents) && residents > 0) ? residents : 55_000;
  const rawPct = isFinite(residents) && base > 0 ? Math.round((residents / base - 1) * 100) : 0;
  const pct = Math.max(-50, Math.min(50, rawPct));

  const fillColor = pct >= 0 ? colors.primary : colors.warning;
  // Fill bar: range is -50..+50 = 100 units → each unit = 1% of track
  const fillLeft  = pct >= 0 ? '50%' : `${pct + 50}%`;
  const fillWidth = `${Math.abs(pct)}%`;

  return (
    <FieldRow label="Residents" hint="Affects heat demand calculation">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Wrapper for slider + custom center-fill */}
        <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Slider
            track={false}
            value={pct} min={-50} max={50} step={1}
            onChange={(_, v) => onChange(Math.max(1, Math.round(base * (1 + (v as number) / 100))))}
            sx={{
              width: '100%',
              color: fillColor,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: fillColor, transition: `background-color ${duration.slow}` },
              '& .MuiSlider-rail': { opacity: 0.25, bgcolor: colors.textMuted },
            }}
          />
          {/* Center marker line */}
          <Box sx={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 2, height: 12,
            bgcolor: colors.textMuted, opacity: 0.5,
            borderRadius: 1, pointerEvents: 'none',
          }} />
          {/* Fill from center to thumb */}
          {pct !== 0 && (
            <Box sx={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              left: fillLeft, width: fillWidth, height: 4,
              bgcolor: fillColor, opacity: 0.7, borderRadius: 1,
              transition: `left ${duration.slow}, width ${duration.slow}, background-color ${duration.slow}`,
              pointerEvents: 'none',
            }} />
          )}
        </Box>
        <Typography sx={{ fontSize: tx.base, fontWeight: fw.bold, color: fillColor, minWidth: 44, textAlign: 'right', transition: `color ${duration.slow}` }}>
          {pct > 0 ? '+' : ''}{pct} %
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography sx={{ fontSize: tx.xs, color: colors.textMuted }}>
          City population: {base.toLocaleString('en-US')}
        </Typography>
        <Typography sx={{ fontSize: tx.xs, color: fillColor, fontWeight: fw.medium, transition: `color ${duration.slow}` }}>
          {residents.toLocaleString('en-US')} residents
        </Typography>
      </Box>
    </FieldRow>
  );
};

// ── Main settings page ─────────────────────────────────────────────────────────

const SettingsPage: React.FC = () => {
  const colors = useColors();
  const { settings, update, reset } = useSettings();

  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  const set = useCallback((patch: Partial<AppSettings>) => {
    setSaved(false);
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSave = () => {
    update(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    reset();
    setDraft(DEFAULT_SETTINGS);
    setSaved(false);
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(settings);

  // Derived storage values from draft (so sliders reflect live changes)
  const outputCapacity = draft.storageCapacityMwh * 1_000 * 0.9;
  const maxStored      = outputCapacity * (draft.maxChargePercent / 100);
  const criticalKwh    = outputCapacity * (draft.criticalThresholdPct / 100);
  const nearCritKwh    = outputCapacity * (draft.nearCriticalThresholdPct / 100);
  const halfCapKwh     = outputCapacity * (draft.halfCapacityThresholdPct / 100);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflowY: 'auto' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: tx.xl, fontWeight: fw.bold, color: colors.textPrimary, flex: 1 }}>
          Settings
        </Typography>
        {isDirty && (
          <Typography sx={{ fontSize: tx.sm, color: colors.textMuted, fontStyle: 'italic' }}>
            Unsaved changes
          </Typography>
        )}
        {saved && (
          <Typography sx={{ fontSize: tx.sm, color: colors.energy, fontWeight: fw.medium }}>
            Saved ✓
          </Typography>
        )}
        <Button
          size="small" variant="outlined" startIcon={<RestartAltRounded />} onClick={handleReset}
          sx={{ fontSize: tx.sm, borderRadius: radii.md, borderColor: colors.border, color: colors.textMuted, '&:hover': { borderColor: colors.primary, color: colors.primary } }}
        >
          Reset
        </Button>
        <Button
          size="small" variant="contained" startIcon={<SaveRounded />} onClick={handleSave}
          disabled={!isDirty}
          sx={{ fontSize: tx.sm, borderRadius: radii.md, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primary, opacity: 0.85 }, '&.Mui-disabled': { opacity: 0.4 } }}
        >
          Save
        </Button>
      </Box>

      {/* 2-column layout */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* ── Left column: City + Storage ───────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 1 320px', minWidth: 280 }}>

          {/* City */}
          <SectionCard title="City Options">
            <CityAutocomplete
              value={draft.cityName}
              onChange={(v) => set({ cityName: v })}
              onSelect={(opt) => set({ cityName: opt.cityName, postalCode: opt.postalCode, cityLat: opt.lat, cityLon: opt.lon, ...(opt.population && { cityPopulation: opt.population, residents: opt.population }) })}
            />
            <TextRow label="Postal code" value={draft.postalCode} onChange={(v) => set({ postalCode: v })} />
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextRow label="Latitude" value={draft.cityLat} type="number"
                onChange={(v) => set({ cityLat: parseFloat(v) || draft.cityLat })} />
              <TextRow label="Longitude" value={draft.cityLon} type="number"
                onChange={(v) => set({ cityLon: parseFloat(v) || draft.cityLon })} />
            </Box>
          </SectionCard>

          {/* Storage */}
          <SectionCard title="Storage">
            <SliderRow label="Total input capacity" value={draft.storageCapacityMwh}
              min={500} max={5000} step={100} unit="MWh"
              onChange={(v) => set({ storageCapacityMwh: v })} />
            <SliderRow label="Max charge level" value={draft.maxChargePercent}
              min={50} max={100} unit="%"
              onChange={(v) => set({ maxChargePercent: v })} />
            <ResidentsRow
              cityPopulation={draft.cityPopulation}
              residents={draft.residents}
              onChange={(residents) => set({ residents })}
            />

            <Divider sx={{ borderColor: colors.border }} />

            {/* Derived kWh values */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography sx={{ fontSize: tx.xs, color: colors.textMuted, mb: 0.25 }}>
                Calculated values (90 % round-trip efficiency)
              </Typography>
              <KwhRow label="Usable capacity" kwh={outputCapacity} color={colors.primary} />
              <KwhRow label="Max stored"      kwh={maxStored}       color={colors.cool} />
              <KwhRow label={`Critical level (${draft.criticalThresholdPct} %)`} kwh={criticalKwh} color={colors.danger} />
            </Box>
          </SectionCard>
        </Box>

        {/* ── Right column: Charging Options ────────────────── */}
        <Box sx={{ flex: '1 1 380px', minWidth: 320, display: 'flex', flexDirection: 'column' }}>
          <SectionCard title="Charging Options">
            <SliderRow label="Price history" value={draft.priceHistoryDays}
              min={7} max={365} unit="days"
              hint="Days of past prices used to compute cheap/expensive thresholds"
              onChange={(v) => set({ priceHistoryDays: v })} />

            <Divider sx={{ borderColor: colors.border }} />

            <ToggleRow label="Emergency buy" value={draft.emergencyBuyEnabled}
              hint="When off, no emergency purchases are made even if storage runs dry"
              onChange={(v) => set({ emergencyBuyEnabled: v })} />

            <Divider sx={{ borderColor: colors.border }} />

            {/* Threshold sliders */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: tx.sm, fontWeight: fw.medium, color: colors.textSecondary, mb: 0.5 }}>
                Charging thresholds
              </Typography>

              <SliderRow
                label="Critical"
                value={draft.criticalThresholdPct}
                min={5} max={draft.nearCriticalThresholdPct - 1} unit="%"
                hint={`Charge immediately regardless of price (= ${Math.round(criticalKwh).toLocaleString('en-US')} kWh)`}
                onChange={(v) => set({ criticalThresholdPct: v })}
              />
              <SliderRow
                label="Average price threshold"
                value={draft.nearCriticalThresholdPct}
                min={draft.criticalThresholdPct + 1} max={draft.halfCapacityThresholdPct - 1} unit="%"
                hint={`Charge if price is below historical average (= ${Math.round(nearCritKwh).toLocaleString('en-US')} kWh)`}
                onChange={(v) => set({ nearCriticalThresholdPct: v })}
              />
              <SliderRow
                label="Cheap price threshold"
                value={draft.halfCapacityThresholdPct}
                min={draft.nearCriticalThresholdPct + 1} max={draft.maxChargePercent - 5} unit="%"
                hint={`Charge only at very cheap prices (cheapest 10 % historically, = ${Math.round(halfCapKwh).toLocaleString('en-US')} kWh)`}
                onChange={(v) => set({ halfCapacityThresholdPct: v })}
              />
            </Box>

            <Divider sx={{ borderColor: colors.border }} />

            {/* Zone bar */}
            <Box>
              <Typography sx={{ fontSize: tx.sm, fontWeight: fw.medium, color: colors.textSecondary, mb: 1.5 }}>
                Storage zones overview
              </Typography>
              <ZoneBar
                critical={draft.criticalThresholdPct}
                nearCritical={draft.nearCriticalThresholdPct}
                halfCapacity={draft.halfCapacityThresholdPct}
                maxCharge={draft.maxChargePercent}
              />
            </Box>
          </SectionCard>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
