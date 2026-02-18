import ComponentsTableToolbar from '../ComponentsTableToolbar';

const TableToolbar = ({ onAddComponent, onImportExcel }) => {
  return (
    <ComponentsTableToolbar
      onAddComponent={onAddComponent}
      onImportExcel={onImportExcel}
    />
  );
};

export default TableToolbar;
