import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToastProvider } from "@/components/ToastSystem";
import { InputArea } from "@/components/InputArea";
import { ResultsArea } from "@/components/ResultsArea";

interface ProcessedLink {
  original: string;
  filename: string;
  cdnUrl: string;
  cloudflareUrl: string;
}

const Index = () => {
  const [processedLinks, setProcessedLinks] = useState<ProcessedLink[]>([]);

  const generateProxyLinks = (links: string[]) => {
    // Simulate link processing
    const processed = links.map((link, index) => {
      const filename = extractFilename(link) || `file-${index + 1}`;
      return {
        original: link,
        filename,
        cdnUrl: `https://cdn.ir/proxy/${encodeURIComponent(link)}`,
        cloudflareUrl: `https://cloudflare-proxy.com/v1/${encodeURIComponent(link)}`,
      };
    });

    setProcessedLinks(processed);
  };

  const extractFilename = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const filename = pathname.split('/').pop();
      return filename || 'unknown-file';
    } catch {
      // If URL parsing fails, extract from string
      const parts = url.split('/');
      return parts[parts.length - 1] || 'unknown-file';
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <ThemeToggle />
        
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black font-vazir mb-4 gradient-text">
              Multi Link Proxy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your links with powerful proxy services. Support for CDN.ir, Cloudflare, and more.
            </p>
          </header>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Input Section */}
            <section className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 p-6">
              <h2 className="text-xl font-bold mb-6 text-foreground">Input Links</h2>
              <InputArea onGenerate={generateProxyLinks} />
            </section>

            {/* Results Section */}
            <section className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/30 p-6">
              <h2 className="text-xl font-bold mb-6 text-foreground">Generated Links</h2>
              <ResultsArea processedLinks={processedLinks} />
            </section>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default Index;