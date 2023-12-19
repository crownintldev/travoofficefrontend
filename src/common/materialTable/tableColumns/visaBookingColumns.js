import React from 'react'
import { useMemo } from 'react'
import {
  renderStatusCell,
  defaultCellRenderer,
  dateFormat,
} from 'src/common/materialTable/tableColumnFunction'

const useTableColumns = () =>
  useMemo(
    () => [
      { accessorKey: 'onModel', header: 'Refer', Cell: defaultCellRenderer },
      { accessorKey: 'RefName', header: 'Refer Name', Cell: defaultCellRenderer },
      { accessorKey: 'phone', header: 'Phone', Cell: defaultCellRenderer },
      { accessorKey: 'passportId.givenName', header: 'Given Name', Cell: defaultCellRenderer },
      {
        accessorKey: 'passportId.passportNumber',
        header: 'Passport Number',
      },
      { accessorKey: 'status', header: 'Status', Cell: renderStatusCell },

      {
        accessorKey: 'visaId.processing.processingFee',
        header: 'Processing Fee',
        Cell: defaultCellRenderer
      },
      {
        accessorKey: 'visaId.processing.visaFee',
        header: 'Processing - Visa Fee',
        Cell: defaultCellRenderer
      },
      {
        accessorKey: 'visaId.confirmed.totalFee',
        header: 'Confirmed - Total Fee',
        Cell: defaultCellRenderer
      },
      { accessorKey: 'visaId.category.name', header: 'Category', Cell: defaultCellRenderer },
      { accessorKey: 'visaId.destination.name', header: 'Destination', Cell: defaultCellRenderer },
      { accessorKey: 'visaId.type.name', header: 'Type', Cell: defaultCellRenderer },
      { accessorKey: 'visaId.duration.name', header: 'Duration', Cell: defaultCellRenderer },
      { accessorKey: 'updatedAt', header: 'Changed At', Cell: dateFormat }
    ],
    []
  )
export default useTableColumns
