import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types'

function StoryCard({ story, onEdit, onDelete }) {
  return (
    <Card sx={{ minWidth: 275, margin: '16px', padding: '12px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {story.title}
        </Typography>
        <Typography variant="body2">
          {story.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" color="primary" onClick={onEdit}>Edit</Button>
        <Button size="small" variant="outlined" color="error" onClick={onDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
}

StoryCard.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    story: PropTypes.object,
}

export default StoryCard;