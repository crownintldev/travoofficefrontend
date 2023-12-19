import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from '@mui/material/styles'
// ** MUI Imports
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomOpenButtonForm from '../../visaServiceIdForm/CustomOpenButtonForm'
//formids
import VisaServiceIdForm from '../../visaServiceIdForm/visaServiceIdForm'

import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { fetchData } from 'src/store/apps/services/visaService'

// components

//get by data
import axios from 'axios'
import { listVisaCategory } from 'src/action/visaIdSelector/visaCategory'
import { listVisaDestination } from 'src/action/visaIdSelector/visaDestination'
import { listVisaDuration } from 'src/action/visaIdSelector/visaDuration'
import { listVisaType } from 'src/action/visaIdSelector/visaType'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { fetchActionData } from 'src/action/fetchData'

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
  destination: yup.string().required(),
  category: yup.string().required(),
  type: yup.string().required(),
  duration: yup.string().required()
})

const defaultValues = {
  category: '',
  type: '',
  duration: '',
  destination: '',
  processing: {
    processingFee: '',
    visaFee: ''
  },
  confirmed: {
    totalFee: ''
  }
}

// ------------------Passport Form-----------------------
const EditVisaServiceForm = ({ toggle, _id, removeSelection }) => {
  // ** State

  const dispatch = useDispatch()
  const visaServiceId = useSelector(state => state.visaService.data.find(item => item._id === _id))
  // selectIds
  const [destination, setDestination] = useState([])
  const [type, setType] = useState([])
  const [duration, setDuration] = useState([])
  const [category, setCategory] = useState([])
  const [payMethod, setPayMethod] = useState('')

  useEffect(() => {
    fetchActionData(listVisaCategory, setCategory)
    fetchActionData(listVisaDestination, setDestination)
    fetchActionData(listVisaDuration, setDuration)
    fetchActionData(listVisaType, setType)
  }, [])

  const {
    reset,
    control,
    setError,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (visaServiceId.processing) {
      setPayMethod('processing')
    } else if (visaServiceId.confirmed) {
      setPayMethod('confirmed')
    }
    if (visaServiceId) {
      Object.keys(visaServiceId).forEach(key => {
        // @ts-ignore
        setValue('category', visaServiceId.category?._id)
        setValue('type', visaServiceId.type?._id)
        setValue('duration', visaServiceId.duration?._id)
        setValue('destination', visaServiceId.destination?._id)
        if (visaServiceId.confirmed) {
          setValue('confirmed.totalFee', visaServiceId.confirmed.totalFee)
        } else if (visaServiceId.processing) {
          setValue('processing.processingFee', visaServiceId.processing.processingFee)
        }
        setValue(key, visaServiceId[key])
        // @ts-ignore
        // fetchFiles(passportId?.files)
      })
    }
  }, [visaServiceId])

  //handle changing payment methods
  useEffect(() => {
    const currentValues = getValues()
    // Check if either 'processing' or 'confirmed' exists
    if (payMethod === 'confirmed' && currentValues.processing?.processingFee) {
      setValue('processing', undefined) // Or {} to reset to an empty object
    } else if (payMethod === 'processing' && currentValues.confirmed?.totalFee) {
      setValue('confirmed', undefined) // Or {} to reset to an empty object
    }
  }, [payMethod])

  const handleClose = () => {
    toggle()
    reset()
  }

  const onSubmit = async data => {
    console.log(data)
    const removeUndefined = obj => {
      const cleanedData = {}
      Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
          cleanedData[key] = obj[key]
        }
      })
      return cleanedData
    }
    const cleanedData = removeUndefined(data)
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/visa/update/${visaServiceId._id}`,
        cleanedData
      )
      if (response) {
        dispatch(
          fetchData({
            limit: 20,
            page: 1
          })
        )
        toggle()
        reset()
        removeSelection()
        toast.success('Visa Service Add Successfully', { position: 'top-center' })
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'An unexpected error occurred'
      console.log('Visa Service', err)
      toast.error(errorMessage, { position: 'top-center' })
    }
  }

  const choosePaymentMethod =
    payMethod === 'confirmed'
      ? [
          {
            name: 'confirmed.totalFee',
            type: 'number',
            placeholder: 'Enter Total Fee',
            label: 'Total Fee'
          }
        ]
      : [
          {
            name: 'processing.processingFee',
            type: 'number',
            placeholder: 'Enter Processing Fee',
            label: 'Processing Fee'
          },
          {
            name: 'processing.visaFee',
            placeholder: 'Enter Visa Fee',
            type: 'number',
            label: 'Visa Fee'
          }
        ]

  const visaServiceFields = [...choosePaymentMethod]

  const capitalizeCamelSpace = name => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
    return capitalized.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomOpenButtonForm
          ButtonTitle='Add Category'
          drawerTitle='Add Category Form'
          Form={VisaServiceIdForm}
          callApi={() => getCategory()}
          formName='Category'
          apiEndpoint='visa-category/create'
        />
        <Controller
          name='category'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              select
              fullWidth
              label='Select Category'
              error={Boolean(errors.category)}
              helperText={errors.category?.message}
              SelectProps={{
                value: value,
                onChange: e => onChange(e)
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>
                Select Category
              </MenuItem>
              {category?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />
        <CustomOpenButtonForm
          ButtonTitle='Add Type'
          drawerTitle='Add Type Form'
          Form={VisaServiceIdForm}
          callApi={() => getType()}
          formName='Type'
          apiEndpoint='visa-type/create'
        />
        <Controller
          name='type'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              select
              fullWidth
              label='Select Type'
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              SelectProps={{
                value: value,
                onChange: e => onChange(e)
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>
                Select Type
              </MenuItem>
              {type?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />
        <CustomOpenButtonForm
          ButtonTitle='Add Destination'
          drawerTitle='Add Destination Form'
          Form={VisaServiceIdForm}
          callApi={() => getDestination()}
          formName='Destination'
          apiEndpoint='visa-destination/create'
        />
        <Controller
          name='destination'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              select
              fullWidth
              label='Select Destination'
              error={Boolean(errors.destination)}
              helperText={errors.destination?.message}
              SelectProps={{
                value: value,
                onChange: e => onChange(e)
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>
                Select a destination
              </MenuItem>
              {destination?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />
        <CustomOpenButtonForm
          ButtonTitle='Add Duration'
          drawerTitle='Add Duration Form'
          Form={VisaServiceIdForm}
          callApi={() => getDuration()}
          formName='Duration'
          apiEndpoint='visa-duration/create'
        />
        <Controller
          name='duration'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              select
              fullWidth
              label='Select Duration'
              error={Boolean(errors.duration)}
              helperText={errors.duration?.message}
              SelectProps={{
                value: value,
                onChange: e => onChange(e)
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>
                Select Duration
              </MenuItem>
              {duration?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />
        <CustomTextField
          select
          fullWidth
          sx={{ mb: 6 }}
          label='Select Payment Method'
          SelectProps={{
            value: payMethod,
            onChange: e => setPayMethod(e.target.value)
          }}
        >
          <MenuItem value='confirmed'>Confirmed</MenuItem>
          <MenuItem value='processing'>Processing</MenuItem>
        </CustomTextField>

        {visaServiceFields.map(item => {
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

export default EditVisaServiceForm
