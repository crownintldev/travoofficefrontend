import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
// ** MUI Imports
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'

import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
// import DatePickerComponent from 'src/common/dataEntry/DatePickerComponent'
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { addPassport, fetchData } from 'src/store/apps/booking/passport'

// components
import InputField from 'src/common/dataEntry/InputField'
import SelectField from 'src/common/dataEntry/SelectField'

//get by data
import axios from 'axios'
import { agentList } from 'src/action/users/agent'
import { companyList } from 'src/action/users/company'
import { clientList } from 'src/action/users/client'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// vuexy components
import FilesUploader from 'src/common/fileUpload/FilesUploader'
// import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CardSnippet from 'src/@core/components/card-snippet'

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
  bookletNumber: yup.number().required('Booklet Number is required'),
  cnic: yup.number().required('Cnic Number is required'),
  city: yup.string().required('City is required.'),
  country: yup.string().required('Country is required'),
  dob: yup.date().required('Date of Birth is required'),
  doi: yup.string().required('Digital Object Identifier'),
  doe: yup.date().required('Date of Expiry is required'),
  pob: yup.string().required('Place of Birth is required'),
  gender: yup.string().required('Gender is required'),
  givenName: yup.string().required('Given Name is required'),
  fatherName: yup.string().required('Father name is required'),
  issuingAuthority: yup.string().required('Issuing Authority is required'),
  nationality: yup.string().required('Nationality is required'),
  passportNumber: yup.string().required('Passport Number is required'),
  religion: yup.string().required('Religion is required'),
  remarks: yup.string().required('Remarks is required'),
  surname: yup.string().required('Surname is required'),
  trackingNumber: yup.number().required('Tracking Number is required'),
  onModel: yup.string().required('Refer Category is required'),
  by: yup.string().required('Refer is required'),
  files: yup.array().required('Files Are Missing')
  // email: yup.string().email().required(),
  // contact: yup
  //   .number()
  //   .typeError('Contact Number field is required')
  //   .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
  //   .required(),
  // fullName: yup
  //   .string()
  //   .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
  //   .required(),
  // username: yup
  //   .string()
  //   .min(3, obj => showErrors('Username', obj.value.length, obj.min))
  //   .required()
})

const defaultValues = {
  bookletNumber: '',
  cnic: '',
  city: '',
  country: '',
  dob: '',
  doi: '',
  gender: '',
  givenName: '',
  fatherName: '',
  issuingAuthority: '',
  nationality: '',
  passportNumber: '',
  religion: '',
  remarks: '',
  surname: '',
  trackingNumber: '',
  onModel: 'Agent',
  files: [],
  by: ''
}

// ------------------Passport Form-----------------------
const PassportForm = ({ toggle,removeSelection }) => {
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const [date, setDate] = useState(new Date())
  const store = useSelector(state => state.user)

  // onModel
  const [agents, setAgents] = useState()
  const [company, setCompany] = useState()
  const [clients, setClients] = useState()

  const getAgents = async () => {
    try {
      const res = await agentList()
      setAgents(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  const getClients = async () => {
    try {
      const res = await clientList()
      setClients(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  const getCompany = async () => {
    try {
      const res = await companyList()
      setCompany(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  useEffect(() => {
    getAgents()
    getClients()
    getCompany()
  }, [])

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

  const watchedOnModel = watch('onModel')

  const handleClose = () => {
    // setPlan('basic')
    // setRole('subscriber')
    toggle()
    // reset()
  }

  const onSubmit = async data => {
    // console.log('data', data)
    let formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key !== 'files') {
        formData.append(key, data[key])
      }
    })
    data.files.forEach(file => {
      formData.append('files', file)
    })

    const responseAction = await dispatch(addPassport(formData))
    console.log(responseAction)
    if (responseAction.type === 'appPassports/addPassport/fulfilled') {
      toggle()
      setFiles([])
      reset()
      removeSelection();
      toast.success('InsertSuccessfully', { position: 'top-center' })
    } else {
      toast.error("Error", { position: 'top-center' })
    }
  }

  const addPassportFields = [
    {
      name: 'passportNumber',
      type: 'number'
    },
    {
      name: 'bookletNumber',
      type: 'number'
    },
    {
      name: 'city'
    },
    {
      name: 'cnic',
      type: 'number'
    },
    {
      name: 'country'
    },
    {
      name: 'dob',
      placeholder: 'Date of Birth'
    },
    {
      name: 'doe',
      placeholder: 'Date of Expiry'
    },
    {
      name: 'doi'
    },
    {
      name: 'gender'
    },
    {
      name: 'givenName'
    },
    {
      name: 'fatherName'
    },
    {
      name: 'issuingAuthority'
    },
    {
      name: 'nationality'
    },
    {
      name: 'pob',
      placeholder: 'Place of Birth'
    },
    {
      name: 'religion'
    },
  
    {
      name: 'surname'
    },
    {
      name: 'trackingNumber',
      type: 'number'
    },
    {
      name: 'remarks'
    },
  ]

  const capitalizeCamelSpace = name => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
    return capitalized.replace(/([A-Z])/g, ' $1').trim()
  }
  //for date
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  //for date end
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {addPassportFields.map(item => {
          const { name, label, placeholder, type } = item
          return (
            <>
              {name === 'dob' || name === 'doe' ? (
                <Box sx={{ mb: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name={name}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          label={placeholder}
                          inputFormat='MM/DD/YYYY'
                          {...field}
                          renderInput={params => (
                            <TextField
                              {...params}
                              size='small'
                              fullWidth
                              error={Boolean(errors.datePicker)}
                              helperText={errors.datePicker?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              ) : (
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
                      placeholder={
                        placeholder ? placeholder : `Enter ${capitalizeCamelSpace(name)}`
                      }
                      error={Boolean(errors[name])}
                      helperText={errors[name]?.message || ''}
                    />
                  )}
                />
              )}
            </>
          )
        })}

        <Controller
          name='onModel'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              select
              fullWidth
              label='Refer Category'
              error={Boolean(errors.onModel)}
              helperText={errors.onModel?.message}
              // {...field} // Spread the field object
              SelectProps={{
                value: field.value,
                onChange: e => field.onChange(e)
              }}
              sx={{ mb: 4 }}
            >
              <MenuItem value='Client'>Client</MenuItem>
              <MenuItem value='Company'>Company</MenuItem>
              <MenuItem value='Agent'>Agent</MenuItem>
            </CustomTextField>
          )}
        />
        <Controller
          name='by'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              select
              fullWidth
              label='Select Refer To'
              error={Boolean(errors.by)}
              helperText={errors.by?.message}
              SelectProps={{
                value: value,
                onChange: e => onChange(e)
              }}
              sx={{ mb: 4 }}
            >
              <MenuItem value='' disabled>
                Select refer
              </MenuItem>
              {watchedOnModel === 'Client' &&
                clients?.map(item => (
                  <MenuItem key={item} value={item._id}>
                    <div>
                      <div>Phone: {item.phone && item.phone}</div>
                      <div>Name: {item.fullName && item.fullName}</div>
                    </div>
                  </MenuItem>
                ))}
              {watchedOnModel === 'Agent' &&
                agents?.map(item => (
                  <MenuItem key={item} value={item._id}>
                    <div>
                      <div>Phone: {item.phone && item.phone}</div>
                      <div>Name: {item.fullName && item.fullName}</div>
                    </div>
                  </MenuItem>
                ))}
              {watchedOnModel === 'Company' &&
                company?.map(item => (
                  <MenuItem key={item} value={item._id}>
                    <div>
                      <div>Phone: {item.phone && item.phone}</div>
                      <div>Name: {item.companyName && item.companyName}</div>
                    </div>
                  </MenuItem>
                ))}
            </CustomTextField>
          )}
        />

        <Controller
          name='files'
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <label htmlFor='files'>Upload Files</label>
              <FilesUploader setFiles={setFiles} files={files} onChange={onChange} />
            </>
          )}
        />

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

export default PassportForm
