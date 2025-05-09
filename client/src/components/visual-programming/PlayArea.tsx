import React, { useEffect, useRef, useState } from "react";
import type { Block, Character, Background } from "@/pages/KidsCode";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [characterStates, setCharacterStates] = useState<CharacterState[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentSpeechBubbles, setCurrentSpeechBubbles] = useState<Record<number, { type: "say" | "think", text: string }>>({});

  // Initialize character states when characters change
  useEffect(() => {
    if (characters.length > 0) {
      console.log("Initializing characters:", characters);
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
  
  // Calculate grid cell size for 30x30 grid
  const getGridCellSize = () => {
    if (canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      return {
        width: width / 30,
        height: height / 30
      };
    }
    return { width: 10, height: 10 }; // Default fallback
  };
  
  // Convert grid position to pixel position
  const gridToPixels = (gridPos: number) => {
    const cellSize = getGridCellSize();
    return gridPos * cellSize.width;
  };
  
  // Log character states when they change for debugging
  useEffect(() => {
    console.log("Character states updated:", characterStates);
  }, [characterStates]);

  // Execute blocks when isPlaying changes to true
  useEffect(() => {
    console.log("isPlaying changed:", isPlaying, "isExecuting:", isExecuting, "blocks:", blocks);
    if (isPlaying && !isExecuting && blocks.length > 0) {
      console.log("Starting execution of blocks");
      executeBlocks();
    }
  }, [isPlaying, isExecuting, blocks]); // Added blocks to the dependency array

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
    console.log("executeBlocks() called");
    setIsExecuting(true);
    
    // Reset character states
    setCharacterStates(prevStates => {
      console.log("Resetting character states:", prevStates);
      return prevStates.map(state => ({
        ...state,
        x: 0,
        y: 0,
        rotation: 0,
        visible: true,
        saying: null,
        thinking: null
      }));
    });
    
    setCurrentSpeechBubbles({});
    
    // Get starting blocks
    const startingBlocks = getStartingBlocks();
    console.log("Starting blocks found:", startingBlocks);
    
    // For each starting block, execute its sequence
    if (startingBlocks.length === 0) {
      console.warn("No starting blocks found. Add a 'When program starts' block.");
      toast({
        title: "No Starting Block",
        description: "Add a 'When program starts' block from the Events tab to begin your program.",
        variant: "destructive"
      });
    } else {
      for (const startBlock of startingBlocks) {
        console.log("Executing sequence from block:", startBlock);
        await executeBlockSequence(startBlock);
      }
    }
    
    console.log("Execution completed");
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
    
    console.log(`Executing block: ${block.type}`, block.properties);
    
    switch (block.type) {
      case "motion_move_up":
        // Move up by a fixed amount of pixels
        const upSteps = 50; // Move 50 pixels up
        
        await new Promise<void>(resolve => {
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          
          // Target is current position plus movement up (negative y)
          const targetY = startState.y + upSteps;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    y: startState.y + (targetY - startState.y) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_move_down":
        // Move down by a fixed amount of pixels
        const downSteps = 50; // Move 50 pixels down
        
        await new Promise<void>(resolve => {
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          
          // Target is current position plus movement down (positive y)
          const targetY = startState.y - downSteps;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    y: startState.y + (targetY - startState.y) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_move_left":
        // Move left by a fixed amount of pixels
        const leftSteps = 50; // Move 50 pixels left
        
        await new Promise<void>(resolve => {
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          
          // Target is current position plus movement left (negative x)
          const targetX = startState.x - leftSteps;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    x: startState.x + (targetX - startState.x) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_move_right":
        // Move right by a fixed amount of pixels
        const rightSteps = 50; // Move 50 pixels right
        
        await new Promise<void>(resolve => {
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          
          // Target is current position plus movement right (positive x)
          const targetX = startState.x + rightSteps;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    x: startState.x + (targetX - startState.x) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
      case "motion_move_steps":
        // Convert steps to grid-based coordinate system
        // Use a larger multiplier to make each step more visible
        const stepSize = 20; // 1 step = 20 pixels (much bigger movement)
        const steps = (block.properties?.steps as number || 10) * stepSize;
        
        await new Promise<void>(resolve => {
          // Animate the movement smoothly
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          const radians = (startState.rotation - 90) * (Math.PI / 180);
          
          // Calculate target position on grid
          const targetX = startState.x + steps * Math.cos(radians);
          const targetY = startState.y + steps * Math.sin(radians);
          
          // Constrain movement to stay within reasonable grid boundaries
          // Expanded the range to -150 to 150 to allow more movement range
          const constrainedX = Math.min(Math.max(targetX, -150), 150);
          const constrainedY = Math.min(Math.max(targetY, -150), 150);
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    x: startState.x + (constrainedX - startState.x) * progress,
                    y: startState.y + (constrainedY - startState.y) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_turn_right":
        const degreesRight = block.properties?.degrees as number || 15;
        await new Promise<void>(resolve => {
          // Animate the rotation smoothly
          const startTime = Date.now();
          const duration = 300; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          const targetRotation = startState.rotation + degreesRight;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    rotation: startState.rotation + (targetRotation - startState.rotation) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_turn_left":
        const degreesLeft = block.properties?.degrees as number || 15;
        await new Promise<void>(resolve => {
          // Animate the rotation smoothly
          const startTime = Date.now();
          const duration = 300; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          const targetRotation = startState.rotation - degreesLeft;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    rotation: startState.rotation + (targetRotation - startState.rotation) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "motion_goto_xy":
        // Use expanded grid coordinates for more range
        // Convert from grid coordinates to pixel positions with a multiplier
        const posMultiplier = 10; // Multiply coordinate values for larger movement
        const gridX = Math.min(Math.max(Math.round(block.properties?.x as number || 0), -15), 15) * posMultiplier;
        const gridY = Math.min(Math.max(Math.round(block.properties?.y as number || 0), -15), 15) * posMultiplier;
        
        await new Promise<void>(resolve => {
          // Animate the movement smoothly
          const startTime = Date.now();
          const duration = 500; // animation duration in ms
          const startState = {...characterStates.find(state => state.id === characterId)!};
          
          // Target x,y in our coordinate system (center is 0,0)
          const targetX = gridX;
          const targetY = gridY;
          
          const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setCharacterStates(prevStates => 
              prevStates.map(state => {
                if (state.id === characterId) {
                  return {
                    ...state,
                    x: startState.x + (targetX - startState.x) * progress,
                    y: startState.y + (targetY - startState.y) * progress
                  };
                }
                return state;
              })
            );
            
            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              resolve();
            }
          };
          
          requestAnimationFrame(animateStep);
        });
        break;
        
      case "looks_say":
        const sayMessage = block.properties?.message as string || "Hello!";
        setCurrentSpeechBubbles(prev => ({
          ...prev,
          [characterId]: { type: "say", text: sayMessage }
        }));
        // Keep the speech bubble visible for a while
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
        
      case "looks_think":
        const thinkMessage = block.properties?.message as string || "Hmm...";
        setCurrentSpeechBubbles(prev => ({
          ...prev,
          [characterId]: { type: "think", text: thinkMessage }
        }));
        // Keep the thought bubble visible for a while
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        await new Promise(resolve => setTimeout(resolve, 300));
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
        await new Promise(resolve => setTimeout(resolve, 300));
        break;
        
      case "control_wait":
        const seconds = block.properties?.seconds as number || 1;
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        break;
        
      // Other block types would be handled here
      default:
        console.log(`Unknown block type: ${block.type}`);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
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
            className="absolute"
            style={{
              left: `calc(50% + ${character.x}px)`,
              top: `calc(50% + ${character.y * -1}px)`,
              transform: `translate(-50%, -50%) rotate(${character.rotation}deg) scale(${character.scale})`,
              transition: "none", // Remove automatic transitions to enable manual animation
            }}
          >
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-20 h-20 object-contain"
            />
            
            {/* Speech bubble */}
            {currentSpeechBubbles[character.id] && (
              <div className="absolute top-0 left-1/2 transform -translate-y-full -translate-x-1/2 z-10">
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
      
      {/* 30x30 Grid System */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {/* Generate 30 vertical grid lines */}
        {Array.from({ length: 31 }).map((_, i) => (
          <div 
            key={`v-${i}`} 
            className="absolute top-0 bottom-0 border-l border-gray-300 dark:border-gray-700" 
            style={{ left: `${(i / 30) * 100}%`, opacity: i % 5 === 0 ? 0.4 : 0.2 }}
          ></div>
        ))}
        
        {/* Generate 30 horizontal grid lines */}
        {Array.from({ length: 31 }).map((_, i) => (
          <div 
            key={`h-${i}`} 
            className="absolute left-0 right-0 border-t border-gray-300 dark:border-gray-700" 
            style={{ top: `${(i / 30) * 100}%`, opacity: i % 5 === 0 ? 0.4 : 0.2 }}
          ></div>
        ))}
      </div>
      
      {/* Coordinate grid for reference (only in edit mode) */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-black dark:border-white"></div>
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-black dark:border-white"></div>
      </div>
    </div>
  );
};

export default PlayArea;