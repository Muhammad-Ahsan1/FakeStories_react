import { useState, useEffect } from 'react';
import { Button, Modal, Box, Container, Grid, TextField, Typography } from '@mui/material';
import StoryCard from './StoryCard';

const BASE_URL = "https://usmanlive.com/wp-json/api/stories/";


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [stories, setStories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStory, setCurrentStory] = useState({ id: null, title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [newId, setNewId] = useState('')

  useEffect(() => {
    fetchStories();
  }, [currentStory]);

  const fetchStories = async () => {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    setStories(data);
  };

  const handleAddStory = async () => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: currentStory.title, content: currentStory.content }),
    });
    const newStory = await response.json();
    setStories([...stories, newStory]);
    setShowAddModal(false);
    setNewId(newStory.story_id)
  };

  const handleEditStory = async () => {
    const response = await fetch(`${BASE_URL}${currentStory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: currentStory.title, content: currentStory.content }),
    });
    const updatedStory = await response.json();
    setStories(stories.map(story => story.id === updatedStory.id ? updatedStory : story));
    setShowEditModal(false);
  };

  const handleDeleteStory = async (id) => {
    await fetch(`${BASE_URL}${id}`, { method: 'DELETE' });
    setStories(stories.filter(story => story.id !== id));
  };

  const filteredStories = stories.filter(story => {
    const title = story.title?.toLowerCase() ?? '';
    const content = story.content?.toLowerCase() ?? '';
    const searchTermLower = searchTerm.toLowerCase();
    return title.includes(searchTermLower) || content.includes(searchTermLower);
  });

  return (
    <Container>
      <Box my={3} display='flex' justifyContent='space-between'>
        <TextField
          label="Search stories..."
          variant="outlined"
          sx={{width:'400px'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentStory({ id: null, title: '', content: '' });
            setShowAddModal(true);
          }}
        >
          Add Story
        </Button>
      </Box>
      <Grid container spacing={3}>
        {filteredStories.map((story, index) =>(
          <Grid item key={index} id={story.id || newId} xs={12} sm={6} md={4}>
            <StoryCard
              story={story}
              onEdit={() => {
                setCurrentStory(story);
                setShowEditModal(true);
              }}
              onDelete={() => {
                handleDeleteStory(story.id);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add Story Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">Add Story</Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={currentStory.title}
            onChange={(e) =>
              setCurrentStory({ ...currentStory, title: e.target.value })}
          />
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={currentStory.content}
            onChange={(e) => setCurrentStory({ ...currentStory, content: e.target.value })}
          />
          <Box mt={2} display={'flex'} justifyContent={"flex-end"}>
            <Button variant="contained" color="primary" onClick={handleAddStory}>Save Changes</Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Story Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">Edit Story</Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={currentStory.title}
            onChange={(e) => setCurrentStory({ ...currentStory, title: e.target.value })}
          />
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={currentStory.content}
            onChange={(e) => setCurrentStory({ ...currentStory, content: e.target.value })}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleEditStory}>Save Changes</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default App;
