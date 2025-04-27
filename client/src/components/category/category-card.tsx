import { Link } from "wouter";
import { Category } from "@shared/schema";
import { 
  Heart, 
  GraduationCap, 
  Users, 
  Gift, 
  Paintbrush, 
  type LucideIcon 
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

// Map of icon names to their Lucide components
const iconMap: Record<string, LucideIcon> = {
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'users': Users,
  'gift': Gift,
  'paint-brush': Paintbrush,
};

export function CategoryCard({ category }: CategoryCardProps) {
  // Get the icon component, defaulting to Heart if not found
  const IconComponent = iconMap[category.iconName] || Heart;
  
  return (
    <Link href={`/campaigns?category=${encodeURIComponent(category.name)}`}>
      <a className="category-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`w-12 h-12 ${category.backgroundColor} rounded-full flex items-center justify-center mb-3`}>
          <IconComponent className={`h-6 w-6 ${category.textColor}`} />
        </div>
        <span className="font-medium text-center">{category.name}</span>
      </a>
    </Link>
  );
}
