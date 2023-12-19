import React from 'react'
import { useMemo } from 'react'

import { defaultCellRenderer } from 'src/common/materialTable/tableColumnFunction'

const useTableColumns = () =>
  useMemo(
    () => [
      { accessorKey: 'category.name', header: 'Category', Cell: defaultCellRenderer },
      { accessorKey: 'destination.name', header: 'Destination', Cell: defaultCellRenderer },
      { accessorKey: 'type.name', header: 'Type', Cell: defaultCellRenderer },
      { accessorKey: 'duration.name', header: 'Duration', Cell: defaultCellRenderer },
      {
        accessorKey: 'processing.processingFee',
        header: 'Processing Fee',
        Cell: defaultCellRenderer
      },
      {
        accessorKey: 'processing.visaFee',
        header: 'Processing - Visa Fee',
        Cell: defaultCellRenderer
      },
      {
        accessorKey: 'confirmed.totalFee',
        header: 'Confirmed - Total Fee',
        Cell: defaultCellRenderer
      }
    ],
    []
  )
export default useTableColumns
