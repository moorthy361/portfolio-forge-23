import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, ExternalLink, Share2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface SharePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  portfolioName: string;
}

const SharePortfolioModal = ({ 
  isOpen, 
  onClose, 
  portfolioId, 
  portfolioName 
}: SharePortfolioModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  
  const portfolioUrl = `${window.location.origin}/portfolio-view/${portfolioId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Portfolio link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleOpenInNewTab = () => {
    window.open(portfolioUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Portfolio
          </DialogTitle>
          <DialogDescription>
            Your portfolio "{portfolioName}" is now live! Share this link with anyone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={portfolioUrl}
              readOnly
              className="flex-1 text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="default" className="flex-1 text-primary-foreground">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleOpenInNewTab} variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
            <Button onClick={() => setShowQr(!showQr)} variant="outline" size="icon" className="shrink-0">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>

          {/* QR Code */}
          {showQr && (
            <div className="flex flex-col items-center gap-3 pt-2 pb-1 animate-fade-in">
              <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
                <QRCodeSVG 
                  value={portfolioUrl} 
                  size={180} 
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan this QR code to view the portfolio on mobile
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePortfolioModal;
