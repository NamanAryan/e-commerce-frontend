import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
    id: number;
    name: string;
    image: string;
   
}

const CategoryCard = ({ id, name, image }: CategoryCardProps) => {  
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/category/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="relative group cursor-pointer"
        >
            <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-md transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-48 w-full bg-gray-100 p-4">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                        {name}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;