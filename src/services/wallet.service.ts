import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { ICPLedgerService, icpLedgerService } from './icp-ledger';
import { QuantumState } from '../quantum/types';