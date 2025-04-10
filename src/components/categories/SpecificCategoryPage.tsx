// src/components/categories/SpecificCategoryPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Product {
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

interface Category {
  id: number;
  name: string;
}

const SpecificCategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  
  // Get categoryId from route parameter
  const categoryId = Number(id);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // First, fetch all categories to get the category name
        const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await categoriesResponse.json();
        
        // Map categories to match the format used in CategoryPage
        const mappedCategories = categories.map((category: string, index: number) => ({
          id: index + 1,
          name: category.charAt(0).toUpperCase() + category.slice(1)
        }));
        
        // Find the category by ID
        const categoryObj = mappedCategories.find((cat: Category) => cat.id === categoryId);
        
        if (!categoryObj) {
          console.error('Category not found');
          return;
        }
        
        setCategoryName(categoryObj.name);
        
        // Use the original category name (lowercase) for the API request
        const categoryForApi = categories[categoryId - 1];
        
        // Fetch products for this category
        const productsResponse = await fetch(`https://fakestoreapi.com/products/category/${categoryForApi}`);
        const data = await productsResponse.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/categories')}
              className="mr-4 p-2 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-extrabold">
              {categoryName || 'Loading category...'}
            </h1>
          </div>
        </div>
        {/* Wave Separator */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50 fill-current" viewBox="0 0 1440 48">
            <path d="M0 48h1440V0c-196 23-432 38-720 38C432 38 196 23 0 0v48z"></path>
          </svg>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600">No products found in this category</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 h-64 flex items-center justify-center bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating.rate} ({product.rating.count})
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 h-18">
                    {product.description}
                  </p>
                  <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificCategoryPage;