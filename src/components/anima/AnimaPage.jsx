          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/quantum-vault')}
            className="relative px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-cyan-500/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">{'>'} RETURN TO VAULT</span>
          </motion.button>

          <motion.button
            onClick={() => setShowTransactions(!showTransactions)}
            className="relative px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-cyan-500/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">{'>'} {showTransactions ? 'HIDE' : 'VIEW'} SHELL RECORDS</span>
          </motion.button>

          <motion.button
            onClick={() => navigate(`/neural-link/${id}`)}
            className="relative px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </motion.div>
            <span className="relative flex items-center">
              <motion.span
                className="inline-block mr-2"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ◈
              </motion.span>
              INITIATE NEURAL LINK
            </span>
          </motion.button>
        </motion.div>
      </div>
    </MatrixLayout>
  );
};

export default AnimaPage;