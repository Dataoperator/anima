import { Principal } from '@dfinity/principal';
import * as Types from './types';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validatePrincipal(value: any): Principal {
    if (!(value instanceof Principal)) {
        throw new ValidationError('Expected Principal type');
    }
    return value;
}

export function validateInitializationResult(value: any): Types.InitializationResult {
    if (!value || typeof value !== 'object') {
        throw new ValidationError('Invalid InitializationResult structure');
    }

    const { anima_id, name, creation_time } = value;

    if (!(anima_id instanceof Principal)) {
        throw new ValidationError('Invalid anima_id in InitializationResult');
    }

    if (typeof name !== 'string') {
        throw new ValidationError('Invalid name in InitializationResult');
    }

    if (typeof creation_time !== 'bigint') {
        throw new ValidationError('Invalid creation_time in InitializationResult');
    }

    return {
        anima_id,
        name,
        creation_time,
    };
}

export function validateInteractionResult(value: any): Types.InteractionResult {
    if (!value || typeof value !== 'object') {
        throw new ValidationError('Invalid InteractionResult structure');
    }

    const { response, personality_updates, memory, is_autonomous } = value;

    if (typeof response !== 'string') {
        throw new ValidationError('Invalid response in InteractionResult');
    }

    if (!Array.isArray(personality_updates)) {
        throw new ValidationError('Invalid personality_updates in InteractionResult');
    }

    for (const update of personality_updates) {
        if (!Array.isArray(update) || update.length !== 2 ||
            typeof update[0] !== 'string' || typeof update[1] !== 'number') {
            throw new ValidationError('Invalid personality update format');
        }
    }

    validateMemory(memory);

    if (typeof is_autonomous !== 'boolean') {
        throw new ValidationError('Invalid is_autonomous in InteractionResult');
    }

    return {
        response,
        personality_updates,
        memory,
        is_autonomous,
    };
}

export function validateMemory(value: any): Types.Memory {
    if (!value || typeof value !== 'object') {
        throw new ValidationError('Invalid Memory structure');
    }

    const { timestamp, event_type, description, emotional_impact, importance_score, keywords } = value;

    if (typeof timestamp !== 'bigint') {
        throw new ValidationError('Invalid timestamp in Memory');
    }

    if (!Object.values(Types.EventType).includes(event_type)) {
        throw new ValidationError('Invalid event_type in Memory');
    }

    if (typeof description !== 'string') {
        throw new ValidationError('Invalid description in Memory');
    }

    if (typeof emotional_impact !== 'number') {
        throw new ValidationError('Invalid emotional_impact in Memory');
    }

    if (typeof importance_score !== 'number') {
        throw new ValidationError('Invalid importance_score in Memory');
    }

    if (!Array.isArray(keywords) || !keywords.every(k => typeof k === 'string')) {
        throw new ValidationError('Invalid keywords in Memory');
    }

    return {
        timestamp,
        event_type,
        description,
        emotional_impact,
        importance_score,
        keywords,
    };
}

export function validateUserState(value: any): Types.UserState {
    if (!value || typeof value !== 'object') {
        throw new ValidationError('Invalid UserState structure');
    }

    if ('NotInitialized' in value) {
        return { NotInitialized: null };
    }

    if ('Initialized' in value) {
        const { anima_id, name } = value.Initialized;
        if (!(anima_id instanceof Principal) || typeof name !== 'string') {
            throw new ValidationError('Invalid Initialized UserState structure');
        }
        return { Initialized: { anima_id, name } };
    }

    throw new ValidationError('Invalid UserState variant');
}

export function validateAnimaResult<T>(
    value: any,
    validator: (v: any) => T
): Types.AnimaResult<T> {
    if (!value || typeof value !== 'object') {
        throw new ValidationError('Invalid AnimaResult structure');
    }

    if ('Ok' in value) {
        return { Ok: validator(value.Ok) };
    }

    if ('Err' in value) {
        validateAnimaError(value.Err);
        return { Err: value.Err };
    }

    throw new ValidationError('Invalid AnimaResult variant');
}

function validateAnimaError(error: any): Types.AnimaError {
    if (!error || typeof error !== 'object') {
        throw new ValidationError('Invalid AnimaError structure');
    }

    if ('NotFound' in error || 'NotAuthorized' in error) {
        return error;
    }

    if ('Configuration' in error || 'External' in error) {
        if (typeof error.Configuration !== 'string' && typeof error.External !== 'string') {
            throw new ValidationError('Invalid AnimaError message');
        }
        return error;
    }

    throw new ValidationError('Invalid AnimaError variant');
}