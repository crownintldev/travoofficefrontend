import React from 'react'
import { useMemo } from 'react'
import {
  renderStatusCell,
  defaultCellRenderer,
  conditionValue,
  dateFormat
} from 'src/common/materialTable/tableColumnFunction'

const useTableColumns = () =>
  useMemo(
    () => [
      { accessorKey: 'visabooking.status', header: 'Status', Cell: renderStatusCell },
      { accessorKey: 'givenName', header: 'Given Name' },
      { accessorKey: 'city', header: 'City' },
      { accessorKey: 'surname', header: 'Surname' },
      { accessorKey: 'cnic', header: 'CNIC' },
      { accessorKey: 'country', header: 'Country' },
      { accessorKey: 'dob', header: 'Date of Birth' },
      { accessorKey: 'doe', header: 'Date of Expiry' },
      { accessorKey: 'doi', header: 'Doi' },
      { accessorKey: 'fatherName', header: 'Father Name' },
      { accessorKey: 'gender', header: 'Gender' },
      { accessorKey: 'issuingAuthority', header: 'Issuing Authority' },
      { accessorKey: 'nationality', header: 'Nationality' },
      { accessorKey: 'onModel', header: 'Refer' },
      {
        accessorKey: 'by',
        header: 'Refer Name',
        Cell: conditionValue
      },
      // { accessorKey: 'by.companyName', header: 'Company Name' },
      { accessorKey: 'by.phone', header: 'Refer Phone #' },
      { accessorKey: 'passportNumber', header: 'Passport Number' },
      { accessorKey: 'pob', header: 'Place of Birth' },
      { accessorKey: 'religion', header: 'Religion' },
      { accessorKey: 'remarks', header: 'Remarks' },
      { accessorKey: 'bookletNumber', header: 'Booklet Number' },
      { accessorKey: 'trackingNumber', header: 'Tracking Number' },
      { accessorKey: 'updatedAt', header: 'Updated', Cell: dateFormat }
      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   // Cell: ({ row }) => <RowOptions id={row.original._id} />,
      //   disableSorting: true,
      //   size: 100
      // }
    ],
    []
  )
export default useTableColumns
