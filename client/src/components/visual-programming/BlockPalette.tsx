import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Block } from "@/pages/KidsCode";

// Define block categories
const BLOCK_CATEGORIES = [
  { id: "motion", name: "Motion", color: "#4C97FF" },
  { id: "looks", name: "Looks", color: "#9966FF" },
  { id: "sound", name: "Sound", color: "#CF63CF" },
  { id: "control", name: "Control", color: "#FFAB19" },
  { id: "events", name: "Events", color: "#FFBF00" },
];

// Define block types
const BLOCK_TYPES: Record<string, Block[]> = {
  motion: [
    {
      id: "motion_move_steps",
      type: "motion_move_steps",
      category: "motion",
      label: "Move 10 steps",
      color: "#4C97FF",
      properties: { steps: 10 },
      next: null,
    },
    {
      id: "motion_turn_right",
      type: "motion_turn_right",
      category: "motion",
      label: "Turn right 15 degrees",
      color: "#4C97FF",
      properties: { degrees: 15 },
      next: null,
    },
    {
      id: "motion_turn_left",
      type: "motion_turn_left",
      category: "motion",
      label: "Turn left 15 degrees",
      color: "#4C97FF",
      properties: { degrees: 15 },
      next: null,
    },
    {
      id: "motion_goto_xy",
      type: "motion_goto_xy",
      category: "motion",
      label: "Go to x: 0, y: 0",
      color: "#4C97FF",
      properties: { x: 0, y: 0 },
      next: null,
    },
  ],
  looks: [
    {
      id: "looks_say",
      type: "looks_say",
      category: "looks",
      label: "Say Hello!",
      color: "#9966FF",
      properties: { message: "Hello!" },
      next: null,
    },
    {
      id: "looks_think",
      type: "looks_think",
      category: "looks",
      label: "Think Hmm...",
      color: "#9966FF",
      properties: { message: "Hmm..." },
      next: null,
    },
    {
      id: "looks_show",
      type: "looks_show",
      category: "looks",
      label: "Show",
      color: "#9966FF",
      next: null,
    },
    {
      id: "looks_hide",
      type: "looks_hide",
      category: "looks",
      label: "Hide",
      color: "#9966FF",
      next: null,
    },
  ],
  sound: [
    {
      id: "sound_play",
      type: "sound_play",
      category: "sound",
      label: "Play sound meow",
      color: "#CF63CF",
      properties: { sound: "meow" },
      next: null,
    },
    {
      id: "sound_stop",
      type: "sound_stop",
      category: "sound",
      label: "Stop all sounds",
      color: "#CF63CF",
      next: null,
    },
  ],
  control: [
    {
      id: "control_wait",
      type: "control_wait",
      category: "control",
      label: "Wait 1 second",
      color: "#FFAB19",
      properties: { seconds: 1 },
      next: null,
    },
    {
      id: "control_repeat",
      type: "control_repeat",
      category: "control",
      label: "Repeat 10 times",
      color: "#FFAB19",
      properties: { times: 10 },
      children: [],
      next: null,
    },
    {
      id: "control_forever",
      type: "control_forever",
      category: "control",
      label: "Forever",
      color: "#FFAB19",
      children: [],
      next: null,
    },
  ],
  events: [
    {
      id: "events_when_start",
      type: "events_when_start",
      category: "events",
      label: "When program starts",
      color: "#FFBF00",
      next: null,
    },
    {
      id: "events_when_clicked",
      type: "events_when_clicked",
      category: "events",
      label: "When character clicked",
      color: "#FFBF00",
      next: null,
    },
  ],
};

interface BlockPaletteProps {
  onBlockSelected: (block: Block) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onBlockSelected }) => {
  const handleBlockClick = (block: Block) => {
    // Create a new block with a unique ID
    const newBlock = {
      ...block,
      id: `${block.type}_${Math.random().toString(36).substring(2, 9)}`
    };
    
    // If the block has children, make sure each child has a unique ID too
    if (newBlock.children && newBlock.children.length > 0) {
      newBlock.children = newBlock.children.map(child => ({
        ...child,
        id: `${child.type}_${Math.random().toString(36).substring(2, 9)}`
      }));
    }
    
    onBlockSelected(newBlock);
  };

  return (
    <Tabs defaultValue={BLOCK_CATEGORIES[0].id} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-2">
        {BLOCK_CATEGORIES.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="text-xs"
            style={{ backgroundColor: category.color + '40' }}
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {BLOCK_CATEGORIES.map(category => (
        <TabsContent key={category.id} value={category.id} className="space-y-2">
          {BLOCK_TYPES[category.id]?.map((block, index) => (
            <div
              key={index}
              className="p-2 rounded-md cursor-pointer transition-all hover:brightness-95 hover:scale-105"
              style={{ backgroundColor: block.color }}
              onClick={() => handleBlockClick(block)}
            >
              <p className="text-white text-sm font-medium">{block.label}</p>
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BlockPalette;