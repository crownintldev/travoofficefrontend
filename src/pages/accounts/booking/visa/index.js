import React, { useEffect } from 'react'
import axios from 'axios'
import DataTable from 'src/common/table/DataTable'
import MaterialTable from 'src/common/materialTable/MaterialTable'
import { useMemo } from 'react'
import { columnData } from 'src/common/table/columnDataFunction'
import CustomChip from 'src/@core/components/mui/chip'
import useTableColumns from 'src/common/materialTable/tableColumns/visaBookingColumns'
//Forms
import EditVisaBookingForm from 'src/common/forms/booking/visaBooking/EditVisaBookingForm'

// redux
import { fetchData } from 'src/store/apps/booking/visaBooking'
import { ReduxFetchAndGet } from 'src/utils/ReduxFetchAndGet'
import { Box, Typography } from '@mui/material'

const index = ({ apiData }) => {
  const columns = useTableColumns()

  return (
    <div>
      <MaterialTable
        apiData={apiData}
        fetchData={fetchData}
        stateSelector='visaBooking'
        columns={columns}
        drawerProps={{
          formTitle: 'Add Visa Service',
          editFormTitle: 'Edit Visa Booking',
          editButtonTitle: 'Edit Visa Booking',
          EditForm: EditVisaBookingForm,
          multiSelected: true
        }}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/visa-bookings/card`)
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default index
