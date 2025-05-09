import React from "react";
import type { Character } from "@/pages/KidsCode";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, CheckCircle } from "lucide-react";

// No longer needed since we're getting characters from the database

interface CharacterSelectionProps {
  characters: Character[];
  selectedCharacters: Character[];
  onAddCharacter: (character: Character) => void;
  onRemoveCharacter: (characterId: number) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  characters = [],
  selectedCharacters,
  onAddCharacter,
  onRemoveCharacter
}) => {
  // Just use the characters provided from the database
  const displayCharacters = characters;

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="grid grid-cols-2 gap-2">
        {displayCharacters.map((character) => {
          const isSelected = selectedCharacters.some(c => c.id === character.id);
          
          return (
            <div 
              key={character.id}
              className={`relative p-2 border rounded-md transition-all ${
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-gray-400'
              }`}
            >
              <div className="h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-sm mb-2">
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="h-20 w-20 object-contain"
                />
              </div>
              <p className="text-sm font-medium truncate">{character.name}</p>
              
              {isSelected ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 bg-white bg-opacity-80 h-6 w-6 rounded-full"
                  onClick={() => onRemoveCharacter(character.id)}
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 bg-white bg-opacity-80 h-6 w-6 rounded-full"
                  onClick={() => onAddCharacter(character)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default CharacterSelection;