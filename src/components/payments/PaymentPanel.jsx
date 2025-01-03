import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAnima } from '@/contexts/anima-context';
import { useAuth } from '@/contexts/auth-context';
import { usePayment } from '@/contexts/PaymentContext';
import { Terminal, CircuitBoard, Sparkles, Shield, ChevronRight } from 'lucide-react';

// ... [Previous code unchanged until the JSX part]

<div className="flex items-center space-x-2">
  <ChevronRight className="h-4 w-4 text-green-500" />
  <span>{'>'} ALL MANKIND IS FACING AN EPIC CHOICE:</span>
</div>

// ... [Rest of the file remains unchanged]