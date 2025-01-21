import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Rating } from '@mui/material';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductCard = ({ title, price, description, image, rating }: ProductCardProps) => {
  return (
    <Card 
      sx={{ 
        height: '100%', // Changed from fixed height to 100%
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        },
        m: 2,
        borderRadius: 2
      }}
    >
      <Box sx={{ height: 180, p: 2, backgroundColor: '#f8f9fa' }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, pb: 1 }}> {/* Reduced bottom padding */}
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            mb: 1,
            lineHeight: 1.4,
            minHeight: '2.8em',  // Ensure consistent height for title
          }}
        >
          {title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: '0.875rem',
            mb: 2,
            minHeight: '3em',  // Ensure consistent height for description
          }}
        >
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </Typography>

        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
            mb: 1
          }}
        >
          ${price.toFixed(2)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating 
            value={rating.rate} 
            precision={0.1} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary">
            ({rating.count})
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}> {/* Added mt: 'auto' */}
        <Button 
          variant="contained" 
          fullWidth 
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;