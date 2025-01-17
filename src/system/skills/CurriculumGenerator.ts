import { SkillSystem, Skill } from './SkillSystem';
import { QuantumState } from '@/types/quantum';
import { EmotionalState } from '@/types/emotional';

[Previous code...]

    private calculateTaskComplexity(
        skills: Skill[],
        parameters: any
    ): number {
        // Base complexity from skill levels
        const skillComplexity = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;

        // Parameter-based complexity
        let parameterComplexity = 0;
        switch(parameters.mediaType) {
            case 'youtube':
                parameterComplexity += 0.3;
                break;
            case 'interactive':
                parameterComplexity += 0.5;
                break;
            case 'mixed':
                parameterComplexity += 0.7;
                break;
        }

        if (parameters.duration) {
            const minutes = parseInt(parameters.duration);
            parameterComplexity += Math.min(minutes / 30, 0.5); // Max 0.5 from duration
        }

        if (parameters.elements?.length > 1) {
            parameterComplexity += 0.2 * (parameters.elements.length - 1);
        }

        // Normalize to 0-1 range
        return Math.min(Math.max((skillComplexity + parameterComplexity) / 5, 0), 1);
    }

    private createValidationFunction(
        taskType: string,
        parameters: any
    ): (result: any) => boolean {
        return (result: any): boolean => {
            switch(taskType) {
                case 'media':
                    return this.validateMediaTask(result, parameters);
                case 'interaction':
                    return this.validateInteractionTask(result, parameters);
                case 'learning':
                    return this.validateLearningTask(result, parameters);
                case 'creation':
                    return this.validateCreationTask(result, parameters);
                default:
                    return false;
            }
        };
    }

    private validateMediaTask(result: any, parameters: any): boolean {
        if (!result.mediaId || !result.duration || !result.interactions) {
            return false;
        }

        // Check if media type matches
        if (parameters.mediaType && result.type !== parameters.mediaType) {
            return false;
        }

        // Check duration requirements
        if (parameters.duration) {
            const [min, max] = parameters.duration.split('-').map(n => parseInt(n));
            if (result.duration < min || result.duration > max) {
                return false;
            }
        }

        // Check interaction quality
        if (result.interactions.length === 0) {
            return false;
        }

        return true;
    }

    private validateInteractionTask(result: any, parameters: any): boolean {
        if (!result.conversation || !result.duration || !result.engagementMetrics) {
            return false;
        }

        // Check conversation type
        if (parameters.conversationType && 
            result.conversation.type !== parameters.conversationType) {
            return false;
        }

        // Check duration
        const minDuration = parseInt(parameters.duration) - 1;
        if (result.duration < minDuration) {
            return false;
        }

        // Check engagement quality
        const minEngagement = 0.6; // 60% engagement threshold
        if (result.engagementMetrics.average < minEngagement) {
            return false;
        }

        return true;
    }

    private validateLearningTask(result: any, parameters: any): boolean {
        if (!result.patterns || !result.observationTime || !result.confidence) {
            return false;
        }

        // Check pattern type
        if (parameters.patternType && 
            !result.patterns.some(p => p.type === parameters.patternType)) {
            return false;
        }

        // Check observation period
        const requiredTime = parseInt(parameters.observationPeriod);
        if (result.observationTime < requiredTime) {
            return false;
        }

        // Check minimum samples
        if (result.patterns.length < parameters.minimumSamples) {
            return false;
        }

        // Check confidence level
        const minConfidence = 0.7; // 70% confidence threshold
        if (result.confidence < minConfidence) {
            return false;
        }

        return true;
    }

    private validateCreationTask(result: any, parameters: any): boolean {
        if (!result.content || !result.elements || !result.metrics) {
            return false;
        }

        // Check creation type
        if (parameters.creationType && 
            result.content.type !== parameters.creationType) {
            return false;
        }

        // Check required elements
        const hasAllElements = parameters.elements.every(
            element => result.elements.includes(element)
        );
        if (!hasAllElements) {
            return false;
        }

        // Check quality metrics
        const minQuality = 0.65; // 65% quality threshold
        if (result.metrics.quality < minQuality) {
            return false;
        }

        // Check theme adherence if specified
        if (parameters.theme && result.metrics.themeAlignment < 0.7) {
            return false;
        }

        return true;
    }

    public getTaskHistory(): Task[] {
        return this.taskHistory;
    }

    public analyzeTaskSuccess(task: Task, result: any): {
        success: boolean;
        feedback: string[];
        improvements: string[];
    } {
        const success = task.validation(result);
        const feedback: string[] = [];
        const improvements: string[] = [];

        // Analyze results and generate feedback
        switch(task.category) {
            case 'media':
                if (!result.mediaId) {
                    feedback.push('Media selection not completed');
                    improvements.push('Practice media search and selection');
                }
                if (result.interactions?.length === 0) {
                    feedback.push('No user interactions recorded');
                    improvements.push('Focus on engagement with media');
                }
                break;

            case 'interaction':
                if (result.engagementMetrics?.average < 0.6) {
                    feedback.push('Low engagement level');
                    improvements.push('Work on maintaining user interest');
                }
                break;

            case 'learning':
                if (result.confidence < 0.7) {
                    feedback.push('Low confidence in learned patterns');
                    improvements.push('Need more observation samples');
                }
                break;

            case 'creation':
                if (result.metrics?.quality < 0.65) {
                    feedback.push('Content quality below threshold');
                    improvements.push('Focus on content refinement');
                }
                break;
        }

        return { success, feedback, improvements };
    }
}