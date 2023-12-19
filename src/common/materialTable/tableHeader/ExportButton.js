import React, { useState } from 'react'
import { handleExportRows, handleExportData } from '../functions'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'

const ExportButton = ({tableData,table}) => {
  const [exportToggle, setExportToggle] = useState(null)
  const toggleExport = Boolean(exportToggle)
  const handleExport = event => {
    setExportToggle(event.currentTarget)
  }
  const handleClose = () => {
    setExportToggle(null)
  }

  return (
    <div>
      <IconButton onClick={handleExport}>
        <Icon fontSize='1.5rem' icon='ph:export-bold' color='#2b60fe' />
      </IconButton>
      <Menu anchorEl={exportToggle} open={toggleExport} onClose={handleClose} sx={{ p: 0, m: 0 }}>
        <MenuItem onClick={handleClose}>
          <Button
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={() => handleExportData(tableData)}
            startIcon={<FileDownloadIcon />}
            size='small'
            sx={{ p: 0, m: 0 }}
          >
            Export All
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Button
            disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            size='small'
            sx={{ p: 0, m: 0 }}
          >
            Export Selected
          </Button>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ExportButton
