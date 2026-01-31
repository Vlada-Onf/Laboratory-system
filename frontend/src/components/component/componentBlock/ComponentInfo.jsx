import React from 'react';
import { Box, Typography } from '@mui/material';
import TagsList from './TagsList';

const ComponentInfo = function(props) {
    const { description, price, category, tags } = props;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
            <Typography variant="body1" fontSize={18}><strong>Опис:</strong> {description || '—'}</Typography>
            <Typography variant="body1" fontSize={18}><strong>Ціна:</strong> {price ? `${price} ₴` : '—'}</Typography>
            <Typography variant="body1" fontSize={18}><strong>Категорія:</strong> {category || '—'}</Typography>
            <Box>
                <Typography variant="body1" fontSize={18} sx={{ mb: 0.5 }}><strong>Теги:</strong></Typography>
                <TagsList tags={tags} />
            </Box>
        </Box>
    );
};

export default ComponentInfo;
