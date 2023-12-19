import React, { useEffect, useState } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
// ** MUI Imports
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

import { Box, Radio, Grid, Typography } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { fetchData } from 'src/store/apps/booking/visaBooking'

import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { SelectChangeEvent } from '@mui/material/Select'
import FormDrawer from 'src/common/drawer/FormDrawer'
import VisaServiceForm from '../../services/visaService/VisaServiceForm'

//custom vuexy select style
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

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
import toast from 'react-hot-toast'
import { fetchActionData } from 'src/action/fetchData'
import { axiosErrorMessage } from 'src/utils/helperfunction'

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
  visaBookingIds: yup.array().of(yup.string()).required('Visa booking IDs are required.'),
  status: yup.string().required('Status is required.')
})

const defaultValues = {
  visaBookingIds: [],
  visaId: '',
  status: 'booked'
}

// ------------------visaBooking Form-----------------------
const EditVisaBookingForm = ({ toggle, _id: ids, removeSelection }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  // ** State
  const dispatch = useDispatch()
  const visaBookingItems = useSelector(state =>
    ids
      .map(id => state.visaBooking.data.find(item => item._id === id))
      .map(item => {
        return {
          passportNumber: item.passportNumber,
          status: item.status,
          givenName: item.givenName,
          _id: item._id
        }
      })
  )

  // console.log(visaBookingItems)
  const [visaBookingIds, setsetVisaBookingIds] = React.useState(ids)

  const handleVisaBooking = event => {
    setsetVisaBookingIds(event.target.value)
  }

  // selectIds
  const [destination, setDestination] = useState([])
  const [type, setType] = useState([])
  const [duration, setDuration] = useState([])
  const [category, setCategory] = useState([])

  const [findVisa, setFindVisa] = useState({
    destination: '',
    category: '',
    type: '',
    duration: ''
  })
  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = event => {
    setSelectedValue(event.target.value)
  }

  const [visa, setVisa] = useState([])
  // console.log(visa)

  useEffect(() => {
    fetchActionData(listVisaCategory, setCategory)
    fetchActionData(listVisaDestination, setDestination)
    fetchActionData(listVisaDuration, setDuration)
    fetchActionData(listVisaType, setType)
  }, [])
  useEffect(() => {
    const { destination, category, duration, type } = findVisa
    if (destination && category && type && duration) {
      fetchActionData(() => findVisaId({ destination, category, type, duration }), setVisa)
    }
  }, [findVisa])
  const {
    reset,
    control,
    setError,
    handleSubmit,
    setValue,
    getValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    if (ids) {
      setValue('visaBookingIds', ids)
      setValue('status', 'booked')
      if (visa && visa.length === 0) {
        setValue('visaId', '')
      }
    }
  }, [ids, setValue])

  const handleClose = () => {
    removeSelection()
    setFindVisa({
      destination: '',
      category: '',
      type: '',
      duration: ''
    })
    toggle()
    reset()
  }

  const onSubmit = async data => {
    console.log('data', data)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/visa-booking/update`, data)
      if (response) {
        dispatch(
          fetchData({
            limit: 20,
            page: 1
          })
        )
        setFindVisa({
          destination: '',
          category: '',
          type: '',
          duration: ''
        })
        toggle()
        reset()
        removeSelection()
      }
      // console.log(response)
      toast.success('Update Successfully', { position: 'top-center' })
    } catch (err) {
      console.log(err)
      console.log(axiosErrorMessage(err))
      toast.error(axiosErrorMessage(err), { position: 'top-center' })
    }
  }

  const visaServiceFields = []

  const selectVisaId = () => {
    return visa && visa.length > 0
      ? visa.map(item => (
          <Box key={item._id} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              {item.confirmed && (
                <Grid item>
                  <Controller
                    name='visaId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box
                        sx={{
                          border: 1,
                          borderColor: 'grey.700',
                          p: 2,
                          height: '7rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Radio
                          {...field}
                          checked={field.value === item._id}
                          onChange={e => field.onChange(e)}
                          value={item._id}
                          name='radio-buttons'
                          inputProps={{ 'aria-label': 'A' }}
                        />
                        <div>
                          <Typography
                            variant='h6'
                            component='h4'
                            sx={{ fontWeight: 'bold', mb: '4px' }}
                          >
                            Confirmed Fee
                          </Typography>
                          <span> &nbsp; Total Fee: {item?.confirmed?.totalFee}</span>
                        </div>
                      </Box>
                    )}
                  />
                </Grid>
              )}
              {item.processing && (
                <Grid item>
                  <Controller
                    name='visaId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Box
                        sx={{
                          border: 1,
                          borderColor: 'grey.700',
                          p: 2,
                          height: '7rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Radio
                          {...field}
                          checked={field.value === item._id}
                          onChange={e => field.onChange(e)}
                          value={item._id}
                          name='radio-buttons'
                          inputProps={{ 'aria-label': 'A' }}
                        />
                        <div>
                          <Typography
                            variant='h6'
                            component='h4'
                            sx={{ fontWeight: 'bold', mb: '4px' }}
                          >
                            Processing Fee:
                          </Typography>
                          <span> &nbsp;Processing Fee: {item?.processing?.processingFee}</span>
                          <br />
                          <span> &nbsp;Visa Fee: {item?.processing?.visaFee}</span>
                        </div>
                      </Box>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        ))
      : findVisa.category && findVisa.destination && findVisa.duration && findVisa.type && (
          <Box sx={{ pb: 4 }}>
            <Typography variant='p' color='error' sx={{ fontSize: '0.7em' }}>
              Not Found Visa Service
            </Typography>
            <br />
            <Button
              variant='contained'
              size='small'
              color='secondary'
              onClick={() => setDrawerOpen(true)}
            >
              Add Visa Service
            </Button>
          </Box>
        )
  }
  const renderSelectedValue = selectedIds => {
    return selectedIds
      .map(id => {
        const item = visaBookingItems.find(item => item._id === id)
        return item ? `${item.passportNumber} ${item.givenName}` : ''
      })
      .filter(Boolean) // Removes any undefined or empty values
      .join(', ')
  }
  return (
    <div>
      <FormDrawer
        open={drawerOpen}
        toggle={toggleDrawer}
        drawerTitle={'Add Visa Service'}
        Form={VisaServiceForm}
        anchor='left'
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='visaBookingIds'
          control={control}
          render={({ field }) => (
            <CustomTextField
              sx={{ mb: 6 }}
              select
              fullWidth
              label='Passport Selected'
              id='select-multiple-checkbox'
              SelectProps={{
                MenuProps,
                displayEmpty: true,
                multiple: true,
                value: field.value,
                onChange: field.onChange,
                renderValue: renderSelectedValue
              }}
            >
              <MenuItem value='' disabled>
                Select Passport
              </MenuItem>
              {visaBookingItems.map((item, index) => (
                <MenuItem key={index} value={`${item._id}`}>
                  {`${item.passportNumber} ${item.givenName}`}
                  {/* <Checkbox checked={visaBookingIds.indexOf(item._id) > -1} />
                  <ListItemText primary={`${item.passportNumber} ${item.givenName}`} /> */}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />
        <Controller
          name='status'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              select
              fullWidth
              label='Status'
              error={Boolean(errors.status)}
              helperText={errors.status?.message}
              {...field} // Spread the field object
              SelectProps={{
                value: field.value,
                displayEmpty: true,
                onChange: e => field.onChange(e)
              }}
              sx={{ mb: 4 }}
            >
              <MenuItem value='' disabled>
                Select a Status
              </MenuItem>
              <MenuItem value='pending'>pending</MenuItem>
              <MenuItem value='booked'>booked</MenuItem>
              <MenuItem value='inprocess'>inprocess</MenuItem>
              <MenuItem value='verification'>verification</MenuItem>
              <MenuItem value='approved'>approved</MenuItem>
              <MenuItem value='rejected'>rejected</MenuItem>
              <MenuItem value='returned'>returned</MenuItem>
              <MenuItem value='cancelled'>cancelled</MenuItem>
              <MenuItem value='inprocessCancelled'>inprocessCancelled</MenuItem>
              <MenuItem value='paid'>paid</MenuItem>
            </CustomTextField>
          )}
        />
        <CustomTextField
          select
          fullWidth
          sx={{ mb: 6 }}
          label='Destination'
          SelectProps={{
            value: findVisa.destination,
            displayEmpty: true,
            onChange: e => setFindVisa({ ...findVisa, destination: e.target.value })
          }}
        >
          <MenuItem value='' disabled>
            Select a destination
          </MenuItem>
          {destination?.length > 0 &&
            destination.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item?.name}
              </MenuItem>
            ))}
        </CustomTextField>

        <CustomTextField
          select
          fullWidth
          sx={{ mb: 6 }}
          label='Category'
          SelectProps={{
            value: findVisa.category,
            displayEmpty: true,
            onChange: e => setFindVisa({ ...findVisa, category: e.target.value })
          }}
        >
          <MenuItem value='' disabled>
            Select a category
          </MenuItem>
          {category?.length > 0 &&
            category.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item?.name}
              </MenuItem>
            ))}
        </CustomTextField>

        <CustomTextField
          select
          fullWidth
          sx={{ mb: 6 }}
          label='Type'
          SelectProps={{
            value: findVisa.type,
            displayEmpty: true,
            onChange: e => setFindVisa({ ...findVisa, type: e.target.value })
          }}
        >
          <MenuItem value='' disabled>
            Select a type
          </MenuItem>
          {type?.length > 0 &&
            type.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item?.name}
              </MenuItem>
            ))}
        </CustomTextField>

        <CustomTextField
          select
          fullWidth
          sx={{ mb: 6 }}
          label='Duration'
          SelectProps={{
            value: findVisa.duration,
            displayEmpty: true,
            onChange: e => setFindVisa({ ...findVisa, duration: e.target.value })
          }}
        >
          <MenuItem value='' disabled>
            Select a duration
          </MenuItem>
          {duration?.length > 0 &&
            duration.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item?.name}
              </MenuItem>
            ))}
        </CustomTextField>

        {selectVisaId()}

        {/* {visaServiceFields.map((item: any) => {
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
                    error={Boolean(errors[name as keyof typeof defaultValues])}
                    helperText={
                      (errors[name as keyof typeof defaultValues]?.message as string) || ''
                    }
                  />
                )}
              />
            </>
          )
        })} */}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type='submit' variant='contained' color='primary' sx={{ mr: 3 }}>
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

export default EditVisaBookingForm
