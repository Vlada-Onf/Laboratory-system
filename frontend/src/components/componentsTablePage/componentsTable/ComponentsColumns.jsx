import { useMemo } from 'react';
import { Typography } from '@mui/material';
import ClickableComponentCell from './ClickableComponentCell';
import CategoryCell from './CategoryCell';
import LinkBadge from '../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';

export const ComponentsColumns = ({
  categories,
  categoriesLoading,
  categoriesTagsReady,
  onComponentClick,
  onEdit,
  onDelete,
  onMoveToNeeds,
  showActions
}) => {
  return useMemo(() => {
    const baseColumns = [
      {
        field: 'component',
        headerName: 'Компонент',
        flex: 2,
        minWidth: 250,
        sortable: false,
        renderCell: ({ row }) => (
          <ClickableComponentCell
            image={row.photoUrl}
            name={row.name}
            id={row.id}
            onClick={onComponentClick}
          />
        )
      },
      {
        field: 'category',
        headerName: 'Категорія',
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <CategoryCell
            categoryId={row.categoryId}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesLoaded={categoriesTagsReady}
          />
        )
      },
      { 
        field: 'description', 
        headerName: 'Опис', 
        flex: 2, 
        minWidth: 220 
      },
      {
        field: 'documentationLink',
        headerName: 'Документація',
        flex: 1.5,
        minWidth: 180,
        renderCell: ({ value }) => (
          <LinkBadge url={value} color="#08273b" />
        )
      },
      {
        field: 'quantity',
        headerName: 'К-сть',
        flex: 0.8,
        minWidth: 80,
        renderCell: ({ value }) => (
          <Typography fontWeight={600}>{value} шт</Typography>
        )
      },
      {
        field: 'price',
        headerName: 'Ціна',
        flex: 1,
        minWidth: 100,
        renderCell: ({ value }) => (
          <Typography fontWeight={600}>
            {value ? `${value} ₴` : '—'}
          </Typography>
        )
      },
      {
        field: 'tags',
        headerName: 'Теги',
        flex: 1.5,
        minWidth: 150,
        renderCell: ({ row }) => <TagsCell value={row.tags} />
      }
    ];

    if (showActions) {
      baseColumns.push({
        field: 'rowActions',
        headerName: '',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <ButtonsCell
            row={row}
            onEdit={() => onEdit(row)}
            onDelete={() => onDelete(row)}
            onMoveToNeeds={() => onMoveToNeeds(row)}
          />
        )
      });
    }

    return baseColumns;
  }, [
    categories,
    categoriesLoading,
    categoriesTagsReady,
    onComponentClick,
    onEdit,
    onDelete,
    onMoveToNeeds,
    showActions
  ]);
};

export default ComponentsColumns;
