import React from 'react'
import { Control, FieldValues, Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'



const SelectField = ({
  name,
  control,
  label,
  options,
  errors
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          select
          fullWidth
          value={field.value ? field.value : 'abc'}
          onChange={field.onChange}
          sx={{ mb: 4 }}
          label={label}
          error={errors && Boolean(errors[name])}
          helperText={errors && errors[name]?.message}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      )}
    />
  )
}

export default SelectField
