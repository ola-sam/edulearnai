import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface Source {
  id: number;
  title: string;
  grade: number;
  subject: string;
  documentType: string;
}

interface AiChatSourcesProps {
  sources: Source[];
}

const AiChatSources: React.FC<AiChatSourcesProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary-600 p-1 h-auto flex items-center"
          >
            <span className="material-icons text-xs mr-1">info</span>
            {isOpen ? 'Hide sources' : `Sources (${sources.length})`}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 text-xs">
          <div className="border-t border-gray-200 pt-1">
            {sources.map((source) => (
              <div key={source.id} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px] py-0 px-1">
                    {source.documentType}
                  </Badge>
                  <span className="font-medium">{source.title}</span>
                </div>
                <div className="text-gray-500 text-[10px]">
                  Grade {source.grade} · {source.subject}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AiChatSources;