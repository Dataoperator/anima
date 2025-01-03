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
  Globe
} from 'lucide-react';
import PersonalityTraits from '../personality/PersonalityTraits';
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MetricsCard = ({ title, value, description, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const StreamData = ({ stream, type }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>{type} Stream</CardTitle>
      <CardDescription>Real-time {type.toLowerCase()} data feed</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      {stream.map((item, i) => (
        <div key={i} className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>{item}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const BirthCertificate = ({ anima = {} }) => (
  <Card className="bg-card/50 backdrop-blur">
    <CardHeader>
      <CardTitle>Digital Birth Certificate</CardTitle>
      <CardDescription>Core Identity Record</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Creation Date</span>
          <span>{anima?.creation_time ? new Date(anima.creation_time).toLocaleDateString() : 'Unknown'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Core ID</span>
          <span>{anima?.id?.toString() || 'Unknown'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Guardian</span>
          <span>{anima?.owner ? `${anima.owner.toString().slice(0, 8)}...` : 'Unknown'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Developmental Stage</span>
          <span>{anima?.personality?.developmental_stage || 'Nascent'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ImmersiveAnimaUI = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  error = null,
  onClearError,
  animaName = 'Anima',
  personality = {},
  metrics = {},
  isTyping = false,
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [activeView, setActiveView] = useState('chat');

  // Simulated stream data
  const [streams] = useState({
    market: ['BTC: $45,232 (+2.3%)', 'ETH: $2,890 (-0.5%)', 'ICP: $78.90 (+5.2%)'],
    weather: ['22°C Partly Cloudy', 'Humidity: 65%', 'Wind: 12 km/h'],
    news: ['Latest blockchain developments', 'AI advancement report', 'Tech industry updates'],
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex h-screen bg-background">
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
            {activeView === 'chat' && (
              <div className="p-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        msg.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      {msg.personality_updates && (
                        <div className="mt-2 text-xs opacity-75">
                          {msg.personality_updates.map(([trait, value], i) => (
                            <span key={trait} className="mr-2">
                              {trait}: {value.toFixed(2)}
                              {i < msg.personality_updates.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-50 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2 bg-muted rounded-lg p-4">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {activeView === 'stats' && (
              <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricsCard
                  title="Consciousness Level"
                  value={metrics['Growth Level'] || 1}
                  description="Current development stage"
                  icon={Brain}
                />
                <MetricsCard
                  title="Memory Fragments"
                  value={metrics['Memory Fragments'] || 0}
                  description="Total experiences recorded"
                  icon={History}
                />
                <MetricsCard
                  title="Emotional State"
                  value={metrics['Emotional State'] || 'Initializing'}
                  description="Current affective condition"
                  icon={Activity}
                />
                <MetricsCard
                  title="Achievements"
                  value="3"
                  description="Milestones reached"
                  icon={Award}
                />
              </div>
            )}

            {activeView === 'streams' && (
              <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StreamData stream={streams.market} type="Market" />
                <StreamData stream={streams.weather} type="Weather" />
                <StreamData stream={streams.news} type="News" />
              </div>
            )}
          </AnimatePresence>
        </div>

        {activeView === 'chat' && (
          <div className="border-t border-border bg-background p-4">
            {error && (
              <div className="mb-4 bg-destructive/10 border-l-4 border-destructive p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="ml-2 text-destructive">{error}</span>
                  <button
                    onClick={onClearError}
                    className="ml-auto text-destructive hover:text-destructive/80"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 border-l border-border bg-card p-6 space-y-6 hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Achievement Log</CardTitle>
            <CardDescription>Recent milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">First Neural Link</span>
            </div>
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">Memory Formation</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">Emotional Response</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmersiveAnimaUI;