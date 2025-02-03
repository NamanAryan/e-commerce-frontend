import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

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

const ProductCard = ({ id, title, price, image, rating }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); 

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart({
        productId: id.toString(),
        title: title,
        image: image,
        quantity: 1,
        price: price,
      });
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="relative group cursor-pointer"
    >
      <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
        <div className="relative h-48 w-full bg-gray-100 p-4">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
            {title}
          </h3>

          <div className="flex items-center space-x-1 mb-2">
            <Rating value={rating.rate} precision={0.1} size="small" readOnly />
            <span className="text-sm text-gray-500">({rating.count})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">
              ${price.toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              className="relative inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full
                overflow-hidden transition-all duration-300 ease-in-out
                hover:bg-indigo-700 hover:shadow-lg hover:scale-105
                group focus:outline-none"
            >
              <span className="relative text-sm font-semibold transform transition-transform duration-300 group-hover:translate-x-1">
                Add to Cart
              </span>
              <svg
                className="w-4 h-4 transform transition-all duration-300
                  group-hover:translate-x-1 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
