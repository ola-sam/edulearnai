import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Block } from "@/pages/KidsCode";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlockPaletteProps {
  onBlockSelected: (block: Block) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onBlockSelected }) => {
  const [activeCategory, setActiveCategory] = useState<string>("events");

  // Define the block categories
  const categories = [
    { id: "events", name: "Events", color: "#FFD500" },
    { id: "motion", name: "Motion", color: "#4C97FF" },
    { id: "looks", name: "Looks", color: "#9966FF" },
    { id: "control", name: "Control", color: "#FFAB19" },
  ];

  // Define blocks for each category
  const blocksByCategory: Record<string, Block[]> = {
    events: [
      {
        id: "event_start_block",
        type: "events_when_start",
        category: "events",
        label: "When program starts",
        color: "#FFD500",
        next: null
      },
    ],
    motion: [
      {
        id: "motion_move_block",
        type: "motion_move_steps",
        category: "motion",
        label: "Move 10 steps",
        color: "#4C97FF",
        properties: { steps: 10 },
        next: null
      },
      {
        id: "motion_turn_right_block",
        type: "motion_turn_right",
        category: "motion",
        label: "Turn right 15 degrees",
        color: "#4C97FF",
        properties: { degrees: 15 },
        next: null
      },
      {
        id: "motion_turn_left_block",
        type: "motion_turn_left",
        category: "motion",
        label: "Turn left 15 degrees",
        color: "#4C97FF",
        properties: { degrees: 15 },
        next: null
      },
      {
        id: "motion_goto_xy_block",
        type: "motion_goto_xy",
        category: "motion",
        label: "Go to x: 0 y: 0",
        color: "#4C97FF",
        properties: { x: 0, y: 0 },
        next: null
      },
    ],
    looks: [
      {
        id: "looks_say_block",
        type: "looks_say",
        category: "looks",
        label: "Say 'Hello!'",
        color: "#9966FF",
        properties: { message: "Hello!" },
        next: null
      },
      {
        id: "looks_think_block",
        type: "looks_think",
        category: "looks",
        label: "Think 'Hmm...'",
        color: "#9966FF",
        properties: { message: "Hmm..." },
        next: null
      },
      {
        id: "looks_show_block",
        type: "looks_show",
        category: "looks",
        label: "Show",
        color: "#9966FF",
        next: null
      },
      {
        id: "looks_hide_block",
        type: "looks_hide",
        category: "looks",
        label: "Hide",
        color: "#9966FF",
        next: null
      },
    ],
    control: [
      {
        id: "control_wait_block",
        type: "control_wait",
        category: "control",
        label: "Wait 1 second",
        color: "#FFAB19",
        properties: { seconds: 1 },
        next: null
      },
      {
        id: "control_repeat_block",
        type: "control_repeat",
        category: "control",
        label: "Repeat 10 times",
        color: "#FFAB19",
        properties: { times: 10 },
        children: [],
        next: null
      },
      {
        id: "control_forever_block",
        type: "control_forever",
        category: "control",
        label: "Forever",
        color: "#FFAB19",
        children: [],
        next: null
      },
    ],
  };

  // Function to handle block selection
  const handleBlockClick = (block: Block) => {
    // Create a new block with a unique ID to avoid duplicate IDs
    const newBlockId = uuidv4();
    const newBlock: Block = {
      ...block,
      id: newBlockId,
      children: block.children ? [] : undefined
    };
    onBlockSelected(newBlock);
    
    // Log the new block for debugging
    console.log("Added new block:", newBlock);
  };

  // Render a single block
  const renderBlock = (block: Block) => {
    return (
      <div
        key={block.id}
        className="mb-2 border-l-4 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-105"
        style={{ borderLeftColor: block.color }}
        onClick={() => handleBlockClick(block)}
      >
        <div 
          className="p-3 flex items-center rounded-md"
          style={{ backgroundColor: block.color + '20' }}
        >
          <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: block.color }}></div>
          <span className="font-medium">{block.label}</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Tabs 
        defaultValue={categories[0].id} 
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="space-y-4"
      >
        <TabsList className="w-full grid grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              style={{ 
                borderBottom: activeCategory === category.id ? `2px solid ${category.color}` : 'none' 
              }}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {blocksByCategory[category.id].map((block) => renderBlock(block))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BlockPalette;