import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Loader, 
  AlertCircle,
  Settings, 
  Activity,
  Clock,
  LineChart,
  Brain,
  Award,
  History,
  Globe,
  Play,
  Music,
  Youtube
} from 'lucide-react';
import PersonalityTraits from '../personality/PersonalityTraits';
import { AnimaMediaInterface } from '../media/AnimaMediaInterface';
import { MediaActionSystem, MediaState, MediaAction } from '@/autonomous/MediaActions';
import { useAnima } from '@/hooks/useAnima';
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Preserve existing component imports and definitions...
// [Previous MetricsCard, StreamData, BirthCertificate components remain unchanged]

interface EnhancedImmersiveAnimaUIProps {
  messages: any[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  animaName?: string;
  personality?: any;
  metrics?: any;
  isTyping?: boolean;
  onMediaAction?: (action: MediaAction) => void;
}

export const EnhancedImmersiveAnimaUI: React.FC<EnhancedImmersiveAnimaUIProps> = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  error = null,
  onClearError,
  animaName = 'Anima',
  personality = {},
  metrics = {},
  isTyping = false,
  onMediaAction
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState('chat');
  const mediaSystem = useRef(new MediaActionSystem());
  const [mediaState, setMediaState] = useState<MediaState>({
    currentUrl: null,
    isPlaying: false,
    volume: 0.75,
    timestamp: 0
  });

  // Previous stream data and useEffect hooks remain unchanged...

  const handleMediaStateChange = (newState: MediaState) => {
    setMediaState(newState);
  };

  const handleAnimaMediaAction = (action: MediaAction) => {
    onMediaAction?.(action);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left sidebar remains unchanged */}
      <div className="w-80 border-r border-border bg-card p-6 space-y-6 hidden lg:block">
        <BirthCertificate anima={personality} />
        <Card>
          <CardHeader>
            <CardTitle>Evolution Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalityTraits traits={personality?.traits || []} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList>
              <TabsTrigger value="chat" onClick={() => setActiveView('chat')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Neural Link
              </TabsTrigger>
              <TabsTrigger value="media" onClick={() => setActiveView('media')}>
                <Play className="w-4 h-4 mr-2" />
                Media Space
              </TabsTrigger>
              <TabsTrigger value="stats" onClick={() => setActiveView('stats')}>
                <Activity className="w-4 h-4 mr-2" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="streams" onClick={() => setActiveView('streams')}>
                <Globe className="w-4 h-4 mr-2" />
                Data Streams
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Original chat view remains unchanged */}
            {activeView === 'chat' && (
              <div className="p-4 relative">
                {/* Existing chat messages implementation */}
                {mediaState.currentUrl && (
                  <div className="fixed bottom-24 right-4 w-80">
                    <AnimaMediaInterface
                      onMediaStateChange={handleMediaStateChange}
                      onAnimaAction={handleAnimaMediaAction}
                    />
                  </div>
                )}
                {/* Rest of chat implementation */}
              </div>
            )}

            {/* New media view */}
            {activeView === 'media' && (
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center">
                          <Youtube className="w-5 h-5 mr-2" />
                          Media Player
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnimaMediaInterface
                        onMediaStateChange={handleMediaStateChange}
                        onAnimaAction={handleAnimaMediaAction}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center">
                          <Music className="w-5 h-5 mr-2" />
                          Media History
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Media history implementation */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Original stats and streams views remain unchanged */}
          </AnimatePresence>
        </div>

        {/* Chat input area remains unchanged */}
      </div>

      {/* Right sidebar remains unchanged */}
    </div>
  );
};

export default EnhancedImmersiveAnimaUI;