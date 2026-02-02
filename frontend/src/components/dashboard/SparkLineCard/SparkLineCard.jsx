import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import { hexToRgba } from '../../../utils/color';
import { formatValue } from '../../../utils/formatValue';
import { useSparkLineHighlight } from '../../../hooks/useSparkLineHighlight';


export default function SparkLineCard({
  data = [],
  labels = [],
  title = '',
  lineColor = '#841a1c',
  valueType = 'number',
}) {
  const length = Math.min(data.length, labels.length);

  const { highlightIndex, onKeyDown, onFocus, handleHighlightChange } =
    useSparkLineHighlight(length);

  const areaColor = useMemo(() => hexToRgba(lineColor, 0.5), [lineColor]);
  const borderColor = useMemo(() => hexToRgba(lineColor, 0.3), [lineColor]);

  const displayLabel = highlightIndex !== null ? labels[highlightIndex] : title;
  const displayValue = highlightIndex !== null ? data[highlightIndex] : data[length - 1];
  const formattedValue = useMemo(
    () => formatValue(displayValue, valueType),
    [displayValue, valueType]
  );

  const content =
    length === 0 ? (
      <Typography color="text.secondary">Дані відсутні</Typography>
    ) : (
      <Stack direction="column" width="100%" maxWidth={400}>
        <Typography sx={{ color: '#08273b', fontWeight: 500, fontSize: 18, pt: 1 }}>
          {displayLabel}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ borderBottom: `2px solid ${borderColor}` }}
        >
          <Typography
            aria-live="polite"
            sx={{ fontSize: '2.6rem', fontWeight: 500, color: '#08273b' }}
          >
            {formattedValue}
          </Typography>

          <SparkLineChart
            height={80}
            width={195}
            area
            showHighlight
            data={data}
            baseline="min"
            xAxis={{ id: 'week-axis', data: labels }}
            margin={{ bottom: 0, top: 5, left: 4, right: 0 }}
            series={[{ line: { stroke: lineColor, strokeWidth: 2 }, color: areaColor }]}
            highlightedAxis={
              highlightIndex === null
                ? []
                : [{ axisId: 'week-axis', dataIndex: highlightIndex }]
            }
            onHighlightedAxisChange={handleHighlightChange}
            axisHighlight={{ x: 'line' }}
            clipAreaOffset={{ top: 0, bottom: 0 }}
            slotProps={{ lineHighlight: { r: 4, fill: lineColor } }}
            sx={{
              [`& .${lineElementClasses.root}`]: { stroke: lineColor, strokeWidth: 2 },
              [`& .${areaElementClasses.root}`]: { fill: areaColor },
              [`& .${chartsAxisHighlightClasses.root}`]: { stroke: lineColor, strokeWidth: 2 },
            }}
          />
        </Stack>
      </Stack>
    );

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={title}
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    >
      {content}
    </Box>
  );
}
