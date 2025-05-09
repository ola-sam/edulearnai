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
      isPublic: false,
      description: ""  // Adding empty description to match schema requirements
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
    // When coming from code mode, make sure to set isPlaying to true first
    if (editMode === "code") {
      setIsPlaying(true);
      setEditMode("play");
      return;
    }
    
    // When already in play mode, just toggle the playing state
    setIsPlaying(!isPlaying);
  };

  // Stop execution
  const stopExecution = () => {
    setIsPlaying(false);
    setEditMode("code");
  };

  return (
    <div className="container mx-auto py-4 space-y-4 kidscode-container">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl shadow-md">
        <div>
          <h1 className="kidscode-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">KidsCode Studio</h1>
          <p className="text-muted-foreground font-baloo">Create your own stories and games with blocks!</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={createNewProject}
            className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-purple-500 to-indigo-500 border-none"
          >
            <Plus className="h-5 w-5 mr-1" /> New Project
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={saveProject}
            disabled={!user || createProjectMutation.isPending || updateProjectMutation.isPending}
            className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-blue-500 to-cyan-500 border-none"
          >
            <Save className="h-5 w-5 mr-1" /> Save Project
          </Button>
          {editMode === "code" ? (
            <Button
              variant="default"
              size="lg"
              onClick={togglePlay}
              className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-green-500 to-emerald-500 border-none"
            >
              <Play className="h-5 w-5 mr-1" /> Run
            </Button>
          ) : (
            <>
              {isPlaying ? (
                <Button
                  variant="default"
                  size="lg"
                  onClick={togglePlay}
                  className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-amber-500 to-yellow-500 border-none"
                >
                  <Pause className="h-5 w-5 mr-1" /> Pause
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={togglePlay}
                  className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-green-500 to-emerald-500 border-none"
                >
                  <Play className="h-5 w-5 mr-1" /> Play
                </Button>
              )}
              <Button
                variant="default"
                size="lg"
                onClick={stopExecution}
                className="kidscode-button kidscode-hover-bounce bg-gradient-to-r from-red-500 to-rose-500 border-none"
              >
                <Square className="h-5 w-5 mr-1" /> Stop
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/4">
          <Card className="kidscode-card border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="font-baloo text-2xl text-purple-700">My Project</CardTitle>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project Title"
                className="mt-2 font-baloo text-lg rounded-xl border-2 border-purple-200"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-baloo font-bold text-lg text-purple-700">Saved Projects</h3>
              {userProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground font-baloo">No projects yet. Create one!</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userProjects.map((project: Project) => (
                    <div
                      key={project.id}
                      className="p-3 border-2 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors font-baloo kidscode-hover-bounce border-purple-200"
                      onClick={() => loadProject(project)}
                    >
                      <p className="font-medium truncate text-purple-700">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(project.updatedAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {editMode === "code" && (
            <Card className="mt-4 kidscode-card border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="font-baloo text-2xl text-blue-700">Blocks</CardTitle>
                <CardDescription className="font-baloo">Drag blocks to build your story!</CardDescription>
              </CardHeader>
              <CardContent>
                <BlockPalette onBlockSelected={addBlock} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-full lg:w-2/4">
          {editMode === "code" ? (
            <Card className="h-[500px] md:h-[600px] flex flex-col kidscode-card border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                <CardTitle className="font-baloo text-2xl text-green-700">Code Canvas</CardTitle>
                <CardDescription className="font-baloo">Arrange blocks to create your story!</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto bg-white/50">
                <Canvas
                  blocks={blocks}
                  onRemoveBlock={removeBlock}
                  onUpdateBlock={updateBlock}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[500px] md:h-[600px] flex flex-col kidscode-card border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-xl">
                <CardTitle className="font-baloo text-2xl text-amber-700">Play Area</CardTitle>
                <CardDescription className="font-baloo">Watch your story come to life!</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl">
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

        <div className="w-full lg:w-1/4">
          <Tabs defaultValue="characters">
            <TabsList className="w-full rounded-xl font-baloo">
              <TabsTrigger value="characters" className="w-1/2 rounded-l-xl text-base">Characters</TabsTrigger>
              <TabsTrigger value="backgrounds" className="w-1/2 rounded-r-xl text-base">Backgrounds</TabsTrigger>
            </TabsList>
            <TabsContent value="characters">
              <Card className="kidscode-card border-rose-200">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="font-baloo text-2xl text-rose-700">Characters</CardTitle>
                  <CardDescription className="font-baloo">Choose who's in your story!</CardDescription>
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
              <Card className="kidscode-card border-cyan-200">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-xl">
                  <CardTitle className="font-baloo text-2xl text-cyan-700">Backgrounds</CardTitle>
                  <CardDescription className="font-baloo">Pick a place for your story!</CardDescription>
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
            <Card className="mt-4 kidscode-card border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-t-xl">
                <CardTitle className="font-baloo text-2xl text-indigo-700">My Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCharacters.map((character) => (
                    <div key={character.id} className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-indigo-100 kidscode-hover-bounce">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-indigo-50 mr-3 shadow-sm">
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="font-baloo text-indigo-700">{character.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCharacter(character.id)}
                        className="rounded-full hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
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