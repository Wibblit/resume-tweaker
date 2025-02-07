"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
import { useTheme } from "next-themes";
import { updateBlogPost } from "@/actions/updateblog";
import { useToast } from "@/hooks/use-toast";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published: boolean;
  tags: string[];
  thumbnail: string;
  isFeatured: boolean;
}

const categories = [
  "Web Development",
  "Technology",
  "Programming",
  "Design",
  "AI",
  "Data Science",
  "Cybersecurity",
];

const MAX_SLUG_LENGTH = 60;

export default function EditBlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { theme } = useTheme();
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  console.log(slug)

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`/api/get-blogs/${slug}`);
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch blog data");
        }
        const data = await response.json();
        setBlogData(data);
        setImagePreview(data.thumbnail);
      } catch (err) {
        setError(
          "An error occurred while fetching the blog post. Please try again."
        );
        console.error("Error fetching blog data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      const newTitle = value;
      const newSlug = generateSlug(newTitle);

      if (newSlug.length <= MAX_SLUG_LENGTH) {
        setBlogData((prevData) => ({
          ...prevData!,
          title: newTitle,
          slug: newSlug,
        }));
        setSlugError("");
      } else {
        setBlogData((prevData) => ({
          ...prevData!,
          title: newTitle,
          slug: "",
        }));
        setSlugError(
          `Title generates a slug that exceeds ${MAX_SLUG_LENGTH} characters. Please provide a custom slug.`
        );
      }
    } else if (name === "slug") {
      const newSlug = value.slice(0, MAX_SLUG_LENGTH);
      setBlogData((prevData) => ({ ...prevData!, [name]: newSlug }));
      setSlugError(
        value.length > MAX_SLUG_LENGTH
          ? `Slug exceeds ${MAX_SLUG_LENGTH} characters`
          : ""
      );
    } else {
      setBlogData((prevData) => ({ ...prevData!, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setBlogData((prevData) => ({ ...prevData!, category: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setBlogData((prevData) => ({ ...prevData!, tags }));
  };

  const handleContentChange = useCallback((content: string) => {
    setBlogData((prevData) => ({ ...prevData!, content }));
  }, []);

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogData((prevData) => ({ ...prevData!, published: e.target.checked }));
  };

  const handleIsFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogData((prevData) => ({ ...prevData!, isFeatured: e.target.checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBlogData((prevData) => ({ ...prevData!, thumbnail: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!blogData) {
        throw new Error("No blog data to update");
      }

      const result = await updateBlogPost(
        blogData.id,
        blogData.title,
        blogData.slug,
        blogData.excerpt,
        blogData.content,
        blogData.category,
        blogData.author,
        blogData.thumbnail,
        blogData.published,
        blogData.tags,
        blogData.isFeatured
      );
       if (result.status === 429) {
         toast({
           title: "Whoa there! You've hit the rate limit.",
           description: "Please slow down and try again in a few minutes.",
           variant: "destructive",
         });
         return;
       }

      if (result.success) {
        console.log("Blog post updated successfully:", result.blogPost);
        router.push("/blogs");
      } else {
        throw new Error(result.message || "Failed to update blog post");
      }
    } catch (err) {
      console.error("Error updating blog post:", err);
      setError(
        "An error occurred while updating the blog post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-8 mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="w-full h-12 mb-4" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        <Skeleton className="w-full h-40 mb-4" />
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-1/2 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-8 mx-auto px-4 py-8 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="container mt-8 mx-auto px-4 py-8 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The requested blog post could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-8 mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Blog Post</CardTitle>
          <CardDescription>
            Update the details of your blog post
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
                value={blogData.title}
                onChange={handleInputChange}
                required
              />
              <div className="text-sm text-muted-foreground">
                {blogData.title.length} / {MAX_SLUG_LENGTH} characters
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                className="input"
                placeholder="Slug will be generated from title"
                value={blogData.slug}
                onChange={handleInputChange}
                required
                maxLength={MAX_SLUG_LENGTH}
              />
              {slugError && (
                <div className="text-sm text-red-500">{slugError}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                className="input"
                placeholder="Enter a brief excerpt"
                value={blogData.excerpt}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <SunEditor
                setContents={blogData.content}
                onChange={handleContentChange}
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["removeFormat"],
                    ["fontColor", "hiliteColor"],
                    ["indent", "outdent"],
                    ["align", "horizontalRule", "list", "table"],
                    ["link", "image", "video"],
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview"],
                  ],
                  minHeight: "300px",
                  height: "auto",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryr">Category</Label>
              <Input
                id="category"
                name="category"
                className="input"
                value={blogData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                className="input"
                value={blogData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Cover Image</Label>
              {imagePreview && (
                <div className="mb-2">
                  <img
                    src={imagePreview}
                    alt="Cover image preview"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                className="input"
                placeholder="Enter tags, separated by commas"
                value={blogData.tags.join(", ")}
                onChange={handleTagsChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={blogData.isFeatured}
                onChange={handleIsFeaturedChange}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <Label htmlFor="isFeatured">Feature this post</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={blogData.published}
                onChange={handlePublishedChange}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/blogs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Blog Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </CardContent>
      </Card>
      <style jsx global>{`
        .sun-editor-editable {
          background-color: ${theme === "dark"
            ? "#1f2937"
            : "#ffffff"} !important;
          color: ${theme === "dark" ? "#ffffff" : "#000000"} !important;
        }
        .sun-editor-editable table {
          border-collapse: collapse;
          width: 100%;
        }

        .sun-editor-editable table td,
        .sun-editor-editable table th {
          border: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
          padding: 8px;
        }
        .sun-editor-editable img {
          max-width: 100%;
          height: auto;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .sun-editor-editable strong {
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  );
}