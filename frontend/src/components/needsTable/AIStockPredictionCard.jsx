import React, { useEffect, useState } from 'react';
import {Box, Typography, List, ListItem, ListItemText, Tooltip, CircularProgress, Tabs, Tab, Alert, useTheme } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardCard from '../dashboard/DashboardCard';
import { useComponentsStore } from '@/store/useComponentsStore';

const AiStockPredictionCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    statForecast,
    aiForecast,
    isLoading,
    fetchStatForecast,
    fetchAiForecast
  } = useComponentsStore();

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    console.log('[AiStockPredictionCard] Ініціалізація запитів до API...');
    fetchStatForecast();
    fetchAiForecast();
  }, [fetchStatForecast, fetchAiForecast]);

  useEffect(() => {
    console.log('[Zustand Стор Оновлено]:', {
      'Довжина statForecast (Математика)': statForecast?.length || 0,
      'Довжина aiForecast (ШІ)': aiForecast?.length || 0,
      'Сирі дані statForecast': statForecast,
      'Сирі дані aiForecast': aiForecast
    });
  }, [statForecast, aiForecast]);

  let displayedItems = [];

  if (activeTab === 0) {
    displayedItems = aiForecast.map(aiItem => {
      const statItem = statForecast.find(stat => stat.componentId === aiItem.componentId);

      return {
        id: aiItem.componentId,
        name: aiItem.name,
        currentQuantity: aiItem.currentQuantity ?? statItem?.currentQuantity ?? 0,
        averageDailyUsage: statItem?.averageDailyUsage ?? 0,
        estimatedDaysLeft: aiItem.estimatedDaysLeft ?? statItem?.estimatedDaysLeft ?? 0,
        riskLevel: aiItem.riskLevel || 'High',
        reason: aiItem.reason,
        recommendedAction: aiItem.recommendedAction,
        isAiVerified: true
      };
    });
  } else {
    displayedItems = statForecast.map(statItem => {
      const aiItem = aiForecast.find(ai => ai.componentId === statItem.componentId);

      return {
        id: statItem.componentId,
        name: statItem.name,
        currentQuantity: statItem.currentQuantity,
        averageDailyUsage: statItem.averageDailyUsage,
        estimatedDaysLeft: statItem.estimatedDaysLeft,
        riskLevel: aiItem ? aiItem.riskLevel : statItem.riskLevel,
        reason: null,
        recommendedAction: null,
        isAiVerified: !!aiItem
      };
    });
  }

  const getRiskStyles = (riskLevel, days) => {
    const level = riskLevel?.toLowerCase();
    if (level === 'high' || days <= 7) {
      return {
        bg: isDark ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)',
        color: isDark ? '#ff7961' : '#d32f2f',
        text: 'Критичний ризик дефіциту',
      };
    }
    if (level === 'medium' || (days > 7 && days <= 21)) {
      return {
        bg: isDark ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
        color: isDark ? '#ffb74d' : '#f57c00',
        text: 'Середній ризик',
      };
    }
    return {
      bg: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
      color: isDark ? '#81c784' : '#388e3c',
      text: 'Запасів достатньо',
    };
  };

  return (
    <DashboardCard sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoAwesomeIcon sx={{ color: isDark ? '#b388ff' : '#8a2be2', fontSize: 22 }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: 'text.primary' }}>
            Аналітика та ШІ Прогноз запасів
          </Typography>
        </Box>
        <Tooltip title="ШІ аналізує тренди використання, сезонність та затримки, а статистика рахує математичний залишок днів.">
          <ErrorOutlineIcon sx={{ color: 'text.secondary', fontSize: 18, cursor: 'help' }} />
        </Tooltip>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => {
          console.log(`Перемкнуто на вкладку: ${newValue === 0 ? '0 (ШІ)' : '1 (Математика)'}`);
          setActiveTab(newValue);
        }}
        variant="fullWidth"
        sx={{
          mb: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { color: 'text.secondary' },
          '& .Mui-selected': { color: isDark ? '#b388ff !important' : '#8a2be2 !important' },
          '& .MuiTabs-indicator': { backgroundColor: isDark ? '#b388ff' : '#8a2be2' }
        }}
      >
        <Tab icon={<AutoAwesomeIcon sx={{ fontSize: 18 }} />} label="ШІ Ризики" iconPosition="start" sx={{ textTransform: 'none', minHeight: 40 }} />
        <Tab icon={<BarChartIcon sx={{ fontSize: 18 }} />} label="Уся статистика" iconPosition="start" sx={{ textTransform: 'none', minHeight: 40 }} />
      </Tabs>

      {isLoading && displayedItems.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4} gap={1}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">Оновлення прогнозів...</Typography>
        </Box>
      ) : displayedItems.length === 0 ? (
        <Alert severity="success" sx={{ mt: 1 }}>
          {activeTab === 0
            ? 'ШІ не виявив жодних аномалій чи критичних ризиків для обладнання.'
            : 'Немає статистичних даних для розрахунку прогнозів.'}
        </Alert>
      ) : (
        <List disablePadding>
          {displayedItems.map((item, index) => {
            const badge = getRiskStyles(item.riskLevel, item.estimatedDaysLeft);

            return (
              <ListItem
                key={item.id}
                disableGutters
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  py: 2,
                  borderBottom: index !== displayedItems.length - 1
                    ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`
                    : 'none',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1, width: '100%' }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} sx={{ color: 'text.primary' }}>
                        {item.name}
                        {item.isAiVerified && (
                          <Tooltip title="Підтверджено аналізом ШІ">
                            <AutoAwesomeIcon sx={{ color: isDark ? '#b388ff' : '#8a2be2', fontSize: 14 }} />
                          </Tooltip>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" display="flex" gap={1.5} mt={0.5} flexWrap="wrap" sx={{ color: 'text.secondary' }}>
                        <span>Залишок: <strong style={{ color: theme.palette.text.primary }}>{item.currentQuantity} шт.</strong></span>
                        <span>•</span>
                        <span>Розхід: <strong style={{ color: theme.palette.text.primary }}>{item.averageDailyUsage?.toFixed(2)} шт/день</strong></span>
                        <span>•</span>
                        <span>Вистачить на: <strong style={{ color: theme.palette.text.primary }}>~{Math.round(item.estimatedDaysLeft)} дн.</strong></span>
                      </Box>
                    }
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    secondaryTypographyProps={{ fontSize: 12, component: 'span' }}
                  />

                  <Box
                    sx={{
                      bgcolor: badge.bg,
                      color: badge.color,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                    }}
                  >
                    {badge.text}
                  </Box>
                </Box>

                {item.isAiVerified && (item.reason || item.recommendedAction) && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.2,
                      bgcolor: isDark ? 'rgba(179, 136, 255, 0.06)' : 'rgba(138, 43, 226, 0.04)', 
                      borderRadius: 1,
                      borderLeft: `3px solid ${isDark ? '#b388ff' : '#8a2be2'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5
                    }}
                  >
                    {item.reason && (
                      <Typography variant="caption" display="flex" alignItems="top" gap={0.5} sx={{ color: 'text.primary' }}>
                        <strong>Причина ризику:</strong> {item.reason}
                      </Typography>
                    )}
                    {item.recommendedAction && (
                      <Typography variant="caption" display="flex" alignItems="top" gap={0.5} sx={{ color: isDark ? '#b388ff' : 'primary.main', fontWeight: 500 }}>
                        💡 <strong>Рекомендація:</strong> {item.recommendedAction}
                      </Typography>
                    )}
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </DashboardCard>
  );
};

export default AiStockPredictionCard;