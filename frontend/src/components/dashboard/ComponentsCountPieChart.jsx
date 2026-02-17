import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesMap } from '../../hooks/useCategoriesMap';
import { useCategoriesStore } from '@store/useCategoriesStore';

const ComponentsCountPieChart = React.memo(function ComponentsCountPieChart() {
  const { components } = useComponentsStore();
  const categoriesMap = useCategoriesMap();
  const { categories } = useCategoriesStore();

  console.log('PieChart:', { 
    componentsCount: components.length, 
    categoriesMapSize: categoriesMap.size,
    categoriesCount: categories.length 
  });

  const categoryCounts = React.useMemo(() => {
    const counts = components.reduce((acc, component) => {
      const categoryId = component.categoryId;
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([categoryId, count], index) => {
        const category = categories.find(cat => cat.id === categoryId);
        const categoryName = categoriesMap.get(categoryId) || 'Без категорії';
        
        return {
          id: index,
          label: categoryName,
          value: count,
          color: category?.cardColor
        };
      })
      .slice(0, 8);
  }, [components, categoriesMap, categories]);

  if (components.length === 0) {
    console.log(' Компоненти завантажуються...');
    return (
      <Box sx={{ /*...*/ }}>
        <Typography color="rgba(255, 255, 255, 0.7)">Завантаження...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PieChart
        width={200}
        height={200}
        series={[
          {
            data: categoryCounts,
            valueFormatter: (datum) => `${datum.value} шт.`,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: {
              innerRadius: 40,
              additionalRadius: -20,
            },
            labelStyle: {
              fontSize: 14,
              fontWeight: 500,
            },
          },
        ]}
        legend={{ visible: false }}
        slotProps={{ legend: { style: { display: 'none' } } }}
      />

      <Stack direction="column" spacing={1}>
        {categoryCounts.map((item) => (
          <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: item.color,
                borderRadius: 0.5,
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
