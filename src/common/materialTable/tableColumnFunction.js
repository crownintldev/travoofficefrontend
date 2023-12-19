import CustomChip from 'src/@core/components/mui/chip'
import dayjs from 'dayjs';


const statusObj = {
    booked: 'success',
    active: 'success',
    pending: 'warning',
    inactive: 'secondary',
    inprocess: 'info'
  }
  
  export const renderStatusCell = ({ cell }) => {
    const value = cell.getValue()
    return (
      statusObj.hasOwnProperty(value) && (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={value}
          color={statusObj[value]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    )
  }
  export const defaultCellRenderer = ({ row, column }) => {
    const value = column.id.split('.').reduce((acc, curr) => acc?.[curr], row.original);
  
    // Check if the value is not undefined and not null
    return value !== undefined && value !== null ? value : <span className='text-yellow-300'>N/A</span>;
  };
  
  
  export const conditionValue = ({ cell }) => {
    const data = cell.getValue()
    return data.fullName ? data.fullName : data.companyName
  }
  export const dateFormat=({cell})=>{
   return dayjs(cell.getValue()).format('YYYY-MM-DD')
  }