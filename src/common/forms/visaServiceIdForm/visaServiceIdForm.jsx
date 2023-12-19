import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
// ** MUI Imports
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { fetchData } from 'src/store/apps/services/visaService'

// components

//get by data
import axios from 'axios'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  name: yup.string().required('category is required')
})

const defaultValues = {
  name: ''
}

// ------------------Passport Form-----------------------
const VisaServiceIdForm = ({
  toggle,
  callApi,
  formName = 'Category',
  apiEndpoint = 'visa-category/create'
}) => {
  // selectIds

  const {
    reset,
    control,
    setError,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // close on close button
  const handleClose = () => {
    // setPlan('basic')
    // setRole('subscriber')
    toggle()
    // reset()
  }

  const onSubmit = async data => {
    // console.log('data', data)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/${apiEndpoint}`, data)
      // console.log(response)
      if (response) {
        toggle()
        reset()
        callApi()
        toast.success(`${formName} Create Successfully`, { position: 'top-center' })
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'An unexpected error occurred'
      console.log(err)
      toast.error(errorMessage, { position: 'top-center' })
    }
  }

  const chooseField = [
    {
      name: 'name',
      placeholder: `Enter ${formName} Name`,
      label: `${formName} Name`
    }
  ]

  const myField = [...chooseField]

  const capitalizeCamelSpace = name => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
    return capitalized.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {myField.map(item => {
          const { name, label, placeholder, type } = item
          return (
            <>
              <Controller
                key={name}
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type={type ? type : 'text'}
                    value={value}
                    sx={{ mb: 4 }}
                    label={label ? label : capitalizeCamelSpace(name)}
                    onChange={onChange}
                    placeholder={placeholder ? placeholder : `Enter ${capitalizeCamelSpace(name)}`}
                    error={Boolean(errors[name])}
                    helperText={errors[name]?.message || ''}
                  />
                )}
              />
            </>
          )
        })}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type='submit' variant='contained' sx={{ mr: 3 }}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default VisaServiceIdForm
