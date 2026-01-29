import React from 'react';
import { Box, Chip } from '@mui/material';

const TagsCell = function(props) {
    const value = props.value;

    if (!value || value.length === 0) {
        return "—";
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                whiteSpace: 'normal'
            }}
        >
            {value.map(function(tag, index) {
                return (
                    <Chip key={index} label={tag} />
                );
            })}
        </Box>
    );
};

export default TagsCell;
