import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinksRow from './LinksRow';
import LinkEditModal from './LinkEditModal';
import { useUsefulLinksStore } from '@store/useUsefulLinksStore';
import { useTheme } from '@mui/material';
import { useAuthStore } from '../../../store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const LinksBlock = ({ component }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId){
      roles.push(user.roleId);
    }
    if (user?.roles && Array.isArray(user.roles)){
      roles.push(...user.roles);
    }
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);

  const { usefulLinks, fetchUsefulLinks, isLoading } = useUsefulLinksStore();
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (component?.id) {
      fetchUsefulLinks(component.id);
    }
  }, [component?.id, fetchUsefulLinks]);

  if (!component || isLoading) {
    return <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Завантаження...</Box>;
  }

  const handleSaveLinks = () => {
    if (isLabRole) {
      console.log('Лаборант не може редагувати посилання');
      setEditModalOpen(false);
      return;
    }
    setEditModalOpen(false);
    fetchUsefulLinks(component.id);
  };

  const docLink = component.documentationLink || component.docLink;
  const buyLink = component.supplierLink || component.buyLink;
  const hasOnlyDocAndShop = docLink || buyLink;
  const hasUsefulLinks = usefulLinks.length > 0;

  const showEditButton = !isLabRole;

  return (
    <Box sx={{
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {showEditButton && (
        <Tooltip title="Редагувати корисні посилання">
          <IconButton
            onClick={() => setEditModalOpen(true)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'primary.main',
              color: 'white',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: isDarkMode ? '2px solid rgba(255,255,255,0.9)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)',
                boxShadow: 4,
                border: isDarkMode ? '1px solid white' : '1px solid transparent',
              },
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, pt: 3 }}>
        {docLink && (
          <LinksRow
            title="Документація:"
            links={[docLink]}
            color="#76bff4"
          />
        )}

        {buyLink && (
          <LinksRow
            title="Магазин:"
            links={[buyLink]}
            color="#5bc522"
          />
        )}

        {hasUsefulLinks && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: 1.5,
            maxHeight: 200,
            overflow: 'auto',
          }}>
            {usefulLinks.map((link) => (
              <LinksRow
                key={link.id}
                title={`${link.title}:`}
                links={[link.url]}
                color="#f16731"
                sx={{
                  flex: '0 0 calc(50% - 12px)',
                  minWidth: 140,
                }}
              />
            ))}
          </Box>
        )}

        {hasOnlyDocAndShop && !hasUsefulLinks && !showEditButton && (
          <Box sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            p: 1.5,
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            Додайте інші корисні посилання (адміністратору)
          </Box>
        )}
        {(!docLink && !buyLink && !hasUsefulLinks) && (
          <Box sx={{ color: 'text.secondary', fontStyle: 'italic', p: 1 }}>
            Додайте корисні посилання
          </Box>
        )}
      </Box>

      {!isLabRole && (
        <LinkEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          componentId={component.id}
          onSave={handleSaveLinks}
          usefulLinks={usefulLinks}
        />
      )}
    </Box>
  );
};

export default LinksBlock;
