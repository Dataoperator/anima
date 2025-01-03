{/* Previous code remains the same... */}
            <div className="relative z-10 text-center space-y-4">
              <motion.h2
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-2xl font-bold text-violet-300"
              >
                Evolution Detected
              </motion.h2>
              
              <QuantumField
                strength={quantumState.coherence}
                className="w-64 h-64 mx-auto"
              />

              {activeAnima?.traits && (
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {activeAnima.traits.map((trait, index) => (
                    <TraitEvolutionCard
                      key={trait.trait}
                      trait={trait}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Evolution Progress */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-20" />
          </div>
          <div>
            <h3 className="text-cyan-400 font-medium">Neural Link Active</h3>
            <p className="text-xs text-cyan-500/60">
              Connected to {activeAnima?.name}
            </p>
          </div>
        </div>

        {evolutionProgress && <EvolutionIndicator progress={evolutionProgress} />}
        
        <div className="flex items-center space-x-4">
          {/* Previous controls remain... */}
        </div>
      </div>

      {/* Messages with Growth Opportunities */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
            />
          ))}
          
          {growthOpportunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30"
            >
              <h4 className="text-indigo-300 font-medium mb-2">
                Growth Opportunities Available
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {growthOpportunities.map((opportunity) => (
                  <motion.button
                    key={opportunity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20
                             hover:bg-indigo-500/10 transition-colors text-left"
                    onClick={() => onGrowthOpportunityClick(opportunity)}
                  >
                    <div className="text-sm font-medium text-indigo-300">
                      {opportunity.name}
                    </div>
                    <div className="text-xs text-indigo-400/60 mt-1">
                      {opportunity.description}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-indigo-400">
                        Level {opportunity.requiredLevel}
                      </span>
                      <span className="text-indigo-300">
                        {opportunity.cost} ICP
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full 
                            bg-cyan-500/10 border border-cyan-500/30">
                <div className="text-cyan-400 text-sm">Processing</div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-2, 2, -2],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Enhanced Input with Quantum State Indicator */}
      <div className="p-4 border-t border-cyan-500/30 bg-black/40">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 pr-12 rounded-lg bg-black/60 border border-cyan-500/30 
                     text-cyan-100 placeholder-cyan-500/40 resize-none focus:outline-none 
                     focus:border-cyan-500/60 transition-colors"
            placeholder="Enter neural transmission..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-2">
            <div className="text-xs text-cyan-500/60">
              Quantum Coherence: {(quantumState.coherence * 100).toFixed(0)}%
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 
                       hover:bg-cyan-500/20 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors"
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};