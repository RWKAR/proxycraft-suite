import { useState } from "react";
import { FileStack, ArrowDown, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "./ToastSystem";

interface ProcessedLink {
  original: string;
  filename: string;
  cdnUrl: string;
  cloudflareUrl: string;
}

interface ResultsAreaProps {
  processedLinks: ProcessedLink[];
}

export const ResultsArea = ({ processedLinks }: ResultsAreaProps) => {
  const [activeTab, setActiveTab] = useState("cdn");
  const { addToast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyAllLinksAndFilenames = (tab: string) => {
    const content = processedLinks.map(link => {
      const url = tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
      return `${link.filename}\n${url}`;
    }).join('\n\n');
    
    copyToClipboard(content);
    addToast("bulk", `Copied all ${processedLinks.length} links with filenames to clipboard.`);
  };

  const handleCopyAllLinks = (tab: string) => {
    const content = processedLinks.map(link => {
      return tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
    }).join('\n');
    
    copyToClipboard(content);
    addToast("bulk", `Copied all ${processedLinks.length} links to clipboard.`);
  };

  const handleTxtOutputWithFilenames = (tab: string) => {
    const content = processedLinks.map(link => {
      const url = tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
      return `${link.filename}\n${url}`;
    }).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multi-link-proxy-${tab}-with-filenames.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    addToast("output", `Generated TXT file with ${processedLinks.length} links and filenames.`);
  };

  const handleTxtOutputLinksOnly = (tab: string) => {
    const content = processedLinks.map(link => {
      return tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multi-link-proxy-${tab}-links-only.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    addToast("output", `Generated TXT file with ${processedLinks.length} links.`);
  };

  const handleSingleCopy = (link: ProcessedLink, includeFilename: boolean, tab: string) => {
    const url = tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
    const content = includeFilename ? `${link.filename}\n${url}` : url;
    
    copyToClipboard(content);
    addToast("info", includeFilename ? "Copied link with filename." : "Copied link.");
  };

  const handleDownload = (link: ProcessedLink) => {
    addToast("success", `Starting download: ${link.filename}`);
    // Simulate download start
    window.open(link.original, '_blank');
  };

  const renderBulkActions = (tab: string) => (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-card/30 rounded-lg border border-border/30">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleCopyAllLinksAndFilenames(tab)}
        className="flex items-center gap-2 text-xs"
      >
        <FileStack className="h-3 w-3" />
        Copy All Links & Filenames
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleCopyAllLinks(tab)}
        className="flex items-center gap-2 text-xs"
      >
        <FileStack className="h-3 w-3" />
        Copy All Links
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleTxtOutputWithFilenames(tab)}
        className="flex items-center gap-2 text-xs"
      >
        <ArrowDown className="h-3 w-3" />
        TXT Output (Links & Filenames)
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleTxtOutputLinksOnly(tab)}
        className="flex items-center gap-2 text-xs"
      >
        <ArrowDown className="h-3 w-3" />
        TXT Output (Links Only)
      </Button>
    </div>
  );

  const renderLinkList = (tab: string) => (
    <div className="space-y-3">
      {processedLinks.map((link, index) => {
        const url = tab === 'cdn' ? link.cdnUrl : tab === 'cloudflare' ? link.cloudflareUrl : link.original;
        
        return (
          <div key={index} className="bg-card/40 rounded-lg border border-border/30 p-4 transition-all duration-300 hover:border-border/50">
            <div className="flex items-center justify-between gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal hover:text-teal-hover transition-colors duration-200 truncate flex-1 text-left"
              >
                {link.filename}
              </a>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSingleCopy(link, true, tab)}
                  className="h-8 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Link & Filename
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSingleCopy(link, false, tab)}
                  className="h-8 px-2 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Link
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(link)}
                  className="h-8 px-2 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (processedLinks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Generate some links to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/30">
          <TabsTrigger value="cdn" className="data-[state=active]:bg-teal/20 data-[state=active]:text-teal">
            CDN.ir
          </TabsTrigger>
          <TabsTrigger value="cloudflare" className="data-[state=active]:bg-teal/20 data-[state=active]:text-teal">
            Cloudflare
          </TabsTrigger>
          <TabsTrigger value="original" className="data-[state=active]:bg-teal/20 data-[state=active]:text-teal">
            Original
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cdn" className="space-y-4">
          {renderBulkActions('cdn')}
          {renderLinkList('cdn')}
        </TabsContent>

        <TabsContent value="cloudflare" className="space-y-4">
          {renderBulkActions('cloudflare')}
          {renderLinkList('cloudflare')}
        </TabsContent>

        <TabsContent value="original" className="space-y-4">
          {renderBulkActions('original')}
          {renderLinkList('original')}
        </TabsContent>
      </Tabs>
    </div>
  );
};