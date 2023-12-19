import { useMemo, useState, useEffect } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { Box, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { muiLinearProgressProps } from '../functions'
import { Button, Grid } from '@mui/material'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import FormDrawer from '../../drawer/FormDrawer'
import TableHeader from './TableHeader'

const Example = ({ columns, childColumns, fetchData, stateSelector, apiData, drawerProps,api }) => {
  const {
    formTitle,
    editFormTitle,
    buttonTitle,
    editButtonTitle,
    EditForm,
    CreateForm,
    multiSelected = false
  } = drawerProps
  const dispatch = useDispatch()
  const accountItems = useSelector(state => state.account.data)
  const { data, total, isLoading, isError } = useSelector(state => state[stateSelector])
  const [isRefetching, setIsRefetching] = useState(false)

  // Table state
  const [expandedRow, setExpandedRow] = useState(null);
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [selectionRow, setSelectionRow] = useState([])
  // childRow
  const [childRowSelection, setChildRowSelection] = useState([])
  const [childSelectionRow, setChildSelectionRow] = useState([])
  const [parentId, setParentId] = useState('')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  //drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  useEffect(() => {
    let sortField = sorting.length > 0 && sorting[0].id ? sorting[0].id : 'createdAt'
    let sortOrder = sorting.length > 0 && sorting[0].desc ? 1 : -1

    const handleEnterPress = event => {
      if (event.key === 'Enter') {
        dispatch(
          fetchData({
            limit: pagination.pageSize,
            page: pagination.pageIndex,
            searchTerm: globalFilter,
            columnFilters: JSON.stringify(columnFilters),
            sortField,
            sortOrder
          })
        )
      }
    }

    window.addEventListener('keydown', handleEnterPress)
    if (!globalFilter && columnFilters.length === 0) {
      dispatch(
        fetchData({
          limit: pagination.pageSize,
          page: pagination.pageIndex + 1,
          sortField,
          sortOrder
        })
      )
    }

    // Cleanup the event listener
    return () => {
      window.removeEventListener('keydown', handleEnterPress)
    }
  }, [dispatch, setPagination, pagination, globalFilter, columnFilters, sorting])

  const handleToggleRowExpanded = (rowId, isExpanded) => {
    setExpandedRow(isExpanded ? rowId : null);
  };


  //row selection method start

  const selectedRowIds = Object.keys(rowSelection).filter(key => rowSelection[key])
  const childSelectedRowsId = Object.keys(childRowSelection).filter(key => childRowSelection[key])

  useEffect(() => {
    setSelectionRow(selectedRowIds)
  }, [rowSelection])
  useEffect(() => {
    setChildSelectionRow(Object.keys(childRowSelection).filter(key => childRowSelection[key]))
  }, [childRowSelection])

  const handleRemoveSelection = () => {
    setRowSelection({})
  }

  const handleChildRowSelectionChange = (selection, parentRowId) => {
    setChildRowSelection(selection)
    setParentId(parentRowId)
  }
  //row selection method end

  const renderCustomActions = ({ state }) => {
    // console.log(state)
    return (
      <TableHeader
        toggle={toggleDrawer}
        buttonTitle={
          multiSelected && selectionRow.length > 0
            ? editButtonTitle
            : selectionRow.length === 1
            ? editButtonTitle
            : buttonTitle
            ? buttonTitle
            : ''
        }
        ejectValue={{
          visaBookingIds: childSelectionRow,
          accountId: parentId
        }}
        selectionRow={selectionRow}
        setChildRowSelection={setChildRowSelection}
        fetchData={fetchData}
        api={api}
      />
    )
  }

  //apidata
  const cards = () => {
    return (
      <Grid xs={12} className='mb-6' sx={{ zIndex: 10 }}>
        {apiData && apiData.data && apiData.data.length > 0 && (
          <Grid container spacing={6}>
            {apiData.data.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
    )
  }
  const detail = new Set()
  const table = useMaterialReactTable({
    columns,
    data,
    renderTopToolbarCustomActions: renderCustomActions,
    getRowId: row => row._id, // Adjust based on your data's unique identifier
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data'
        }
      : undefined,
    enableRowSelection: true,
    enableFilters:false,
    onRowSelectionChange: setRowSelection,
    initialState: { showColumnFilters: false},
    rowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: total,
    state: {
      rowSelection,
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading,
      sorting
    },
    muiLinearProgressProps: muiLinearProgressProps,

    renderDetailPanel: ({ row }) => {
      const parentRowId = row.original._id
      // console.log(parentRowId)

      detail.add(parentRowId)
      // console.log(detail)
      const handleChildRowSelectionChangeParentId = selection => {
        handleChildRowSelectionChange(selection, parentRowId)
      }

      const childTable = useMaterialReactTable({
        columns: childColumns,
        data: row.original.visaBookingIds || [],
        getRowId: childRow => childRow._id,
        enablePagination: false,
        enableFilters: false, // Disable header filters
        enableRowSelection: true,
        onRowSelectionChange: handleChildRowSelectionChangeParentId,
        onRowExpandedChange: handleToggleRowExpanded, // Handle row expansion changes
        expanded: expandedRow ? [expandedRow] : [], // Control which row is expanded
        state: {
          rowSelection: childRowSelection
        },
        defaultColumn: {
          maxSize: 400,
          minSize: 80,
          size: 160, //default size is usually 180
        },
        enableColumnResizing: true,
        layoutMode:'semantic',
        enableColumnFilterModes:false,
        enableColumnFilters:false,
        enableFilters:false
      })

      return (
        <Box
          sx={{ padding:"0 0 0 50px" }}
          className='custom-child-table'
        >
          <MaterialReactTable table={childTable} />
        </Box>
      )
    },
    enableRowSelection: true
  })

  return (
    <>
      {cards()}
      <div className='custom-scrollbar'>
        <MaterialReactTable table={table} />
      </div>
      <FormDrawer
        open={drawerOpen}
        toggle={toggleDrawer}
        drawerTitle={
          multiSelected ? editFormTitle : selectionRow.length === 1 ? editFormTitle : formTitle
        }
        Form={multiSelected ? EditForm : selectionRow.length === 1 ? EditForm : CreateForm}
        removeSelection={handleRemoveSelection}
        _id={multiSelected ? selectionRow : selectionRow.length === 1 ? selectionRow[0] : ''}
      />
    </>
  )
}

export default Example
