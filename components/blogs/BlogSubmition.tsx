"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { RichInput } from "../TextEditor";

const categories = [
  "Web Development",
  "Technology",
  "Programming",
  "Design",
  "AI",
  "Data Science",
  "Cybersecurity",
];

export default function BlogForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image: null as File | null,
      author: "Wibblit",
    });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({ ...prevData, image: e.target.files![0] }));
    }
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData((prevData) => ({ ...prevData, content }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (
        !formData.title ||
        !formData.excerpt ||
        !formData.content ||
        !formData.category ||
        !formData.image
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Create FormData object to handle file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitData.append(key, value);
        }
      });

      // Assuming you have an API function to submit the form data
      // await submitBlogPost(submitData)

      router.push("/blogs");
    } catch (error) {
      console.error("Error submitting blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-8 mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/blogs"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all blogs
      </Link>
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create New Blog Post</CardTitle>
          <CardDescription>
            Fill in the details for your new blog post
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                className="input"
                placeholder="Enter the title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                className="input"
                placeholder="Enter a brief excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichInput content={formData.content} onContentChange={handleContentChange} />
              {/* <div className="mt-4 border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <RichTextRenderer content={formData.content} />
              </div> */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger className="input">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                className="input"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Cover Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                  className="flex-grow input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload image</span>
                </Button>
              </div>
              {formData.image && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected file: {formData.image.name}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/blogs">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Blog Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
