import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { SystemStats, HealthStatus, HistoryDataPoint } from '@/types/metrics';
import { MetricsService } from '@/services/MetricsService';

const AdminMetrics: React.FC = () => {
    const { actor } = useAuth();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!actor) return;

            try {
                // Convert bigint responses to numbers for display
                const systemStats = await actor.get_system_stats();
                setStats({
                    total_animas: systemStats.total_animas,
                    active_users: systemStats.active_users,
                    total_transactions: systemStats.total_transactions,
                    memory_usage_percent: systemStats.memory_usage_percent
                });

                const healthStatus = await actor.get_health_status();
                setHealth({
                    status: healthStatus.status === "healthy" ? "healthy" : 
                           healthStatus.status === "degraded" ? "degraded" : "critical",
                    memory_used: Number(healthStatus.memory_used),
                    heap_memory: Number(healthStatus.heap_memory),
                    cycles: Number(healthStatus.cycles)
                });

                // Convert history data from backend format
                const history = await actor.get_growth_history();
                setHistoryData(history.map(point => ({
                    time: point.time,
                    nfts: Number(point.nfts),
                    users: Number(point.users)
                })));
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [actor]);

    if (!stats || !health) {
        return (
            <div className="h-96 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Metrics cards here */}
            </div>
        </div>
    );
};

export default AdminMetrics;