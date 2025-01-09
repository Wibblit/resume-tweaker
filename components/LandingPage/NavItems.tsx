"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileText, Edit3, Activity, BookOpen } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const navItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
];

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Latest Blog Posts",
    href: "/blogs/latest",
    description: "Check out our most recent articles and insights.",
  },
  {
    title: "Career Advice",
    href: "/blogs/career-advice",
    description:
      "Tips and strategies to advance your career and land your dream job.",
  },
  {
    title: "Resume Writing Tips",
    href: "/blogs/resume-tips",
    description:
      "Learn how to craft a compelling resume that stands out to employers.",
  },
  {
    title: "Interview Preparation",
    href: "/blogs/interview-prep",
    description:
      "Prepare for your next interview with our expert advice and strategies.",
  },
];

export function NavItems() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resume</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <span className="sm:block md:text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200 mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        resume
                      </span>
                      <span className="font-bold">tweaker</span>
                    </span>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Craft a standout resume with ease using the power of AI.
                      Receive tailored suggestions, optimize your content, and
                      land your dream job faster.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Resume Templates">
                <FileText size={16} className="inline-block mr-2" />
                Professionally designed, customizable resume templates to help
                you stand out.
              </ListItem>
              <ListItem href="#" title="AI Resume Analyzer">
                <Activity size={16} className="inline-block mr-2" />
                Analyze your resume with AI to get real-time feedback and
                optimization tips.
              </ListItem>
              <ListItem href="#" title="AI-Powered Resume Editor">
                <Edit3 size={16} className="inline-block mr-2" />
                Create, edit, and personalize your resume with our advanced,
                AI-driven tools.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cover Letter</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <span className="sm:block md:text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200 mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        resume
                      </span>
                      <span className="font-bold">tweaker</span>
                    </span>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Craft a compelling cover letter effortlessly with AI.
                      Tailor your content and create a persuasive narrative that
                      showcases your strengths.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Cover Letter Templates">
                <FileText size={16} className="inline-block mr-2" />
                Customizable cover letter templates to help you make a strong
                first impression.
              </ListItem>
              <ListItem href="#" title="AI-Integrated Cover Letter Editor">
                <Edit3 size={16} className="inline-block mr-2" />
                Create, edit, and personalize your cover letter with our
                AI-powered editor.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blogs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
              <li className="md:col-span-2">
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/blogs"
                  >
                    <div className="text-sm font-medium leading-none">
                      See All Blogs
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      <BookOpen size={16} className="inline-block mr-2" />
                      Explore our full collection of articles, tips, and
                      insights.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/features" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Features
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
