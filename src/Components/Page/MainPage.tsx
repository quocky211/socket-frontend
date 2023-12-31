import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const MainPage = () => {
  return (
    <Box>
      <Typography variant="h6">Các chức năng </Typography>
      <Box mt={5}>
        <Link to="/todolist">
          <Button variant="contained">To DO LIST APP</Button>
        </Link>
      </Box>
    </Box>
  );
}

export default MainPage
