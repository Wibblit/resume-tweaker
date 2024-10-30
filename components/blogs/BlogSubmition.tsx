"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { createBlogPost } from "@/actions/createblog";

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

export default function BlogForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Wibblit",
    published: false,
    tags: [] as string[],
    image: "",
    isFeatured: false,
  });
  const [slugError, setSlugError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const editorRef = useRef<SunEditorCore>();
  const { theme } = useTheme();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editorRef.current = sunEditor;
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .sun-editor {
        border: 1px solid var(--border) !important;
        border-radius: 0.375rem;
      }
      .sun-editor .se-toolbar {
        background-color: var(--background) !important;
        border-bottom: 1px solid var(--border) !important;
        border-radius: 0.375rem 0.375rem 0 0;
      }
      .sun-editor .se-btn-tray {
        background-color: var(--background) !important;
      }
      .sun-editor .se-btn:hover {
        background-color: var(--accent) !important;
      }
      .sun-editor .se-wrapper-inner {
        background-color: var(--background) !important;
        border-radius: 0 0 0.375rem 0.375rem;
      }
      .sun-editor .se-wrapper-wysiwyg {
        color: var(--foreground) !important;
      }
      .sun-editor .se-wrapper-wysiwyg strong {
        color: var(--foreground) !important;
        font-weight: 700 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOptions({
        height: "auto",
        minHeight: "300px",
        defaultStyle: `
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
          font-size: 16px;
          color: ${theme === "dark" ? "#ffffff" : "#000000"};
          background-color: ${theme === "dark" ? "#1f2937" : "#ffffff"};
        `,
      });
    }
  }, [theme]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name === "title") {
      const newTitle = value;
      const newSlug = generateSlug(newTitle);

      if (newSlug.length <= MAX_SLUG_LENGTH) {
        setFormData((prevData) => ({
          ...prevData,
          title: newTitle,
          slug: newSlug,
        }));
        setSlugError("");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          title: newTitle,
          slug: "",
        }));
        setSlugError(
          `Title generates a slug that exceeds ${MAX_SLUG_LENGTH} characters. Please provide a custom slug.`
        );
      }
    } else if (name === "slug") {
      const newSlug = value.slice(0, MAX_SLUG_LENGTH);
      setFormData((prevData) => ({ ...prevData, [name]: newSlug }));
      setSlugError(
        value.length > MAX_SLUG_LENGTH
          ? `Slug exceeds ${MAX_SLUG_LENGTH} characters`
          : ""
      );
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag);
    setFormData((prevData) => ({ ...prevData, tags }));
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData((prevData) => ({ ...prevData, content }));
  }, []);

  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, published: e.target.checked }));
  };

  const handleIsFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, isFeatured: e.target.checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prevData) => ({ ...prevData, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.title ||
        !formData.slug ||
        !formData.content ||
        !formData.category ||
        !formData.author
      ) {
        throw new Error("Please fill in all required fields");
      }

      await createBlogPost(
        formData.title,
        formData.slug,
        formData.excerpt || null,
        formData.content,
        formData.category,
        formData.author,
        formData.image,
        formData.published,
        formData.tags,
        formData.isFeatured
      );

      console.log("Blog post submitted successfully:", formData);

      router.refresh()
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
              <div className="text-sm text-muted-foreground">
                {formData.title.length} / {MAX_SLUG_LENGTH} characters
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                className="input"
                placeholder="Slug will be generated from title"
                value={formData.slug}
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
                value={formData.excerpt}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <SunEditor
                getSunEditorInstance={getSunEditorInstance}
                setContents={formData.content}
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
            {/* <div className="space-y-2">
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
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                className="input"
                value={formData.category}
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
                value={formData.author}
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
                value={formData.tags}
                onChange={handleTagsChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
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
                checked={formData.published}
                onChange={handlePublishedChange}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <Label htmlFor="published">Publish immediately</Label>
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
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </CardContent>
      </Card>
      <style jsx global>{`
        .sun-editor-editable {
          background-color: var(--background) !important;
          color: var(--foreground) !important;
        }
        .sun-editor-editable table {
          border-collapse: collapse;
          width: 100%;
        }
        .sun-editor-editable table td,
        .sun-editor-editable table th {
          border: 1px solid var(--border);
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
        .prose img {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .prose strong {
          font-weight: 700;
          color: var(--foreground);
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
        }
        .prose table td,
        .prose table th {
          border: 1px solid var(--border);
          padding: 8px;
        }
      `}</style>
    </div>
  );
}