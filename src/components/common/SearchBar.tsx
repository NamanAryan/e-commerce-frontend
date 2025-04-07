// src/components/common/SearchBar.tsx
import { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  Container,
  
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ setSearchQuery }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchQuery(newQuery);
  };


  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: '#f8f9fa',
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 2
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
  <Paper
    component="form"
    onSubmit={handleSubmit}
    sx={{
      p: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder="Search..."
      inputProps={{ 'aria-label': 'search' }}
      value={query}
      onChange={handleInputChange}
    />
    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
      <SearchIcon />
    </IconButton>
    <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleClear}>
      <ClearIcon />
    </IconButton>
  </Paper>
</Box>
      </Container>
    </Box>
  );
};

export default SearchBar;