import React, { useState } from 'react'
import { Button } from '@mui/material'
import FormDrawer from 'src/common/drawer/FormDrawer'

const CustomOpenButtonForm = ({ ButtonTitle, drawerTitle, Form, callApi,formName,apiEndpoint }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  return (
    <div>
      <Button onClick={() => setDrawerOpen(true)}>{ButtonTitle}</Button>
      <FormDrawer
        open={drawerOpen}
        toggle={toggleDrawer}
        drawerTitle={drawerTitle}
        Form={Form}
        anchor='left'
        callApi={callApi}
        formName={formName}
        apiEndpoint={apiEndpoint}
      />
    </div>
  )
}

export default CustomOpenButtonForm
