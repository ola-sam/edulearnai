import React from "react";
import type { Block } from "@/pages/KidsCode";
import { Trash2, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CanvasProps {
  blocks: Block[];
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (block: Block) => void;
}

const Canvas: React.FC<CanvasProps> = ({ blocks, onRemoveBlock, onUpdateBlock }) => {
  // Helper function to render a single block
  const renderBlock = (block: Block) => {
    return (
      <div 
        key={block.id}
        className="mb-2 border-l-4 rounded-md shadow-sm"
        style={{ borderLeftColor: block.color }}
      >
        <div className="p-3 flex items-center justify-between rounded-md" style={{ backgroundColor: block.color + '20' }}>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: block.color }}></div>
            <span className="font-medium">{block.label}</span>
          </div>
          <div className="flex space-x-1">
            {block.properties && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Edit Block Properties</h4>
                    {Object.entries(block.properties).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-5 items-center gap-2">
                        <label htmlFor={`${block.id}-${key}`} className="col-span-2 text-sm font-medium capitalize">
                          {key}:
                        </label>
                        <Input
                          id={`${block.id}-${key}`}
                          className="col-span-3"
                          value={value as string | number}
                          onChange={(e) => {
                            const newValue = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
                            const updatedBlock = {
                              ...block,
                              properties: {
                                ...block.properties,
                                [key]: newValue
                              },
                              label: block.label.replace(String(value), String(newValue))
                            };
                            onUpdateBlock(updatedBlock);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onRemoveBlock(block.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Render children blocks if this is a container block (like repeat or forever) */}
        {block.children && (
          <div className="pl-4 my-1">
            {block.children.map(childBlock => renderBlock(childBlock))}
            {block.children.length === 0 && (
              <div className="p-2 border border-dashed rounded-md text-center text-muted-foreground text-sm">
                Drag blocks here
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full p-4 border rounded-md space-y-2 min-h-[400px]">
      {blocks.length === 0 ? (
        <div className="h-full flex items-center justify-center border-2 border-dashed rounded-md">
          <div className="text-center text-muted-foreground">
            <p>Drag and drop blocks here to start coding</p>
            <p className="text-sm">Use the blocks palette on the left</p>
          </div>
        </div>
      ) : (
        blocks.map(block => renderBlock(block))
      )}
    </div>
  );
};

export default Canvas;