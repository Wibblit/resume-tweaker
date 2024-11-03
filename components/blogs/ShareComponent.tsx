"use client";

import { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from "react-share";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ShareComponentProps {
  url: string;
  title: string;
}

export const ShareComponent: React.FC<ShareComponentProps> = ({
  url,
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full xs:w-auto">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this blog post</DialogTitle>
          <DialogDescription>
            Choose a platform to share this blog post on social media or copy
            the link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4 flex-wrap">
            <FacebookShareButton url={url} title={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <XIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={url} title={title}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <VKShareButton url={url} title={title}>
              <VKIcon size={32} round />
            </VKShareButton>
            <EmailShareButton url={url} title={title}>
              <EmailIcon size={32} round />
            </EmailShareButton>
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <RedditShareButton url={url} title={title}>
              <RedditIcon size={32} round />
            </RedditShareButton>
            {/* <PinterestShareButton url={url} title={title}>
              <PinterestIcon size={32} round />
            </PinterestShareButton> */}
            <PocketShareButton url={url} title={title}>
              <PocketIcon size={32} round />
            </PocketShareButton>
            <TumblrShareButton url={url} title={title}>
              <TumblrIcon size={32} round />
            </TumblrShareButton>
            <InstapaperShareButton url={url} title={title}>
              <InstapaperIcon size={32} round />
            </InstapaperShareButton>
            <LineShareButton url={url} title={title}>
              <LineIcon size={32} round />
            </LineShareButton>
            <GabShareButton url={url} title={title}>
              <GabIcon size={32} round />
            </GabShareButton>
            <HatenaShareButton url={url} title={title}>
              <HatenaIcon size={32} round />
            </HatenaShareButton>
            <MailruShareButton url={url} title={title}>
              <MailruIcon size={32} round />
            </MailruShareButton>
            <OKShareButton url={url} title={title}>
              <OKIcon size={32} round />
            </OKShareButton>
            <ViberShareButton url={url} title={title}>
              <ViberIcon size={32} round />
            </ViberShareButton>
            <WorkplaceShareButton url={url} title={title}>
              <WorkplaceIcon size={32} round />
            </WorkplaceShareButton>
          </div>
          <div className="flex items-center space-x-2">
            <Input value={url} readOnly className="flex-grow" />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
