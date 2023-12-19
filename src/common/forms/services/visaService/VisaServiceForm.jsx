import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from '@mui/material/styles'
// ** MUI Imports
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomOpenButtonForm from '../../visaServiceIdForm/CustomOpenButtonForm'
//formids
import VisaServiceIdForm from '../../visaServiceIdForm/visaServiceIdForm'

import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { fetchData } from 'src/store/apps/services/visaService'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// components

//get by data
import axios from 'axios'
import { listVisaCategory } from 'src/action/visaIdSelector/visaCategory'
import { listVisaDestination } from 'src/action/visaIdSelector/visaDestination'
import { listVisaDuration } from 'src/action/visaIdSelector/visaDuration'
import { listVisaType } from 'src/action/visaIdSelector/visaType'
import { findVisaId } from 'src/action/visaService'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

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
const VisaServiceForm = ({ toggle, removeSelection }) => {
  // ** State

  const dispatch = useDispatch()

  // selectIds
  const [destination, setDestination] = useState()
  const [type, setType] = useState()
  const [duration, setDuration] = useState()
  const [category, setCategory] = useState()
  const [payMethod, setPayMethod] = useState('confirmed')
  //   const [findVisa, setFindVisa] = useState({
  //     destination: '',
  //     category: '',
  //     type: '',
  //     duration: ''
  //   })

  //   const [visa, setVisa] = useState([])

  const getCategory = async () => {
    try {
      const res = await listVisaCategory()
      setCategory(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  const getDestination = async () => {
    try {
      const res = await listVisaDestination()
      setDestination(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  const getDuration = async () => {
    try {
      const res = await listVisaDuration()
      setDuration(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  const getType = async () => {
    try {
      const res = await listVisaType()
      setType(res.data.data)
    } catch (err) {
      console.log('===========', err)
    }
  }

  useEffect(() => {
    getCategory()
    getDestination()
    getDuration()
    getType()
  }, [])
  //   useEffect(() => {
  //     const { destination, category, type, duration } = findVisa
  //     if (destination && category && type && duration) {
  //       const getVisa = async () => {
  //         try {
  //           const res = await findVisaId(findVisa)
  //           setVisa(res.data)
  //         } catch (err) {
  //           setVisa([])
  //         }
  //       }
  //       getVisa()
  //     }
  //   }, [findVisa])

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

  //handle changing payment methods
  useEffect(() => {
    if (payMethod === 'confirmed') {
      setValue('processing', 'undefined')
    } else if (payMethod === 'processing') {
      setValue('confirmed', 'undefined')
    }
  }, [payMethod])

  const handleClose = () => {
    toggle()
    reset()
  }

  const onSubmit = async data => {
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/visa/create`, cleanedData)
      if (response) {
        dispatch(
          fetchData({
            limit: 20,
            page: 1
          })
        )
        toggle()
        reset()
        if (removeSelection) {
          removeSelection()
        }
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

export default VisaServiceForm
