import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Download, Save, Play, Pause, Square, Plus, Trash2 } from "lucide-react";

import BlockPalette from "@/components/visual-programming/BlockPalette";
import Canvas from "@/components/visual-programming/Canvas";
import CharacterSelection from "@/components/visual-programming/CharacterSelection";
import BackgroundSelection from "@/components/visual-programming/BackgroundSelection";
import PlayArea from "@/components/visual-programming/PlayArea";

// Types for our visual programming blocks
export interface Block {
  id: string;
  type: string;
  category: string;
  label: string;
  icon?: string;
  color: string;
  properties?: Record<string, any>;
  children?: Block[];
  next?: string | null;
}

// Types for sprites/characters
export interface Character {
  id: number;
  name: string;
  imageUrl: string;
  isPublic: boolean;
  tags?: string[];
}

// Types for backgrounds
export interface Background {
  id: number;
  name: string;
  imageUrl: string;
  isPublic: boolean;
  tags?: string[];
}

// Types for project
export interface Project {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  thumbnail?: string;
  blocks: Block[];
  assets: {
    characters: Character[];
    background?: Background;
  };
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const KidsCode: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<"code" | "play">("code");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>("My Project");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Query for user's existing projects
  const { data: userProjects = [] } = useQuery({
    queryKey: ["/api/visual-projects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/visual-projects?userId=${user.id}`);
      return response.json();
    },
    enabled: !!user
  });

  // Query for shared/public characters
  const { data: publicCharacters = [] } = useQuery({
    queryKey: ["/api/visual-sprites"],
    queryFn: async () => {
      const response = await fetch("/api/visual-sprites");
      return response.json();
    }
  });

  // Query for shared/public backgrounds
  const { data: publicBackgrounds = [] } = useQuery({
    queryKey: ["/api/visual-backgrounds"],
    queryFn: async () => {
      const response = await fetch("/api/visual-backgrounds");
      return response.json();
    }
  });

  // Mutations for saving projects
  const createProjectMutation = useMutation({
    mutationFn: async (project: Project) => {
      return apiRequest("/api/visual-projects", "POST", project);
    },
    onSuccess: () => {
      toast({
        title: "Project saved!",
        description: "Your project has been saved successfully."
      });
      // Invalidate the projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/visual-projects", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error saving project",
        description: "There was a problem saving your project. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving project:", error);
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (project: Project) => {
      if (!project.id) throw new Error("Project ID is required for updates");
      return apiRequest(`/api/visual-projects/${project.id}`, "PUT", project);
    },
    onSuccess: () => {
      toast({
        title: "Project updated!",
        description: "Your project has been updated successfully."
      });
      // Invalidate the projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/visual-projects", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error updating project",
        description: "There was a problem updating your project. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating project:", error);
    }
  });

  // Load a project
  const loadProject = (project: Project) => {
    setActiveProject(project);
    setBlocks(project.blocks);
    setSelectedCharacters(project.assets.characters || []);
    setSelectedBackground(project.assets.background || null);
    setProjectTitle(project.title);
  };

  // Create a new project
  const createNewProject = () => {
    setActiveProject(null);
    setBlocks([]);
    setSelectedCharacters([]);
    setSelectedBackground(null);
    setProjectTitle("My New Project");
  };

  // Save the current project
  const saveProject = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save projects.",
        variant: "destructive"
      });
      return;
    }

    const projectData: Project = {
      userId: user.id,
      title: projectTitle,
      blocks: blocks,
      assets: {
        characters: selectedCharacters,
        background: selectedBackground || undefined
      },
      isPublic: false
    };

    if (activeProject?.id) {
      // Update existing project
      updateProjectMutation.mutate({
        ...projectData,
        id: activeProject.id
      });
    } else {
      // Create new project
      createProjectMutation.mutate(projectData);
    }
  };

  // Add a block to the canvas
  const addBlock = (block: Block) => {
    setBlocks((prevBlocks) => [...prevBlocks, block]);
  };

  // Remove a block from the canvas
  const removeBlock = (blockId: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== blockId));
  };

  // Update a block in the canvas
  const updateBlock = (updatedBlock: Block) => {
    setBlocks((prevBlocks) => 
      prevBlocks.map(block => block.id === updatedBlock.id ? updatedBlock : block)
    );
  };

  // Add a character to the project
  const addCharacter = (character: Character) => {
    if (!selectedCharacters.some(c => c.id === character.id)) {
      setSelectedCharacters((prev) => [...prev, character]);
    }
  };

  // Remove a character from the project
  const removeCharacter = (characterId: number) => {
    setSelectedCharacters((prev) => prev.filter(c => c.id !== characterId));
  };

  // Set the background for the project
  const setBackground = (background: Background | null) => {
    setSelectedBackground(background);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setEditMode("play");
    }
  };

  // Stop execution
  const stopExecution = () => {
    setIsPlaying(false);
    setEditMode("code");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">KidsCode Programming Studio</h1>
          <p className="text-muted-foreground">Create interactive stories and games with blocks!</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={createNewProject}
          >
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={saveProject}
            disabled={!user || createProjectMutation.isPending || updateProjectMutation.isPending}
          >
            <Save className="h-4 w-4 mr-1" /> Save Project
          </Button>
          {editMode === "code" ? (
            <Button
              variant="default"
              size="sm"
              onClick={togglePlay}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-1" /> Run
            </Button>
          ) : (
            <>
              {isPlaying ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={togglePlay}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Pause className="h-4 w-4 mr-1" /> Pause
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={togglePlay}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-1" /> Play
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={stopExecution}
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-1" /> Stop
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-1/4 pr-4">
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project Title"
                className="mt-2"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">My Projects</h3>
              {userProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet. Create one!</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userProjects.map((project: Project) => (
                    <div
                      key={project.id}
                      className="p-2 border rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => loadProject(project)}
                    >
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(project.updatedAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {editMode === "code" && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Blocks</CardTitle>
                <CardDescription>Drag blocks to the canvas</CardDescription>
              </CardHeader>
              <CardContent>
                <BlockPalette onBlockSelected={addBlock} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-2/4 px-2">
          {editMode === "code" ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Code Canvas</CardTitle>
                <CardDescription>Arrange your blocks here</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto">
                <Canvas
                  blocks={blocks}
                  onRemoveBlock={removeBlock}
                  onUpdateBlock={updateBlock}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Play Area</CardTitle>
                <CardDescription>Watch your code run!</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-md">
                <PlayArea
                  blocks={blocks}
                  characters={selectedCharacters}
                  background={selectedBackground}
                  isPlaying={isPlaying}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-1/4 pl-4">
          <Tabs defaultValue="characters">
            <TabsList className="w-full">
              <TabsTrigger value="characters" className="w-1/2">Characters</TabsTrigger>
              <TabsTrigger value="backgrounds" className="w-1/2">Backgrounds</TabsTrigger>
            </TabsList>
            <TabsContent value="characters">
              <Card>
                <CardHeader>
                  <CardTitle>Characters</CardTitle>
                  <CardDescription>Add characters to your story</CardDescription>
                </CardHeader>
                <CardContent>
                  <CharacterSelection
                    characters={publicCharacters}
                    selectedCharacters={selectedCharacters}
                    onAddCharacter={addCharacter}
                    onRemoveCharacter={removeCharacter}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="backgrounds">
              <Card>
                <CardHeader>
                  <CardTitle>Backgrounds</CardTitle>
                  <CardDescription>Choose a background for your story</CardDescription>
                </CardHeader>
                <CardContent>
                  <BackgroundSelection
                    backgrounds={publicBackgrounds}
                    selectedBackground={selectedBackground}
                    onSelectBackground={setBackground}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {editMode === "code" && selectedCharacters.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Selected Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedCharacters.map((character) => (
                    <div key={character.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-2">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span>{character.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCharacter(character.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KidsCode;