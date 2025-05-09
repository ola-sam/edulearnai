import React from "react";
import type { Background } from "@/pages/KidsCode";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, X } from "lucide-react";

// Default backgrounds if none are provided from the server
const DEFAULT_BACKGROUNDS: Background[] = [
  {
    id: 1,
    name: "Blue Sky",
    imageUrl: "https://assets.scratch.mit.edu/618be8d160ded6f99a611aed_static_blue_sky.svg",
    isPublic: true,
    tags: ["nature", "sky"]
  },
  {
    id: 2,
    name: "City",
    imageUrl: "https://assets.scratch.mit.edu/618be8d160ded6f99a611aed_static_city.svg",
    isPublic: true,
    tags: ["urban", "buildings"]
  },
  {
    id: 3,
    name: "Desert",
    imageUrl: "https://assets.scratch.mit.edu/618be8d160ded6f99a611aed_static_desert.svg",
    isPublic: true,
    tags: ["nature", "hot"]
  },
  {
    id: 4,
    name: "Forest",
    imageUrl: "https://assets.scratch.mit.edu/618be8d160ded6f99a611aed_static_forest.svg",
    isPublic: true,
    tags: ["nature", "trees"]
  },
  {
    id: 5,
    name: "Space",
    imageUrl: "https://assets.scratch.mit.edu/618be8d160ded6f99a611aed_static_space.svg",
    isPublic: true,
    tags: ["cosmos", "stars"]
  }
];

interface BackgroundSelectionProps {
  backgrounds: Background[];
  selectedBackground: Background | null;
  onSelectBackground: (background: Background | null) => void;
}

const BackgroundSelection: React.FC<BackgroundSelectionProps> = ({
  backgrounds = [],
  selectedBackground,
  onSelectBackground
}) => {
  // Use default backgrounds if none are provided
  const displayBackgrounds = backgrounds.length > 0 ? backgrounds : DEFAULT_BACKGROUNDS;

  return (
    <div>
      {selectedBackground && (
        <div className="mb-4 p-2 border rounded-md relative">
          <div className="h-36 w-full overflow-hidden rounded-sm">
            <img
              src={selectedBackground.imageUrl}
              alt={selectedBackground.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-1 text-sm font-medium">Current: {selectedBackground.name}</p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 bg-white bg-opacity-80 h-6 w-6 rounded-full"
            onClick={() => onSelectBackground(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="h-[240px] pr-4">
        <div className="space-y-2">
          {displayBackgrounds.map((background) => {
            const isSelected = selectedBackground?.id === background.id;
            
            return (
              <div 
                key={background.id}
                className={`relative p-2 border rounded-md transition-all ${
                  isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-gray-400'
                }`}
                onClick={() => !isSelected && onSelectBackground(background)}
              >
                <div className="h-24 w-full overflow-hidden rounded-sm">
                  <img
                    src={background.imageUrl}
                    alt={background.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-sm font-medium">{background.name}</p>
                
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-white bg-opacity-80 h-6 w-6 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BackgroundSelection;