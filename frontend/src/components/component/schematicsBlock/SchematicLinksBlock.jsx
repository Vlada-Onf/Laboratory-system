import { useState, useEffect } from 'react';
import {Box,IconButton,Tooltip,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Chip,Link,Paper,CircularProgress} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchematicLinkEditModal from './SchematicLinkEditModal';
import { useSchematicLinksStore } from '@store/useSchematicLinksStore';
import { useAuthStore } from '../../../store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const SchematicLinksBlock = ({ schematic }) => {
  const {
    getLinksForSchematic,
    fetchSchematicLinks,
    isLoadingForSchematic
  } = useSchematicLinksStore();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const { user } = useAuthStore();
  const userRoles = user?.roleId ? [user.roleId, ...(user?.roles || [])] : [];
  const isLabRole = userRoles.includes(LAB_ROLE_ID);
  const showEditButton = !isLabRole;

  const schematicLinks = getLinksForSchematic(schematic?.id) || [];
  const isLoading = isLoadingForSchematic(schematic?.id);

  useEffect(() => {
    if (schematic?.id) {
      console.log('SchematicLinksBlock: Завантажуємо для', schematic.id);
      fetchSchematicLinks(schematic.id);
    }
  }, [schematic?.id, fetchSchematicLinks]);

  console.log('SchematicLinksBlock:', {
    schematicId: schematic?.id,
    linksCount: schematicLinks.length,
    isLoading,
    showEditButton
  });

  const hasUsefulLinks = Array.isArray(schematicLinks) && schematicLinks.length > 0;

  if (isLoading) {
    return (
      <Box sx={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1
      }}>
        <CircularProgress size={24} />
        <Typography variant="body2">Завантаження посилань...</Typography>
      </Box>
    );
  }

  if (!schematic) {
    return (
      <Box sx={{ height: 200, p: 3, color: 'text.secondary', textAlign: 'center' }}>
        <Typography variant="body2">Схема не завантажена</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, pt: 4 }}>
        {hasUsefulLinks ? (
          <Paper elevation={3} sx={{ 
            position: 'relative',
            borderRadius: 3, 
            width: '100%', 
            overflow: 'hidden'
          }}>
            {showEditButton && (
              <Tooltip title="Редагувати корисні посилання">
                <IconButton
                  onClick={() => setEditModalOpen(true)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: 3
                    }
                  }}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader sx={{ '& .MuiTableCell-root': { borderBottom: 'none' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      py: 2.5,
                      px: 4,
                      borderBottom: 'none',
                      backgroundColor: 'transparent'
                    }}>
                      Назва
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      py: 2.5,
                      px: 4,
                      borderBottom: 'none',
                      backgroundColor: 'transparent'
                    }}>
                      Посилання
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schematicLinks.map((link) => (
                    <TableRow
                      key={link.id}
                      hover
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&:last-child td': { border: 0 }
                      }}
                    >
                      <TableCell sx={{
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        py: 2.5,
                        px: 4
                      }}>
                        {link.title}
                      </TableCell>
                      <TableCell sx={{ py: 2.5, px: 4 }}>
                        <Chip
                          component={Link}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          label={
                            link.url.length > 45
                              ? `${link.url.replace(/^https?:\/\//, '').substring(0, 42)}...`
                              : link.url.replace(/^https?:\/\//, '')
                          }
                          size="medium"
                          clickable
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            height: 32,
                            minWidth: 260,
                            '& .MuiChip-label': {
                              paddingLeft: 2,
                              paddingRight: 2
                            },
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: 3
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{
            position: 'relative',
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300'
          }}>
            {showEditButton && (
              <Tooltip title="Додати корисні посилання">
                <IconButton
                  onClick={() => setEditModalOpen(true)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: 3
                    }
                  }}
                >
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}

            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
              {showEditButton ? 'Додайте корисні посилання' : 'Корисних посилань поки немає'}
            </Typography>
            {showEditButton && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.disabled' }}>
                Натисніть кнопку редагування ➜
              </Typography>
            )}
          </Paper>
        )}
      </Box>

      {showEditButton && (
        <SchematicLinkEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          schematicId={schematic.id}
          schematicLinks={schematicLinks}
        />
      )}
    </Box>
  );
};

export default SchematicLinksBlock;
