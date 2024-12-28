mod formation;

use std::collections::HashMap;
use crate::personality::{NFTPersonality};
use crate::error::Result;

pub use crate::personality::Memory;  // Re-export Memory from personality
pub use formation::*;

pub struct MemorySystem {
    memories: HashMap<String, Memory>,
    max_size: usize,
}

impl MemorySystem {
    pub fn new(max_size: usize) -> Self {
        Self {
            memories: HashMap::new(),
            max_size,
        }
    }

    pub fn add_memory(&mut self, memory: Memory) -> Result<()> {
        if self.memories.len() >= self.max_size {
            self.prune_old_memories();
        }
        
        let key = format!("{}", memory.timestamp);
        self.memories.insert(key, memory);
        Ok(())
    }

    fn prune_old_memories(&mut self) {
        // Keep only the most recent memories
        let mut memories: Vec<_> = self.memories.drain().collect();
        memories.sort_by_key(|(_, memory)| memory.timestamp);
        memories.truncate(self.max_size / 2);
        
        self.memories = memories.into_iter().collect();
    }
}