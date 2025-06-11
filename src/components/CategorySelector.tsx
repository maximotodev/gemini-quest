import React from "react";
import { categories } from "../constants";
import Button from "./Button";

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
  disabled,
}) => {
  return (
    <div className="space-y-4 animate-slide-in-bottom">
      <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">
        Choose Your Challenge!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onSelectCategory(category)}
            variant="neutral"
            className="hover:bg-brand-secondary focus:ring-brand-secondary"
            disabled={disabled}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
