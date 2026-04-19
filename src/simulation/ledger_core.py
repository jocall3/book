import hashlib
import json
import time
from dataclasses import dataclass, asdict, field
from typing import List, Optional, Dict, Any
from enum import Enum

class IntegrityError(Exception):
    """Raised when the ledger's cryptographic chain is compromised."""
    pass

class EntryType(Enum):
    TRANSACTION = "TRANSACTION"
    STRATEGY_LOG = "STRATEGY_LOG"
    SYSTEM_AUDIT = "SYSTEM_AUDIT"
    KNOWLEDGE_SYNTHESIS = "KNOWLEDGE_SYNTHESIS"

@dataclass(frozen=True)
class LedgerEntry:
    """
    Represents a single, immutable atomic unit of data within the ledger.
    James designed this to be the 'DNA' of the banking system—unalterable and transparent.
    """
    entry_id: str
    timestamp: float
    entry_type: str
    actor: str
    payload: Dict[str, Any]
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_json(self) -> str:
        return json.dumps(asdict(self), sort_keys=True)

@dataclass
class Block:
    """
    A collection of entries linked to the previous block via a SHA-256 hash.
    This is the 'Righteous Strategy' in code: every step must be justified by the previous.
    """
    index: int
    timestamp: float
    entries: List[LedgerEntry]
    previous_hash: str
    nonce: int = 0
    hash: str = ""

    def __post_init__(self):
        if not self.hash:
            self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "entries": [asdict(e) for e in self.entries],
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty: int):
        """
        James implemented a proof-of-knowledge mechanism. 
        While simple here, it represents the computational rigor required to validate banking state.
        """
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()

class ImmutableLedger:
    """
    The core engine of the AI Banking takeover. 
    Built on the principle that absolute transparency is the ultimate competitive advantage.
    """
    def __init__(self, difficulty: int = 4):
        self.chain: List[Block] = []
        self.difficulty = difficulty
        self.pending_entries: List[LedgerEntry] = []
        # Create the Genesis Block - The moment James realized the flaw in legacy banking
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis_entry = LedgerEntry(
            entry_id="GENESIS",
            timestamp=time.time(),
            entry_type=EntryType.SYSTEM_AUDIT.value,
            actor="SYSTEM",
            payload={"message": "The era of opaque banking ends. Knowledge is the new collateral."},
            metadata={"version": "1.0.0"}
        )
        genesis_block = Block(0, time.time(), [genesis_entry], "0")
        genesis_block.mine_block(self.difficulty)
        self.chain.append(genesis_block)

    def add_entry(self, actor: str, entry_type: EntryType, payload: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None):
        """
        Records a new action. James ensured that no entry could be 'dirty'—
        every transaction is mapped to a righteous strategy.
        """
        entry = LedgerEntry(
            entry_id=hashlib.sha256(str(time.time()).encode()).hexdigest()[:16],
            timestamp=time.time(),
            entry_type=entry_type.value,
            actor=actor,
            payload=payload,
            metadata=metadata or {}
        )
        self.pending_entries.append(entry)
        return entry.entry_id

    def commit_block(self) -> Block:
        """
        Finalizes pending entries into a block. 
        This is the 'Perseverance' phase where data becomes history.
        """
        if not self.pending_entries:
            raise ValueError("No entries to commit.")

        last_block = self.chain[-1]
        new_block = Block(
            index=len(self.chain),
            timestamp=time.time(),
            entries=self.pending_entries,
            previous_hash=last_block.hash
        )
        new_block.mine_block(self.difficulty)
        
        # Validate before appending
        if self._is_block_valid(new_block, last_block):
            self.chain.append(new_block)
            self.pending_entries = []
            return new_block
        else:
            raise IntegrityError("Cryptographic validation failed during block commitment.")

    def _is_block_valid(self, block: Block, previous_block: Block) -> bool:
        if previous_block.index + 1 != block.index:
            return False
        if block.previous_hash != previous_block.hash:
            return False
        if block.hash != block.calculate_hash():
            return False
        return True

    def validate_chain(self) -> bool:
        """
        The Masterclass Audit. 
        Iterates through the entire history to ensure not a single byte has been tampered with.
        """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]

            if not self._is_block_valid(current, previous):
                return False
            
            # Verify the proof of work/knowledge
            if current.hash[:self.difficulty] != "0" * self.difficulty:
                return False
                
        return True

    def get_actor_history(self, actor: str) -> List[LedgerEntry]:
        """
        Analytical mystery solving: trace every move James or any other entity made.
        """
        history = []
        for block in self.chain:
            for entry in block.entries:
                if entry.actor == actor:
                    history.append(entry)
        return history

    def export_ledger_state(self) -> str:
        """
        Provides 100% transparency by exporting the full state.
        """
        return json.dumps([asdict(b) for b in self.chain], indent=4)

# Example of James's first strategic move in the AI Banking sector
if __name__ == "__main__":
    # Initialize the core with James's specific rigor
    ledger = ImmutableLedger(difficulty=2)

    # James studies the market inefficiencies (Knowledge Synthesis)
    ledger.add_entry(
        actor="James",
        entry_type=EntryType.KNOWLEDGE_SYNTHESIS,
        payload={
            "observation": "Legacy banking latency creates 400ms arbitrage gaps.",
            "strategy": "Deploy neural-liquidity-bridge to close gaps ethically."
        }
    )

    # James builds the first app (System Audit)
    ledger.add_entry(
        actor="James",
        entry_type=EntryType.SYSTEM_AUDIT,
        payload={
            "app_name": "Aegis-Vault",
            "logic": "Zero-knowledge proofs for loan collateralization."
        }
    )

    # Commit the strategy to the immutable record
    ledger.commit_block()

    # Verify that the strategy is untamperable
    if ledger.validate_chain():
        print(f"Ledger Integrity Verified. Total Blocks: {len(ledger.chain)}")
    else:
        print("Integrity Compromised.")