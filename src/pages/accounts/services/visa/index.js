import React, { useEffect } from 'react'
import axios from 'axios'
import DataTable from 'src/common/table/DataTable'
import MaterialTable from 'src/common/materialTable/MaterialTable'
import { useMemo } from 'react'
import { columnData } from 'src/common/table/columnDataFunction'
import CustomChip from 'src/@core/components/mui/chip'
import useTableColumns from './TableColumns'
//Forms
import VisaServiceForm from 'src/common/forms/services/visaService/VisaServiceForm'
import EditVisaServiceForm from 'src/common/forms/services/visaService/EditVisaServiceForm'

// redux
import { fetchData } from 'src/store/apps/services/visaService'

const index = ({ apiData }) => {
  const columns = useTableColumns()

  return (
    <div>
      <MaterialTable
       api={'visa'}
        apiData={apiData}
        fetchData={fetchData}
        stateSelector='visaService'
        columns={columns}
        drawerProps={{
          formTitle: 'Add Visa Service',
          editFormTitle: 'Edit Visa Service',
          //header buttons drawer
          buttonTitle: 'Add New Visa Service',
          editButtonTitle: 'Edit Visa Service',
          CreateForm: VisaServiceForm,
          EditForm: EditVisaServiceForm
        }}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default index
