import React from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ButtonsCell = function(props) {
    const onEdit = props.onEdit;
    const onDelete = props.onDelete;
    const onMoveToNeeds = props.onMoveToNeeds;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            gap={0.25}
        >
            <IconButton
                size="small"
                onClick={onEdit}
            >
                <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
                size="small"
                onClick={onMoveToNeeds}
            >
                <ShoppingCartIcon fontSize="small" />
            </IconButton>

            <IconButton
                size="small"
                onClick={onDelete}
                sx={{ color: '#f16731' }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default ButtonsCell;
