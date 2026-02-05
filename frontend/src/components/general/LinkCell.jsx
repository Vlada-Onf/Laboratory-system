import React, { useEffect, useState } from 'react';
import { Link, Tooltip, Typography, useTheme } from '@mui/material';

const LinkCell = function(props) {
    const url = props.url;
    const [domain, setDomain] = useState('');
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    useEffect(function() {
        if (!url) {
            return;
        }

        const timer = setTimeout(function() {
            try {
                const parsed = new URL(url);
                setDomain(parsed.hostname);
            } catch (error) {
                console.error('Invalid URL:', error);
                setDomain(url);
            }
        }, 0);

        return function() {
            clearTimeout(timer);
        };
    }, [url]);

    if (!url) {
        return "—";
    }

    return (
        <Tooltip title={url}>
            <Link
                href={url}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                }}
            >
                <img
                    src={"https://www.google.com/s2/favicons?domain=" + url}
                    alt=""
                    width={16}
                    height={16}
                    style={{ borderRadius: 2 }}
                />
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        maxWidth: 180,
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
                    }}
                >
                    {domain}
                </Typography>
            </Link>
        </Tooltip>
    );
};

export default LinkCell;
