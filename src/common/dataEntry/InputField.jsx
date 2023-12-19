import React from 'react'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
//types
import { Control, FieldValues } from 'react-hook-form'



const InputField = ({
  name,
  control,
  label,
  placeholder,
  errors,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          fullWidth
          value={field.value}
          onChange={field.onChange}
          sx={{ mb: 4 }}
          label={label}
          placeholder={placeholder}
          error={errors && Boolean(errors[name])}
          helperText={errors && errors[name]?.message}
        //   error={error}
        //   helperText={helperText}
        />
      )}
    />
  )
}

export default InputField
