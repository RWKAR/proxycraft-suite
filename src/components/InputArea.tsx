import { useState } from "react";
import { Sparkles, Bolt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "./ToastSystem";

interface InputAreaProps {
  onGenerate: (links: string[]) => void;
}

export const InputArea = ({ onGenerate }: InputAreaProps) => {
  const [inputText, setInputText] = useState("");
  const [decodedLinks, setDecodedLinks] = useState<string[]>([]);
  const { addToast } = useToast();

  // Base64 decoding function (based on CF_Download_Proxy logic)
  const fromBase64 = (b64: string): string => {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch (error) {
      throw new Error('Invalid Base64 string');
    }
  };

  const handleDecodeLinks = () => {
    if (!inputText.trim()) {
      addToast("error", "لطفاً ابتدا لینک‌هایتان را وارد کنید");
      return;
    }

    const lines = inputText.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      addToast("error", "لینک معتبری یافت نشد");
      return;
    }

    // Try to decode Base64 encoded links (CF_Download_Proxy format)
    const decodedResults: string[] = [];
    let decodedCount = 0;

    for (const line of lines) {
      try {
        // Check if it's a CF_Download_Proxy link format
        if (line.includes('/dl/')) {
          const base64Part = line.split('/dl/')[1];
          if (base64Part) {
            const decodedData = fromBase64(base64Part);
            const { url } = JSON.parse(decodedData);
            decodedResults.push(url);
            decodedCount++;
          } else {
            decodedResults.push(line);
          }
        } else if (line.startsWith('http')) {
          // Already a regular URL
          decodedResults.push(line);
        } else {
          // Try to decode as Base64
          try {
            const decoded = fromBase64(line);
            const parsed = JSON.parse(decoded);
            if (parsed.url) {
              decodedResults.push(parsed.url);
              decodedCount++;
            } else {
              decodedResults.push(line);
            }
          } catch {
            decodedResults.push(line);
          }
        }
      } catch (error) {
        decodedResults.push(line);
      }
    }

    setDecodedLinks(decodedResults);
    
    if (decodedCount > 0) {
      addToast("success", `${decodedCount} لینک رمزگذاری شده دیکد شد، ${decodedResults.length} لینک آماده پردازش`);
    } else {
      addToast("info", `${decodedResults.length} لینک آماده پردازش (دیکد لازم نبود)`);
    }
  };

  const handleGenerate = () => {
    const linksToProcess = decodedLinks.length > 0 ? decodedLinks : inputText.split('\n').filter(line => line.trim());
    
    if (linksToProcess.length === 0) {
      addToast("error", "لطفاً ابتدا لینک‌هایتان را وارد کنید");
      return;
    }

    onGenerate(linksToProcess);
    addToast("success", `در حال پردازش ${linksToProcess.length} لینک...`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Paste your links here, one per line..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[120px] bg-card/50 border-border/50 focus:border-teal/50 focus:ring-teal/20 transition-all duration-300"
          dir="ltr"
        />
        
        <div className="flex gap-3">
          <Button
            onClick={handleDecodeLinks}
            variant="secondary"
            className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary transition-all duration-300"
          >
            <Sparkles className="h-4 w-4" />
            Decode Links
          </Button>
          
          <Button
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-teal hover:bg-teal-hover text-primary-foreground transition-all duration-300"
          >
            <Bolt className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};