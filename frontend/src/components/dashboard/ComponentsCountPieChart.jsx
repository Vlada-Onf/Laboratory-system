import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
import { useCategoriesMap } from '../../hooks/categories/useCategoriesMap';
import { useComponentsCountByCategory } from '../../hooks/dashboard/useComponentsCountByCategory';

const ComponentsCountPieChart = React.memo(() => {
  const categoriesMap = useCategoriesMap();
  const categoryCounts = useComponentsCountByCategory(categoriesMap);

  if (categoryCounts.length === 0) {
    return (
      <Box sx={{
        width: '100%', height: 230,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography color="rgba(255, 255, 255, 0.7)">
          Завантаження даних...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      gap: { xs: 2, sm: 1 }
    }}>
      <PieChart
        width={220}
        height={220}
        series={[{
          data: categoryCounts,
          valueFormatter: (datum) => `${datum.value} шт.`,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 40, additionalRadius: -20 },
          labelStyle: { fontSize: 14, fontWeight: 500 },
        }]}
        legend={{ visible: false }}
        slotProps={{ legend: { style: { display: 'none' } } }}
      />

      <Stack
        direction="column"
        spacing={{ xs: 1.25, sm: 1 }}
        sx={{
          width: { xs: 'auto', sm: 'auto' },
          maxWidth: { xs: '100%', sm: 200 }
        }}
      >
        {categoryCounts.map((item) => (
          <Stack key={item.id} direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: item.color,
                borderRadius: 0.5,
                flexShrink: 0
              }}
            />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {item.label} ({item.value})
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
});

export default ComponentsCountPieChart;
