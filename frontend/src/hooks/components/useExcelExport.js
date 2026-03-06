import { useCallback } from 'react';
import { saveAs } from 'file-saver';

export const useExcelExport = (data, getCategoryName) => {
  const exportToExcel = useCallback(async (filename = 'data') => {
    if (!data?.length) {
      alert('Немає даних для експорту');
      return;
    }
const ExcelJS = (await import('exceljs/dist/exceljs.min.js')).default;
const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Компоненти');
  workbook.creator = 'Компоненти';
  workbook.created = new Date();

    const headers = ['Компонент', 'Категорія', 'Опис', 'Документація', 'К-сть', 'Ціна', 'Теги'];
    const headerRow = worksheet.addRow(headers);

    headerRow.font = {
      name: 'Times New Roman',
      size: 14,
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f16731' }
    };
    headerRow.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    };
    worksheet.getRow(1).height = 35;

    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: '08273b' } },
        left: { style: 'thin', color: { argb: '08273b' } },
        bottom: { style: 'thin', color: { argb: '08273b' } },
        right: { style: 'thin', color: { argb: '08273b' } }
      };
    });

    data.forEach((row, index) => {
      const tags = row.tags?.map(tag => tag.name || tag).filter(Boolean).join(', ') || '';
      const rowNumber = index + 2;
      const docCell = row.documentationLink || '';

      const dataRow = worksheet.addRow([
        row.name || '',
        getCategoryName?.(row.categoryId) || '',
        row.description || '',
        docCell,
        `${row.quantity || 0} шт`,
        row.price ? `${row.price} ₴` : '—',
        tags
      ]);

      dataRow.font = { name: 'Times New Roman', size: 14 };

      const descriptionLen = (row.description || '').length;
      const docLen = docCell.length;
      const tagsLen = tags.length;
      const maxTextLen = Math.max(descriptionLen, docLen, tagsLen);
      const estimatedLines = Math.ceil(maxTextLen / 20);
      const autoHeight = Math.max(30, estimatedLines * 22);

      worksheet.getRow(rowNumber).height = autoHeight;

      dataRow.eachCell((cell, colNumber) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center'
        };

        if (colNumber === 4 && row.documentationLink) {
          cell.font = {
            name: 'Times New Roman',
            size: 14,
            color: { argb: '0066CC' },
            underline: true
          };
        }

        cell.border = {
          top: { style: 'thin', color: { argb: '08273b' } },
          left: { style: 'thin', color: { argb: '08273b' } },
          bottom: { style: 'thin', color: { argb: '08273b' } },
          right: { style: 'thin', color: { argb: '08273b' } }
        };
      });
    });

    const lastRow = data.length + 1;
    const lastCol = 7;

    for (let r = 1; r <= lastRow; r++) {
      for (let c = 1; c <= lastCol; c++) {
        const cell = worksheet.getCell(r, c);
        cell.border = {
          top: { style: 'thin', color: { argb: '08273b' } },
          left: { style: 'thin', color: { argb: '08273b' } },
          bottom: { style: 'thin', color: { argb: '08273b' } },
          right: { style: 'thin', color: { argb: '08273b' } }
        };
      }
    }

    worksheet.columns = [
      { width: 28 }, { width: 20 }, { width: 45 }, 
      { width: 50 }, { width: 14 }, { width: 16 }, { width: 40 }
    ];

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const dateStr = new Date().toISOString().slice(0, 10);
      saveAs(blob, `${filename}_${dateStr}.xlsx`);
    } catch (error) {
      console.error('Помилка експорту:', error);
      alert('Помилка при створенні файлу');
    }
  }, [data, getCategoryName]);

  return { exportToExcel };
};
