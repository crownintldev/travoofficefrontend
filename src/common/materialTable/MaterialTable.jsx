import React, { useEffect, useMemo, useState } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid } from '@mui/material'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import FormDrawer from '../drawer/FormDrawer'
import TableHeader from './tableHeader/TableHeader'
//functions
import { hasSubRows, muiLinearProgressProps } from './functions'

const Example = ({ fetchData, stateSelector, columns, apiData, drawerProps, api }) => {
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
  const { data, total, isLoading, isError } = useSelector(state => state[stateSelector])
  const [isRefetching, setIsRefetching] = useState(false)

  // Table state
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [selectionRow, setSelectionRow] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  //drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  // console.log(globalFilter)
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

  const selectedRowIds = Object.keys(rowSelection).filter(key => rowSelection[key])

  useEffect(() => {
    setSelectionRow(selectedRowIds)
  }, [rowSelection])

  const handleRemoveSelection = () => {
    setRowSelection({})
  }

  const renderCustomActions = ({ table }) => {
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
        deleteIds={selectionRow}
        fetchData={fetchData}
        api={api}
        table={table}
        tableData={data}
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

  const table = useMaterialReactTable({
    columns,
    data: data,

    enableExpanding: hasSubRows(data),
    // enableExpanding: true,
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
    onRowSelectionChange: setRowSelection,
    initialState: { showColumnFilters: false,density: 'compact' },
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
    muiLinearProgressProps: muiLinearProgressProps
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
