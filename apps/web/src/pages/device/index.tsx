import { Link } from 'react-router-dom';
import { Button, Stack, Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef, DEFAULT_GRID_AUTOSIZE_OPTIONS } from '@mui/x-data-grid';
import { ListAlt, DeleteOutline } from '@mui/icons-material';
import { Breadcrumbs } from '@/components';
import './style.less';

const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        align: 'left',
        headerAlign: 'left',
        type: 'number',
        width: 90,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
        field: '$operation',
        headerName: 'Operation',
        // flex: 1,
        minWidth: 100,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        resizable: false,
        flex: 1,
        renderCell() {
            // console.log(cell);
            return (
                <Stack
                    direction="row"
                    spacing="4px"
                    sx={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}
                >
                    <IconButton sx={{ width: 30, height: 30 }}>
                        <ListAlt sx={{ width: 20, height: 20 }} />
                    </IconButton>
                    <IconButton
                        color="error"
                        sx={{
                            width: 30,
                            height: 30,
                            color: 'text.secondary',
                            '&:hover': { color: 'error.light' },
                        }}
                    >
                        <DeleteOutline sx={{ width: 20, height: 20 }} />
                    </IconButton>
                </Stack>
            );
        },
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default () => {
    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-device">
                <div className="ms-view__inner">
                    <div className="ms-operations">
                        <Stack className="ms-operations-btns" direction="row" spacing="12px">
                            <Button variant="contained" sx={{ height: 36 }}>
                                Add
                            </Button>
                            <Button variant="outlined" color="error" sx={{ height: 36 }}>
                                Delete
                            </Button>
                        </Stack>
                    </div>
                    <div className="ms-table-wrap">
                        <DataGrid
                            checkboxSelection
                            disableRowSelectionOnClick
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            // autosizeOptions={{ ...DEFAULT_GRID_AUTOSIZE_OPTIONS, expand: true }}
                            pageSizeOptions={[5, 10]}
                            sx={{ border: 0 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
