              <div>
                <p className="text-gray-400 text-sm">Total Animas</p>
                <p className="text-2xl font-bold mt-1">
                  {stats ? Number(stats.total_animas).toLocaleString() : '-'}
                </p>
              </div>
              <Ghost className="text-purple-400" size={24} />
            </div>
          </motion.div>

          {/* Users Metric */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-blue-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold mt-1">
                  {stats ? Number(stats.active_users).toLocaleString() : '-'}
                </p>
              </div>
              <Users className="text-blue-400" size={24} />
            </div>
          </motion.div>

          {/* Transactions Metric */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-green-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold mt-1">
                  {stats ? Number(stats.total_transactions).toLocaleString() : '-'}
                </p>
              </div>
              <Activity className="text-green-400" size={24} />
            </div>
          </motion.div>

          {/* Memory Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-red-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Memory Usage</p>
                <p className="text-2xl font-bold mt-1">
                  {health ? MetricsService.formatMemory(health.memory_used) : '-'}
                </p>
                <p className="text-sm text-gray-500">
                  {stats ? `${stats.memory_usage_percent.toFixed(1)}%` : '-'}
                </p>
              </div>
              <Cpu 
                className={`text-${getStatusColor(
                  stats?.memory_usage_percent || 0,
                  [25, 50, 75]
                )}-400`} 
                size={24} 
              />
            </div>
          </motion.div>

          {/* Cycles Balance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-yellow-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Cycles Balance</p>
                <p className="text-2xl font-bold mt-1">
                  {health ? MetricsService.formatCycles(health.cycles) : '-'}
                </p>
              </div>
              <Activity 
                className={`text-${health?.status === 'healthy' ? 'green' : 
                  health?.status === 'degraded' ? 'yellow' : 'red'}-400`} 
                size={24} 
              />
            </div>
          </motion.div>

          {/* Heap Memory */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Heap Memory</p>
                <p className="text-2xl font-bold mt-1">
                  {health ? MetricsService.formatMemory(health.heap_memory) : '-'}
                </p>
              </div>
              <BarChart2 className="text-indigo-400" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Growth Chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280" 
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nfts" 
                    stroke="#8b5cf6" 
                    name="Animas"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    name="Users"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetrics;