import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '../../context/useTheme';
import WishlistStatusesModal from './WishlistStatusesModal';
import WishlistImportancesModal from './WishlistImportancesModal';
import NeedStatusesModal from './NeedStatusesModal';
import NeedImportancesModal from './NeedImportancesModal';
import DamagedComponentReasonsModal from './DamagedComponentReasonsModal';
import EntitiesModal from './EntitiesModal';
import ActionsModal from './ActionsModal';
import RolesModal from './RolesModal';

const StyledButton = React.memo(({ onClick, children, sx }) => {
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDarkMode || false;
  const textColor = isDarkMode ? '#ffffff' : '#051926';

  return (
    <Button
      onClick={onClick}
      variant="outlined"
      fullWidth
      sx={{
        fontSize: 16,
        height: 58,
        color: textColor,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#08273b',
        ...sx,
        '&:hover': {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10,14,57,0.08)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#051926',
          color: isDarkMode ? 'rgba(255, 255, 255, 1)' : '#051926',
        },
      }}
    >
      {children}
    </Button>
  );
});

const SettingsLayout = ({ children }) => {
  const [statusesModalOpen, setStatusesModalOpen] = useState(false);
  const [importancesModalOpen, setImportancesModalOpen] = useState(false);
  const [needStatusesModalOpen, setNeedStatusesModalOpen] = useState(false);
  const [needImportancesModalOpen, setNeedImportancesModalOpen] = useState(false);
  const [damagedReasonsModalOpen, setDamagedReasonsModalOpen] = useState(false);
  
const [entitiesModalOpen, setEntitiesModalOpen] = useState(false);
const [actionsModalOpen, setActionsModalOpen] = useState(false);

const [rolesModalOpen, setRolesModalOpen] = useState(false);
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1400, 
      mx: 'auto', 
      p: { xs: 1, md: 3 },
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        sx={{ mb: 6, fontWeight: 600, textAlign: 'center' }}
      >
        Налаштування системи
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, fontSize: 20}}>
            Список бажаного
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledButton onClick={() => setStatusesModalOpen(true)}>
              Статуси
            </StyledButton>
            <StyledButton onClick={() => setImportancesModalOpen(true)}>
              Рівні важливості
            </StyledButton>
          </Box>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, fontSize: 20 }}>
            Потреби
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledButton onClick={() => setNeedStatusesModalOpen(true)}>
              Статуси
            </StyledButton>
            <StyledButton onClick={() => setNeedImportancesModalOpen(true)}>
              Рівні важливості
            </StyledButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 , fontSize: 20}}>
            Зламані компоненти
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledButton onClick={() => setDamagedReasonsModalOpen(true)}>
              Причини браку
            </StyledButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 , fontSize: 20}}>
            Сутності та дії над ними
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledButton onClick={() => setEntitiesModalOpen(true)}>
              Сутності
            </StyledButton>
            <StyledButton onClick={() => setActionsModalOpen(true)}>
              Дії
            </StyledButton>
          </Box>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 , fontSize: 20}}>
            Ролі
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledButton onClick={() => setRolesModalOpen(true)}>
              Список ролей
            </StyledButton>
          </Box>
        </Box>

        {children}
      </Box>

      <WishlistStatusesModal 
        open={statusesModalOpen}
        onClose={() => setStatusesModalOpen(false)}
      />
      <WishlistImportancesModal 
        open={importancesModalOpen}
        onClose={() => setImportancesModalOpen(false)}
      />
      <NeedStatusesModal 
        open={needStatusesModalOpen} 
        onClose={() => setNeedStatusesModalOpen(false)} 
      />
      <NeedImportancesModal 
        open={needImportancesModalOpen} 
        onClose={() => setNeedImportancesModalOpen(false)} 
      />
      <DamagedComponentReasonsModal 
        open={damagedReasonsModalOpen}
        onClose={() => setDamagedReasonsModalOpen(false)}
      />
      <EntitiesModal 
  open={entitiesModalOpen}
  onClose={() => setEntitiesModalOpen(false)}
/>
 <ActionsModal 
  open={actionsModalOpen}
  onClose={() => setActionsModalOpen(false)}
/>     
      <RolesModal open={rolesModalOpen} onClose={() => setRolesModalOpen(false)} />
    </Box>
  );
};

export default SettingsLayout;
