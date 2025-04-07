import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

interface Category {
  id: number;
  name: string;
  image: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data: string[]) => {
       
        const categoryObjects = data.map((category, index) => ({
          id: index + 1,
          name: category.charAt(0).toUpperCase() + category.slice(1), 
          image: getCategoryImage(category) 
        }));
        setCategories(categoryObjects);
      })
      .catch((error) => console.error("Error fetching categories:", error))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryImage = (category: string): string => {
    const categoryImages = {
      "electronics": "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      "jewelery": "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
      "men's clothing": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      "women's clothing": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"
    }[category] || "";   
    return categoryImages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Categories</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;