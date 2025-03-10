
import React, { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/use-toast";

interface PropertyImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface PropertyMediaManagerProps {
  images: PropertyImage[];
  onImagesChange: (images: PropertyImage[]) => void;
}

export function PropertyMediaManager({ 
  images = [], 
  onImagesChange 
}: PropertyMediaManagerProps) {
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);
  const [altText, setAltText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Mock upload - in a real application, you would upload to a server/storage
    setIsUploading(true);
    
    // Create an array to hold our new image objects
    const newImages: PropertyImage[] = [];
    
    // Process each file
    Array.from(files).forEach((file, index) => {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      
      // Create a unique ID (in production, this would come from the server)
      const id = `img_${Date.now()}_${index}`;
      
      // Add to our new images array
      newImages.push({
        id,
        url: imageUrl,
        altText: file.name,
        isPrimary: images.length === 0 && index === 0 // Make first image primary if no images exist
      });
    });
    
    // After "upload", update the images array by combining existing and new
    setTimeout(() => {
      onImagesChange([...images, ...newImages]);
      setIsUploading(false);
      toast({
        title: "Images uploaded",
        description: `${newImages.length} image(s) have been added.`,
      });
      
      // Reset the input so the same file can be selected again
      e.target.value = "";
    }, 1000);
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If removing the primary image, set a new one if available
    if (images.find(img => img.id === imageId)?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesChange(updatedImages);
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
      setAltText("");
    }
  };

  const handleSelectImage = (image: PropertyImage) => {
    setSelectedImage(image);
    setAltText(image.altText || "");
  };

  const handleSetPrimary = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    
    onImagesChange(updatedImages);
    toast({
      title: "Primary image set",
      description: "The selected image is now the primary image for this property.",
    });
  };

  const handleUpdateAltText = () => {
    if (!selectedImage) return;
    
    const updatedImages = images.map(img => 
      img.id === selectedImage.id 
        ? { ...img, altText } 
        : img
    );
    
    onImagesChange(updatedImages);
    toast({
      title: "Image updated",
      description: "The image description has been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
        <CardDescription>
          Upload and manage images of your property
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-center border-2 border-dashed border-input rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition">
            <label className="cursor-pointer text-center">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="font-semibold text-sm">
                  Click to upload images
                </div>
                <div className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP files up to 5MB
                </div>
              </div>
              <Input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group rounded-md overflow-hidden border ${
                    image.isPrimary ? "ring-2 ring-primary" : ""
                  } ${
                    selectedImage?.id === image.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleSelectImage(image)}
                >
                  <AspectRatio ratio={4/3}>
                    <img
                      src={image.url}
                      alt={image.altText || "Property image"}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(image.id);
                      }}
                    >
                      {image.isPrimary ? "Primary" : "Set as Primary"}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-destructive/80 absolute top-1 right-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {image.isPrimary && (
                    <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {images.length === 0 && !isUploading && (
            <div className="border rounded-md p-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No images uploaded yet</p>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="border rounded-md p-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-10 w-10 rounded-full border-4 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading images...</p>
              </div>
            </div>
          )}
        </div>
        
        {selectedImage && (
          <div className="border rounded-md p-4 mt-4">
            <div className="text-sm font-semibold mb-2">Edit Image Details</div>
            <div className="flex flex-col space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  Image Description
                </label>
                <Input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image"
                />
              </div>
              <Button onClick={handleUpdateAltText} size="sm">
                Update Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} uploaded
        </p>
      </CardFooter>
    </Card>
  );
}
