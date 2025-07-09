import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

const DataGridCustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar; 