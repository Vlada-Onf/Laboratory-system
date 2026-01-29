import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ComponentCell from '../../general/ComponentCell';
import LinkCell from './LinkCell';
import TagsCell from './TagsCell';
import ButtonsCell from './actions/ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';

const rows = [
    {
        id: 1,
        image: 'https://cdn.sparkfun.com/assets/9/1/e/4/8/515b4656ce395f8a38000000.png',
        name: 'Arduino Uno',
        category: 'Мікроконтролери',
        description: 'Плата для навчальних та лабораторних робіт',
        docLink: 'https://github.com/',
        quantity: 3,
        price: 350,
        tags: ['max1', 'iot']
    },
    {
        id: 2,
        image: 'https://res.cloudinary.com/rs-designspark-live/image/upload/c_limit,w_829/f_auto/v1/article/ABX00162_01.iso_df61fb99d01f114220cea433ff1fac9e9211de00',
        name: 'Arduino Uno 2',
        category: 'Мікроконтролери',
        description: 'Плата для навчальних та лабораторних робіт',
        docLink: 'https://github.com/',
        quantity: 3,
        price: 350,
        tags: ['arduino +', 'iotdgg']
    },
    {
        id: 3,
        image: 'https://thepihut.com/cdn/shop/products/arduino-uno-rev3-arduino-a000066-30394855981251.jpg?v=1646651899&width=2048',
        name: 'Arduino Uno 3',
        category: 'Мікроконтролери',
        description: 'Плата для навчальних та лабораторних робіт',
        docLink: 'https://github.com/',
        quantity: 3,
        price: 350,
        tags: ['grtb', 'iot']
    },
    {
        id: 4,
        image: 'https://images.prom.ua/6796592125_w1280_h640_6796592125.jpg',
        name: 'Arduino Uno 4',
        category: 'Мікроконтролери',
        description: 'Плата для навчальних та лабораторних робіт',
        docLink: 'https://github.com/',
        quantity: 3,
        price: 350,
        tags: ['arduino', 'iot']
    }
];

const ComponentsTable = function() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const columns = [
        {
            field: 'component',
            headerName: 'Компонент',
            flex: 2,
            minWidth: 250,
            renderCell: function(params) {
                return <ComponentCell image={params.row.image} name={params.row.name} />;
            }
        },
        {
            field: 'category',
            headerName: 'Категорія',
            flex: 1,
            minWidth: 150,
            renderCell: function(params) {
                return <Typography variant="body2">{params.value || '—'}</Typography>;
            }
        },
        {
            field: 'description',
            headerName: 'Опис',
            flex: 2,
            minWidth: 220
        },
        {
            field: 'docLink',
            headerName: 'Документація',
            flex: 1.5,
            minWidth: 180,
            renderCell: function(params) {
                return <LinkCell url={params.value} />;
            }
        },
        {
            field: 'quantity',
            headerName: 'К-сть',
            flex: 0.8,
            minWidth: 80,
            renderCell: function(params) {
                return <Typography fontWeight={600}>{params.value} шт</Typography>;
            }
        },
        {
            field: 'price',
            headerName: 'Ціна',
            flex: 1,
            minWidth: 100,
            renderCell: function(params) {
                return <Typography fontWeight={600}>{params.value ? `${params.value} ₴` : '—'}</Typography>;
            }
        },
        {
            field: 'tags',
            headerName: 'Теги',
            flex: 1.5,
            minWidth: 150,
            renderCell: function(params) {
                return <TagsCell value={params.value} />;
            }
        },
        {
            field: 'rowActions',
            headerName: '',
            width: 50,
            sortable: false,
            filterable: false,
            renderCell: function(params) {
                return <ButtonsCell
                    onEdit={function() { console.log('edit', params.row.id); }}
                    onMoveToNeeds={function() { console.log('move to needs', params.row.id); }}
                    onDelete={function() { console.log('delete', params.row.id); }}
                />;
            }
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <ComponentsTableToolbar
                onAddComponent={function() { console.log('add component'); }}
                onImportExcel={function() { console.log('import excel'); }}
            />
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={100}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick={true}
                    columnReordering={true}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: 1.4
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ComponentsTable;
