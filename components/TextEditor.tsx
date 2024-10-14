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
} from "@/components/ui/tooltip"
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
import { forwardRef, useCallback, useEffect, useState } from "react";
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
import { Sparkles, WandSparkles } from "lucide-react";

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
}

function AIPopover({ onSuggestionApply }: AIPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await axios.post<{ content: string }>("/api/ai-assist/", {
      prompt,
    });
    setSuggestion(response.data.content);
    setIsLoading(false);
  };

  const handleApply = () => {
    onSuggestionApply(suggestion);
    setIsOpen(false);
    setSuggestion("");
    setPrompt("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <div className="flex gap-x-2">
            <Sparkles className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="font-medium">AI Suggestion</h4>
          <Input
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </form>
        {suggestion && (
          <div className="mt-4 space-y-2">
            <Textarea value={suggestion} readOnly className="min-h-[100px]" />
            <Button onClick={handleApply}>Apply Suggestion</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

const Toolbar = ({ editor }: { editor: Editor }) => {
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
          onSuggestionApply={(suggestion) =>
            editor.commands.insertContent(suggestion)
          }
        />
      </div>
    </TooltipProvider>
  );
};

type RichInputProps = {
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
        {!hideToolbar && <Toolbar editor={editor} />}

        <EditorContent
          editor={editor}
          className={cn(
            "grid min-h-[160px] w-full rounded-sm border bg-transparent px-3 py-2 text-sm placeholder:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            hideToolbar && "pt-2",
            className
          )}
          style={{ fontWeight: "normal" }}
          {...props}
        />
      </div>
    );
  }
);

RichInput.displayName = "RichInput";

export default function Component({
  content,
  onContentChange,
}: {
  content: string;
  onContentChange: (content: string) => void;
}) {
  return <RichInput content={content} onContentChange={onContentChange} />;
}
