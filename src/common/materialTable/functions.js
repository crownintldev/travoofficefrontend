import { mkConfig, generateCsv, download } from 'export-to-csv'
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true
})

export const hasSubRows = data => {
  return data.some(row => row.subRows && row.subRows.length > 0)
}
export const muiLinearProgressProps = (isTopToolbar, table) => ({
  style: {
    height: isTopToolbar ? '3px' : '2px' // Example of dynamic height based on the table state
  }
})

//export csv,pdf function
export const handleExportRows = rows => {
  const rowData = rows.map(row => row.original)
  const csv = generateCsv(csvConfig)(rowData)
  download(csvConfig)(csv)
}
export const handleExportData = data => {
  const csv = generateCsv(csvConfig)(data)
  download(csvConfig)(csv)
}
