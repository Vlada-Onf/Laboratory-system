import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const CategoryCardMenu = ({
  anchorEl, open, handleMenuClick, handleMenuButtonEvents,
  handleMenuClose, handleEdit, handleDelete
}) => (
  <>
    <IconButton
      onClick={handleMenuClick}
      onMouseDown={handleMenuButtonEvents}
      onMouseUp={handleMenuButtonEvents}
      onContextMenu={handleMenuButtonEvents}
      sx={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 0.5,
        width: 32,
        height: 32,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          transform: 'scale(1.1)'
        },
      }}
    >
      <MoreVertIcon fontSize="small" />
    </IconButton>

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleEdit}>Редагувати</MenuItem>
      <MenuItem onClick={handleDelete}>Видалити</MenuItem>
    </Menu>
  </>
);

export default CategoryCardMenu;
