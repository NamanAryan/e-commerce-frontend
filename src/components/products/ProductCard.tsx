// src/components/ProductCard.tsx
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ 
          objectFit: 'contain',
          p: 2,
          bgcolor: 'white'
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${price}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Rating: {rating.rate} ({rating.count} reviews)
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" fullWidth>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;