// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { FormHelperText } from '@mui/material'

const TabBilling = ({
  cardDetails,
  setCardDetails,
  customErr,
  name,
  setName,
  cvc,
  setCvc,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry
}) => {
  const [focus, setFocus] = useState()
  // Validation function to check if all fields are filled

  // if (name !== '' && cardNumber !== '' && expiry !== '' && cvc !== '') {
  //   setValue({
  //     cardHolderName: name,
  //     cardNumber: cardNumber,
  //     expiry: expiry,
  //     cvc: cvc
  //   })
  // } else {
  //   setIsError(true)
  // }

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    } else if (target.name === 'name') {
      setName(target.value)
    }

    setCardDetails({
      ...cardDetails,
      [target.name]: target.value
    })
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sx={{ pt: theme => ['0 !important', `${theme.spacing(6)} !important`] }}>
        <CardWrapper sx={{ '& .rccs': { m: '0 auto', display: { xs: 'none', sm: 'block' } } }}>
          <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
        </CardWrapper>
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          name='number'
          value={cardNumber}
          autoComplete='off'
          label='Card Number'
          onBlur={handleBlur}
          inputProps={{ maxLength: '19' }}
          onChange={handleInputChange}
          placeholder='0000 0000 0000 0000'
          onFocus={e => setFocus(e.target.name)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          name='name'
          value={name}
          autoComplete='off'
          // onBlur={handleBlur}
          label='Name on Card'
          placeholder='John Doe'
          onChange={handleInputChange}
          onFocus={e => setFocus(e.target.name)}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <CustomTextField
          fullWidth
          name='expiry'
          label='Expiry'
          value={expiry}
          onBlur={handleBlur}
          placeholder='MM/YY'
          onChange={handleInputChange}
          inputProps={{ maxLength: '5' }}
          onFocus={e => setFocus(e.target.name)}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <CustomTextField
          fullWidth
          name='cvc'
          label='CVC'
          value={cvc}
          autoComplete='off'
          inputProps={{ maxLength: '3' }}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onFocus={e => setFocus(e.target.name)}
          placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
        />
      </Grid>
      <Grid item xs={12}>
        {customErr && (
          <FormHelperText
            id='validation-basic-radio'
            sx={{
              mx: 0,
              color: 'error.main',
              fontSize: theme => theme.typography.body2.fontSize
            }}
          >
            This field is required
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label='Save Card for future billing?'
          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
        />
      </Grid>
    </Grid>
  )
}

export default TabBilling
