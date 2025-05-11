import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Plus, Video, Link as LinkIcon, FileText, Youtube } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define types for our resources
interface TeachingResource {
  id: number;
  title: string;
  description: string | null;
  resourceType: string;
  resourceUrl: string;
  thumbnailUrl: string | null;
  teacherId: number;
  classId: number | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface ClassOption {
  id: number;
  name: string;
}

// YouTube video component with responsive sizing
const YouTubeEmbed: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

// Extract YouTube video ID from URL
const extractYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Form schema for creating/editing resources
const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  resourceType: z.string().default("youtube"),
  resourceUrl: z.string().url("Please enter a valid URL"),
  classId: z.number().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

const TeacherResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<TeachingResource | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);

  // Query to get teacher's resources
  const { data: resources = [], isLoading: resourcesLoading } = useQuery<TeachingResource[]>({
    queryKey: ['/api/teacher/resources'],
    enabled: !!user?.isTeacher,
  });

  // Query to get teacher's classes for the dropdown
  const { data: classes = [] } = useQuery<ClassOption[]>({
    queryKey: ['/api/teacher/classes'],
    enabled: !!user?.isTeacher,
  });

  // Form for creating/editing resources
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      resourceType: "youtube",
      resourceUrl: "",
      classId: null,
      tags: [],
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ResourceFormValues) => {
      return apiRequest('POST', '/api/teacher/resources', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/resources'] });
      toast({
        title: "Resource created",
        description: "Your teaching resource has been created successfully",
      });
      setOpen(false);
      form.reset();
      setPreviewUrl("");
      setVideoId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResourceFormValues }) => {
      return apiRequest('PUT', `/api/teacher/resources/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/resources'] });
      toast({
        title: "Resource updated",
        description: "Your teaching resource has been updated successfully",
      });
      setOpen(false);
      setEditingResource(null);
      form.reset();
      setPreviewUrl("");
      setVideoId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/teacher/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/resources'] });
      toast({
        title: "Resource deleted",
        description: "Your teaching resource has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: ResourceFormValues) => {
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Open form dialog for editing
  const handleEdit = (resource: TeachingResource) => {
    setEditingResource(resource);
    form.reset({
      title: resource.title,
      description: resource.description || undefined,
      resourceType: resource.resourceType,
      resourceUrl: resource.resourceUrl,
      classId: resource.classId || null,
      tags: resource.tags || [],
    });
    
    // Set preview URL for YouTube videos
    if (resource.resourceType === "youtube") {
      const videoId = extractYoutubeVideoId(resource.resourceUrl);
      setVideoId(videoId);
      setPreviewUrl(resource.resourceUrl);
    }
    
    setOpen(true);
  };

  // Handle resource URL change for preview
  const handleResourceUrlChange = (url: string) => {
    form.setValue("resourceUrl", url);
    setPreviewUrl(url);
    
    if (form.getValues("resourceType") === "youtube") {
      const newVideoId = extractYoutubeVideoId(url);
      setVideoId(newVideoId);
    }
  };

  // Filter resources by type
  const youtubeResources = resources.filter(r => r.resourceType === "youtube");
  const otherResources = resources.filter(r => r.resourceType !== "youtube");

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teaching Resources</h1>
          <p className="text-muted-foreground">
            Create and manage teaching resources to share with your students
          </p>
        </div>
        <Button onClick={() => {
          setEditingResource(null);
          form.reset({
            title: "",
            description: "",
            resourceType: "youtube",
            resourceUrl: "",
            classId: null,
            tags: [],
          });
          setPreviewUrl("");
          setVideoId(null);
          setOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
          <TabsTrigger value="other">Other Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="youtube">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesLoading ? (
              <div className="col-span-full text-center py-8">Loading resources...</div>
            ) : youtubeResources.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No YouTube videos added yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    form.reset({ ...form.getValues(), resourceType: "youtube" });
                    setOpen(true);
                  }}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  Add YouTube Video
                </Button>
              </div>
            ) : (
              youtubeResources.map((resource) => {
                const videoId = extractYoutubeVideoId(resource.resourceUrl);
                return (
                  <Card key={resource.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video relative bg-muted">
                      {videoId ? (
                        <YouTubeEmbed videoId={videoId} title={resource.title} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(resource)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this resource?')) {
                                deleteMutation.mutate(resource.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {resource.description && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {resource.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      {resource.classId ? (
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {classes.find(c => c.id === resource.classId)?.name || 'Class'}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Available to all classes</span>
                      )}
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="other">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesLoading ? (
              <div className="col-span-full text-center py-8">Loading resources...</div>
            ) : otherResources.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No other resources added yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    form.reset({ ...form.getValues(), resourceType: "link" });
                    setOpen(true);
                  }}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Resource Link
                </Button>
              </div>
            ) : (
              otherResources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(resource)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this resource?')) {
                              deleteMutation.mutate(resource.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      {resource.resourceType === 'link' ? (
                        <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <a 
                        href={resource.resourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate"
                      >
                        {resource.resourceUrl}
                      </a>
                    </div>
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {resource.classId ? (
                      <span className="text-xs text-muted-foreground">
                        Assigned to: {classes.find(c => c.id === resource.classId)?.name || 'Class'}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Available to all classes</span>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 sticky top-0 bg-background z-10">
            <DialogTitle className="text-xl">{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              Add a teaching resource to share with your students.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
              <FormField
                control={form.control}
                name="resourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Resource Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset preview when type changes
                        setPreviewUrl("");
                        setVideoId(null);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="youtube" className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          <span>YouTube Video</span>
                        </SelectItem>
                        <SelectItem value="link" className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span>Web Link</span>
                        </SelectItem>
                        <SelectItem value="document" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Document</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter resource title" 
                        {...field}
                        className="h-10" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resource description" 
                        {...field} 
                        value={field.value || ""} 
                        className="min-h-[100px] resize-y"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about this resource to help students understand its purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="resourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {form.getValues("resourceType") === "youtube" 
                        ? "YouTube URL" 
                        : "Resource URL"}
                    </FormLabel>
                    <div className="flex gap-2 items-start">
                      <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center rounded-l-md border bg-muted">
                        {form.getValues("resourceType") === "youtube" ? (
                          <Youtube className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <FormControl className="flex-grow">
                        <Input 
                          placeholder={form.getValues("resourceType") === "youtube" 
                            ? "https://www.youtube.com/watch?v=..." 
                            : "https://..."}
                          {...field}
                          onChange={(e) => handleResourceUrlChange(e.target.value)}
                          className="h-10 rounded-l-none pl-3"
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="mt-1.5">
                      {form.getValues("resourceType") === "youtube" 
                        ? "Paste the full YouTube URL from the address bar or share button" 
                        : "Enter the URL where this resource is located"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.getValues("resourceType") === "youtube" && previewUrl && videoId && (
                <div className="pt-4">
                  <div className="bg-muted/20 p-2 rounded-t-md border border-b-0">
                    <Label className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Preview
                    </Label>
                  </div>
                  <div className="rounded-b-md overflow-hidden border">
                    <YouTubeEmbed videoId={videoId} title="Video Preview" />
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Assign to Class (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                      value={field.value?.toString() || "null"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Available to all classes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null" className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Available to all classes</span>
                        </SelectItem>
                        <Separator className="my-2" />
                        {classes.length > 0 ? classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()} className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{cls.name}</span>
                          </SelectItem>
                        )) : (
                          <div className="px-2 py-2 text-sm text-muted-foreground">
                            No classes available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="mt-1.5">
                      If selected, this resource will only be visible to the specified class
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4 sticky bottom-0 bg-background z-10 border-t mt-6 -mx-6 px-6 pb-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setOpen(false);
                    setEditingResource(null);
                    form.reset();
                    setPreviewUrl("");
                    setVideoId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="ml-2 px-6"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Resource"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherResourcesPage;