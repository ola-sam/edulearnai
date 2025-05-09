import React, { useEffect, useRef, useState } from "react";
import type { Block, Character, Background } from "@/pages/KidsCode";

interface PlayAreaProps {
  blocks: Block[];
  characters: Character[];
  background: Background | null;
  isPlaying: boolean;
}

interface CharacterState {
  id: number;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  visible: boolean;
  saying: string | null;
  thinking: string | null;
}

const PlayArea: React.FC<PlayAreaProps> = ({
  blocks,
  characters,
  background,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [characterStates, setCharacterStates] = useState<CharacterState[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentSpeechBubbles, setCurrentSpeechBubbles] = useState<Record<number, { type: "say" | "think", text: string }>>({});

  // Initialize character states when characters change
  useEffect(() => {
    if (characters.length > 0) {
      setCharacterStates(
        characters.map((character) => ({
          id: character.id,
          name: character.name,
          imageUrl: character.imageUrl,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          visible: true,
          saying: null,
          thinking: null
        }))
      );
    }
  }, [characters]);

  // Execute blocks when isPlaying changes to true
  useEffect(() => {
    if (isPlaying && !isExecuting) {
      executeBlocks();
    }
  }, [isPlaying, blocks]);

  // Helper to get the execution starting blocks (event blocks)
  const getStartingBlocks = () => {
    return blocks.filter(block => block.type === "events_when_start");
  };

  // Helper to find a block by ID
  const findBlockById = (id: string): Block | undefined => {
    const searchBlock = (blocks: Block[]): Block | undefined => {
      for (const block of blocks) {
        if (block.id === id) return block;
        if (block.children) {
          const found = searchBlock(block.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return searchBlock(blocks);
  };

  // Helper to get the next block to execute
  const getNextBlock = (currentBlock: Block): Block | undefined => {
    if (currentBlock.next) {
      return findBlockById(currentBlock.next);
    }
    return undefined;
  };

  // Simple interpreter to execute blocks
  const executeBlocks = async () => {
    setIsExecuting(true);
    
    // Reset character states
    setCharacterStates(prevStates => 
      prevStates.map(state => ({
        ...state,
        x: 0,
        y: 0,
        rotation: 0,
        visible: true,
        saying: null,
        thinking: null
      }))
    );
    
    setCurrentSpeechBubbles({});
    
    // Get starting blocks
    const startingBlocks = getStartingBlocks();
    
    // For each starting block, execute its sequence
    for (const startBlock of startingBlocks) {
      await executeBlockSequence(startBlock);
    }
    
    setIsExecuting(false);
  };

  // Execute a sequence of blocks starting from the given block
  const executeBlockSequence = async (block: Block | undefined) => {
    if (!block) return;
    
    // Execute the current block
    await executeBlock(block);
    
    // If this is a container block, execute its children
    if (block.children && block.children.length > 0) {
      if (block.type === "control_repeat" && block.properties?.times) {
        const times = block.properties.times as number;
        for (let i = 0; i < times; i++) {
          for (const childBlock of block.children) {
            await executeBlockSequence(childBlock);
          }
        }
      } else if (block.type === "control_forever") {
        // For demo purposes, we'll just execute "forever" blocks a few times
        for (let i = 0; i < 3; i++) {
          for (const childBlock of block.children) {
            await executeBlockSequence(childBlock);
          }
        }
      }
    }
    
    // Execute the next block
    const nextBlock = getNextBlock(block);
    if (nextBlock) {
      await executeBlockSequence(nextBlock);
    }
  };

  // Execute a single block
  const executeBlock = async (block: Block): Promise<void> => {
    // Apply to the first character for now (in a real implementation, we'd track which character is active)
    if (characterStates.length === 0) return Promise.resolve();
    
    const characterId = characterStates[0].id;
    
    switch (block.type) {
      case "motion_move_steps":
        const steps = block.properties?.steps as number || 10;
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              const radians = (state.rotation - 90) * (Math.PI / 180);
              return {
                ...state,
                x: state.x + steps * Math.cos(radians),
                y: state.y + steps * Math.sin(radians)
              };
            }
            return state;
          })
        );
        break;
        
      case "motion_turn_right":
        const degreesRight = block.properties?.degrees as number || 15;
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              return {
                ...state,
                rotation: state.rotation + degreesRight
              };
            }
            return state;
          })
        );
        break;
        
      case "motion_turn_left":
        const degreesLeft = block.properties?.degrees as number || 15;
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              return {
                ...state,
                rotation: state.rotation - degreesLeft
              };
            }
            return state;
          })
        );
        break;
        
      case "motion_goto_xy":
        const x = block.properties?.x as number || 0;
        const y = block.properties?.y as number || 0;
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              return {
                ...state,
                x,
                y
              };
            }
            return state;
          })
        );
        break;
        
      case "looks_say":
        const sayMessage = block.properties?.message as string || "Hello!";
        setCurrentSpeechBubbles(prev => ({
          ...prev,
          [characterId]: { type: "say", text: sayMessage }
        }));
        break;
        
      case "looks_think":
        const thinkMessage = block.properties?.message as string || "Hmm...";
        setCurrentSpeechBubbles(prev => ({
          ...prev,
          [characterId]: { type: "think", text: thinkMessage }
        }));
        break;
        
      case "looks_show":
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              return {
                ...state,
                visible: true
              };
            }
            return state;
          })
        );
        break;
        
      case "looks_hide":
        setCharacterStates(prevStates => 
          prevStates.map(state => {
            if (state.id === characterId) {
              return {
                ...state,
                visible: false
              };
            }
            return state;
          })
        );
        break;
        
      case "control_wait":
        const seconds = block.properties?.seconds as number || 1;
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        break;
        
      // Other block types would be handled here
    }
    
    // Small delay between blocks for visual effect
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  // Render a speech bubble
  const renderSpeechBubble = (characterId: number, type: "say" | "think", text: string) => {
    return (
      <div className={`absolute p-2 bg-white rounded-lg ${type === "say" ? "rounded-bl-none" : "rounded-bl-lg"} shadow-md max-w-[150px] text-sm`}>
        {text}
        {type === "say" && (
          <div className="absolute bottom-0 left-0 transform translate-y-full border-8 border-transparent border-t-white border-r-white"></div>
        )}
      </div>
    );
  };

  return (
    <div ref={canvasRef} className="relative w-full h-full overflow-hidden rounded-md">
      {/* Background */}
      {background ? (
        <div className="absolute inset-0">
          <img
            src={background.imageUrl}
            alt={background.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-950"></div>
      )}
      
      {/* Characters */}
      {characterStates.map((character) => (
        character.visible && (
          <div
            key={character.id}
            className="absolute transition-all duration-200"
            style={{
              left: `calc(50% + ${character.x}px)`,
              top: `calc(50% + ${character.y * -1}px)`,
              transform: `translate(-50%, -50%) rotate(${character.rotation}deg) scale(${character.scale})`,
            }}
          >
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-20 h-20 object-contain"
            />
            
            {/* Speech bubble */}
            {currentSpeechBubbles[character.id] && (
              <div className="absolute top-0 left-1/2 transform -translate-y-full -translate-x-1/2">
                {renderSpeechBubble(
                  character.id,
                  currentSpeechBubbles[character.id].type,
                  currentSpeechBubbles[character.id].text
                )}
              </div>
            )}
          </div>
        )
      ))}
      
      {/* Coordinate grid for reference (only in edit mode) */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-black dark:border-white"></div>
        <div className="absolute top-1/2 left-0 right-0 border-t border-black dark:border-white"></div>
      </div>
    </div>
  );
};

export default PlayArea;