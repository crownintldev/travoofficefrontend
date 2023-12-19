// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

const CardInfluencer = () => {
  return (
    <Card>
      <CardHeader title='Influencing The Influencer' />
      <CardContent>
        <Typography sx={{ mb: 3.25, color: 'text.secondary' }}>
          Computers have become ubiquitous in almost every facet of our lives. At work, desk jockeys
          spend hours in front of their desktops, while delivery people scan bar codes with
          handhelds and workers in the field stay in touch.
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          If you’re in the market for new desktops, notebooks, or PDAs, there are a myriad of
          choices. Here’s a rundown of some of the best systems available.
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Button>Read More</Button>
      </CardActions>
    </Card>
  )
}

export default CardInfluencer
