import React from 'react';
import { IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const MoveToNeedsButton = ({ onMoveToNeeds }) => {
    return (
        <IconButton size="small" onClick={onMoveToNeeds}>
            <ShoppingCartIcon fontSize="small" />
        </IconButton>
    );
};

export default MoveToNeedsButton;
