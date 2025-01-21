// src/components/common/SearchBar.tsx
import { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  Container,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const flags = [
    { code: 'us', flag: '🇺🇸', name: 'English (US)' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano' },
    { code: 'cn', flag: '🇨🇳', name: '中文' },
    { code: 'jp', flag: '🇯🇵', name: '日本語' },
    { code: 'kr', flag: '🇰🇷', name: '한국어' }
  ];

const SearchBar = ({ setSearchQuery }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('us');

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

  const handleCountryChange = (event: SelectChangeEvent) => {
    setCountry(event.target.value);
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
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                '& input': {
                  padding: '8px 0',
                }
              }}
              placeholder="Search products..."
              value={query}
              onChange={handleInputChange}
            />
            
            {query && (
              <IconButton 
                sx={{ p: '10px' }}
                aria-label="clear"
                onClick={handleClear}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Paper>

          <Select
  value={country}
  onChange={handleCountryChange}
  variant="standard"
  sx={{ 
    minWidth: 150, // Increased width to accommodate text
    bgcolor: 'white',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    px: 1,
    '& .MuiSelect-select': {
      py: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      fontSize: '0.9rem'
    },
    '&:before, &:after': {
      display: 'none'
    }
  }}
>
  {flags.map((f) => (
    <MenuItem 
      key={f.code} 
      value={f.code}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{f.flag}</span>
      <span>{f.name}</span>
    </MenuItem>
  ))}
</Select>

        </Box>
      </Container>
    </Box>
  );
};

export default SearchBar;