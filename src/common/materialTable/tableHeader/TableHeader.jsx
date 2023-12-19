// ** MUI Imports
import React, { useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import { Theme, useTheme } from '@mui/material/styles'
import toast from 'react-hot-toast'
import { IconButton, Menu, MenuItem } from '@mui/material'
// import { mdiCallToAction } from '@mdi/js';
import Button from '@mui/material/Button'
import ExportButton from './ExportButton'

import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { axiosErrorMessage } from 'src/utils/helperfunction'

const TableHeader = props => {
  const theme = useTheme()
  const dispatch = useDispatch()
  // ** Props
  const { toggle, buttonTitle, deleteIds, fetchData, api, table, tableData } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleRemove = async () => {
    if (!api) {
      return toast.error('api not found', { position: 'top-center' })
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/${api}/remove`, {
        ids: deleteIds
      })
      if (response.data) {
        dispatch(
          fetchData({
            limit: 20,
            page: 1
          })
        )
        toast.success('Delete Successfully', { position: 'top-center' })
      }
    } catch (error) {
      console.log(axiosErrorMessage(error))
      toast.error(axiosErrorMessage(error), { position: 'top-center' })
    }
  }

  return (
    <Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* {buttonTitle && (
          <Button onClick={toggle} variant='contained'  sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            {buttonTitle}
          </Button>
        )} */}
        <IconButton onClick={handleClick}>
          <Icon fontSize='1.5rem' icon='mdi:call-to-action' color='#2b60fe' />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {buttonTitle && (
            <MenuItem onClick={handleClose}>
              <Button onClick={toggle} size='small' sx={{ p: 0, m: 0 }}>
                <Icon fontSize='0.8rem' icon='tabler:plus' />
                {buttonTitle}
              </Button>
            </MenuItem>
          )}
          {api === 'visa' ||
            (api === 'passports' && deleteIds && deleteIds.length > 0 && (
              <MenuItem onClick={handleClose}>
                <Button onClick={handleRemove} color='error' size='small' sx={{ p: 0, m: 0 }}>
                  <Icon fontSize='0.8rem' icon='tabler:minus' />
                  {api === 'visa' && 'Delete Visa Service'}
                  {api === 'passports' && 'Delete Passports'}
                </Button>
              </MenuItem>
            ))}

          {/* <MenuItem onClick={handleClose}>Option 3</MenuItem> */}
          {/* Add more menu items here */}
        </Menu>

        {/* ----------Export data--------- */}
        <ExportButton table={table} tableData={tableData} />
      </Box>
    </Box>
  )
}

export default TableHeader
