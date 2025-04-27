import { useState, useEffect } from "react";
import { Category } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface CampaignFiltersProps {
  categories: Category[];
  selectedCategory: string;
  sortOption: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export function CampaignFilters({
  categories,
  selectedCategory,
  sortOption,
  searchQuery,
  onCategoryChange,
  onSortChange,
  onSearchChange,
  isLoading = false
}: CampaignFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Input
          type="search"
          placeholder="Search campaigns..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-40" />
          </>
        ) : (
          <>
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={sortOption}
              onValueChange={onSortChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort: Newest</SelectItem>
                <SelectItem value="oldest">Sort: Oldest</SelectItem>
                <SelectItem value="most-funded">Sort: Most Funded</SelectItem>
                <SelectItem value="least-funded">Sort: Least Funded</SelectItem>
                <SelectItem value="target-amount">Sort: Target Amount</SelectItem>
                <SelectItem value="progress">Sort: Progress</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );
}
