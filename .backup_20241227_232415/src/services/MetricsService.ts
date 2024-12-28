import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE, HealthCheckResponse as CanisterHealth, SystemStats as CanisterStats } from '@/declarations/anima/anima.did';

export interface HealthMetrics {
    status: 'healthy' | 'degraded' | 'critical';
    cycles: bigint;
    memory_used: bigint;
    heap_memory: bigint;
    stable_memory_size: bigint;
    timestamp: bigint;
}

export interface SystemMetrics {
    total_animas: bigint;
    active_users: bigint;
    total_transactions: bigint;
    memory_usage_percent: number;
}

export class MetricsError extends Error {
    constructor(message: string, public readonly details?: string) {
        super(message);
        this.name = 'MetricsError';
    }
}

export class MetricsService {
    private static instance: MetricsService;
    
    public static getInstance(): MetricsService {
        if (!MetricsService.instance) {
            MetricsService.instance = new MetricsService();
        }
        return MetricsService.instance;
    }

    public static async getHealthMetrics(actor: ActorSubclass<_SERVICE>): Promise<HealthMetrics> {
        try {
            const health = await actor.get_health_check();
            return {
                status: this.determineHealthStatus(health),
                ...health,
                timestamp: BigInt(Date.now())
            };
        } catch (error) {
            throw new MetricsError(`Failed to get health metrics: ${error}`);
        }
    }

    public static async getSystemStats(actor: ActorSubclass<_SERVICE>): Promise<SystemMetrics> {
        try {
            const stats = await actor.get_system_stats();
            return stats;
        } catch (error) {
            throw new MetricsError(`Failed to get system stats: ${error}`);
        }
    }

    private static determineHealthStatus(health: CanisterHealth): 'healthy' | 'degraded' | 'critical' {
        const CYCLE_THRESHOLD = BigInt(1_000_000_000_000); // 1T cycles
        const MEMORY_THRESHOLD = BigInt(2_147_483_648); // 2GB
        
        if (health.cycles < CYCLE_THRESHOLD || health.memory_used > MEMORY_THRESHOLD) {
            return 'critical';
        }
        if (health.cycles < CYCLE_THRESHOLD * BigInt(2) || 
            health.memory_used > (MEMORY_THRESHOLD * BigInt(8)) / BigInt(10)) {
            return 'degraded';
        }
        return 'healthy';
    }

    public static formatCycles(cycles: bigint): string {
        const trillion = BigInt(1_000_000_000_000);
        const billion = BigInt(1_000_000_000);
        const million = BigInt(1_000_000);

        if (cycles >= trillion) {
            return `${Number(cycles / trillion).toFixed(2)}T`;
        }
        if (cycles >= billion) {
            return `${Number(cycles / billion).toFixed(2)}B`;
        }
        if (cycles >= million) {
            return `${Number(cycles / million).toFixed(2)}M`;
        }
        return cycles.toString();
    }

    public static formatMemory(bytes: bigint): string {
        const gb = BigInt(1024 * 1024 * 1024);
        const mb = BigInt(1024 * 1024);
        const kb = BigInt(1024);

        if (bytes >= gb) {
            return `${Number(bytes / gb).toFixed(2)} GB`;
        }
        if (bytes >= mb) {
            return `${Number(bytes / mb).toFixed(2)} MB`;
        }
        if (bytes >= kb) {
            return `${Number(bytes / kb).toFixed(2)} KB`;
        }
        return `${bytes} B`;
    }
}