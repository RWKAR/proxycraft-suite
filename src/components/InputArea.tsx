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

  const handleDecodeLinks = () => {
    if (!inputText.trim()) {
      addToast("error", "Please enter some links to decode.");
      return;
    }

    // Simple decode logic - for demo purposes
    const lines = inputText.split('\n').filter(line => line.trim());
    const hasEncodedLinks = lines.some(line => 
      line.includes('base64') || 
      line.includes('encoded') || 
      line.includes('%')
    );

    if (!hasEncodedLinks) {
      addToast("info", "No encoded links detected. Links are ready to use.");
      setDecodedLinks(lines);
      return;
    }

    // Simulate decoding process
    setTimeout(() => {
      setDecodedLinks(lines);
      addToast("success", `Successfully decoded ${lines.length} links.`);
    }, 500);
  };

  const handleGenerate = () => {
    const linksToProcess = decodedLinks.length > 0 ? decodedLinks : inputText.split('\n').filter(line => line.trim());
    
    if (linksToProcess.length === 0) {
      addToast("error", "Please enter some links first.");
      return;
    }

    onGenerate(linksToProcess);
    addToast("success", `Processing ${linksToProcess.length} links...`);
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