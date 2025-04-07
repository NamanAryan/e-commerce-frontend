// src/components/layout/Layout.tsx
import { Box } from '@mui/material';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;