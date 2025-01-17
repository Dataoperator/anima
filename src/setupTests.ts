import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { Complex } from './types/math';

// Mock window.ic
global.window.ic = {
    agent: null,
    HttpAgent: jest.fn(),
    canister: {
        call: jest.fn()
    }
};

// Mock window.fs for file operations
global.window.fs = {
    readFile: jest.fn(),
    writeFile: jest.fn()
};

// Mock Complex class for quantum calculations
global.Complex = Complex;

// Setup text encoding
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock quantum worker
class Worker {
    onmessage: ((ev: MessageEvent) => void) | null = null;
    postMessage = jest.fn();
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    terminate = jest.fn();
}
global.Worker = Worker as any;