"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Code as CodeIcon,
  CodeBlock as CodeBlockIcon,
  HighlighterCircle,
  Image as ImageIcon,
  KeyReturn,
  LinkSimple,
  ListBullets,
  ListNumbers,
  Minus,
  Paragraph as ParagraphIcon,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextAUnderline,
  TextB,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import {
  Editor,
  EditorContent,
  EditorContentProps,
  useEditor,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { forwardRef, useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Toggle } from "./ui/toggle";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { updateCredits } from "@/slices/userAssets";
import { creditList } from "@/utils/credits";
import { useAppSelector } from "@/hooks/hooks";

const InsertImageFormSchema = z.object({
  src: z.string().url("Please enter a valid URL"),
  alt: z.string().optional(),
});

type InsertImageFormValues = z.infer<typeof InsertImageFormSchema>;

type InsertImageProps = {
  onInsert: (value: InsertImageFormValues) => void;
};

const InsertImageForm = ({ onInsert }: InsertImageProps) => {
  const form = useForm<InsertImageFormValues>({
    resolver: zodResolver(InsertImageFormSchema),
    defaultValues: { src: "", alt: "" },
  });

  const onSubmit = (values: InsertImageFormValues) => {
    onInsert(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <p className="prose prose-sm prose-zinc dark:prose-invert">
          Insert an image from an external URL and use it on your resume.
        </p>

        <FormField
          name="src"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="alt"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="!mt-5 ml-auto max-w-fit">
          <Button type="submit" variant="secondary" size="sm">
            Insert Image
          </Button>
        </div>
      </form>
    </Form>
  );
};

interface AIPopoverProps {
  onSuggestionApply: (suggestion: string) => void;
  section: string;
}

function AIPopover({ onSuggestionApply, section }: AIPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const credits = useAppSelector((state) => state?.assets?.credits);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await axios.post<{
      message: string;
      statusCode: number;
      content: string;
    }>("/api/ai-assist/", {
      prompt,
      section,
    });
    if (response.status === 429) {
      toast({
        title: "Whoa there! You've hit the rate limit.",
        description: "Please slow down and try again in a few minutes.",
        variant: "destructive",
      });
      return;
    }

    if (response.data.statusCode === 402) {
      return toast({
        title: "Insufficient Credits",
        description: response?.data?.message,
        variant: "destructive",
      });
    }

    setSuggestion(response.data.content);
    dispatch(updateCredits(credits - (creditList.get("aienhance") ?? 0)));
    setIsLoading(false);
  };

  const handleApply = () => {
    onSuggestionApply(suggestion);
    setIsOpen(false);
    setSuggestion("");
    setPrompt("");
  };

  const promptRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      promptRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <Sparkles className="h-3 w-3 opacity-80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-medium">AI Suggestion</h4>
            <Input
              ref={promptRef}
              placeholder="Enter your prompt..."
              value={prompt}
              autoFocus
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <p className="flex items-center justify-center gap-1">
                  <Loader2 className="animate-spin" />
                  Generating...
                </p>
              ) : (
                "Generate"
              )}
            </Button>
          </form>
          {suggestion && (
            <div className="mt-4 space-y-2">
              <Textarea
                value={suggestion}
                readOnly
                className="min-h-[100px] whitespace-pre-wrap"
              />
              <section className="flex items-center w-full justify-between mt-4">
                <Button onClick={handleApply}>Apply Suggestion</Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setSuggestion("");
                    setPrompt("");
                  }}
                  className="bg-destructive text-destructive-foreground"
                >
                  Cancel
                </Button>
              </section>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

const Toolbar = ({ editor, section }: { editor: Editor; section: string }) => {
  const [isEnhanceLoading, setisEnhanceLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const credits = useAppSelector((state) => state?.assets?.credits);
    const { toast } = useToast();

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleEnhanceText = async () => {
    const content = editor.getHTML().replace(/<[^>]*>?/gm, "");

    if (!content.trim()) {
      return;
    }
    try {
      setisEnhanceLoading(true);
      const response = await axios.post<{
        message: string;
        statusCode: number;
        content: string;
      }>("/api/ai-assist/", {
        content,
        action: "enhance",
        section,
      });

      if (response.data.statusCode === 402) {
        return toast({
          title: "Insufficient Credits",
          description: response?.data?.message,
          variant: "destructive",
        });
      }

      editor.commands.setContent("");
      editor.commands.insertContent(response.data.content);
      setisEnhanceLoading(false);
      dispatch(updateCredits(credits - (creditList.get("aienhance") ?? 0)));
    } catch (error) {
      setisEnhanceLoading(false);
      console.error("Error enhancing text:", error);
    } finally {
      setisEnhanceLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-0.5 border p-1">
        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <TextB className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <TextItalic className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <TextStrikethrough className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            <TextAUnderline className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("highlight")}
            onPressedChange={() =>
              editor.chain().focus().toggleHighlight().run()
            }
          >
            <HighlighterCircle className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={setLink}
          >
            <LinkSimple className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("code")}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("codeBlock")}
            onPressedChange={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
          >
            <CodeBlockIcon className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <TextHOne className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <TextHTwo className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <TextHThree className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("paragraph")}
            onPressedChange={() => editor.chain().focus().setParagraph().run()}
          >
            <ParagraphIcon className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          >
            <TextAlignLeft className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          >
            <TextAlignCenter className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          >
            <TextAlignRight className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
          >
            <TextAlignJustify className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <ListBullets className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListNumbers className="h-4 w-4" />
          </Toggle>
        </Tooltip>

        <Tooltip>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <KeyReturn className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <ArrowCounterClockwise className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <ArrowClockwise className="h-4 w-4" />
          </Button>
        </Tooltip>

        <AIPopover
          section={section}
          onSuggestionApply={(suggestion) =>
            editor.commands.insertContent(suggestion)
          }
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {isEnhanceLoading && (
                <Loader2 className="w-3 h-3 absolute animate-spin -right-1 -top-1" />
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={
                  !editor
                    .getHTML()
                    .replace(/<[^>]*>?/gm, "")
                    .trim() || isEnhanceLoading
                }
                className={`px-2 ${
                  !editor
                    .getHTML()
                    .replace(/<[^>]*>?/gm, "")
                    .trim() && "opacity-50 cursor-not-allowed"
                } ${isEnhanceLoading && "opacity-50"}`}
                onClick={handleEnhanceText}
              >
                <Wand2 className="h-3 w-3" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enhance text with AI</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

type RichInputProps = {
  section: string;
  content: string;
  onContentChange: (value: string) => void;
  hideToolbar?: boolean;
  className?: string;
  editorClassName?: string;
} & Omit<
  EditorContentProps,
  "editor" | "content" | "value" | "onChange" | "className"
>;

export const RichInput = forwardRef<HTMLDivElement, RichInputProps>(
  (
    {
      section,
      content,
      onContentChange,
      hideToolbar = false,
      className,
      editorClassName,
      ...props
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          bold: {
            HTMLAttributes: {
              class: "font-bold",
            },
          },
          italic: {
            HTMLAttributes: {
              class: "italic",
            },
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Image,
        Underline.configure({
          HTMLAttributes: {
            class: "underline",
          },
        }),
        Highlight.configure({
          multicolor: true,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.extend({
          inclusive: false,
        }).configure({
          openOnClick: false,
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onContentChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm prose-zinc max-h-[200px] max-w-none overflow-y-scroll dark:prose-invert focus:outline-none",
            "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
            "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5",
            "[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:mt-4",
            "[&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4",
            editorClassName
          ),
        },
      },
    });

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [editor, content]);

    if (!editor) {
      return (
        <div className="space-y-2">
          <Skeleton
            className={cn("h-[42px] w-full", hideToolbar && "hidden")}
          />
          <Skeleton className="h-[90px] w-full" />
        </div>
      );
    }

    return (
      <div className="custom-editor" ref={ref}>
        {!hideToolbar && <Toolbar editor={editor} section={section} />}
        <EditorContent
          editor={editor}
          className={cn(
            "grid min-h-[160px] text-primary w-full rounded-sm border bg-transparent px-3 py-2 text-sm placeholder:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            hideToolbar && "pt-2",
            className,
            // Conditionally add classes for light and dark mode text colors
            "text-primary"
          )}
          style={{
            fontWeight: "normal",
            background: "transparent", // Transparent background for both modes
          }}
          {...props}
        />
      </div>
    );
  }
);

RichInput.displayName = "RichInput";

export default function Component({
  section,
  content,
  onContentChange,
}: {
  section: string;
  content: string;
  onContentChange: (content: string) => void;
}) {
  return (
    <RichInput
      section={section}
      content={content}
      onContentChange={onContentChange}
    />
  );
}
