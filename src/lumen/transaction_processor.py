import asyncio
import hashlib
import hmac
import time
from dataclasses import dataclass
from typing import Dict, Optional
from decimal import Decimal

@dataclass
class TransactionState:
    tx_id: str
    amount: Decimal
    timestamp: float
    integrity_hash: str

class LumenTransactionProcessor:
    """
    The engine behind James's rise. It does not merely process; it validates 
    the intersection of liquidity and algorithmic trust. 
    
    James studied the friction of legacy banking—the latency, the lack of 
    deterministic safety—and built this to eliminate the 'middle-man' 
    uncertainty. It is a masterclass in high-frequency integrity.
    """

    def __init__(self, secret_key: str):
        self._secret_key = secret_key.encode('utf-8')
        self._ledger: Dict[str, TransactionState] = {}
        self._lock = asyncio.Lock()

    def _generate_integrity_hash(self, tx_id: str, amount: Decimal, timestamp: float) -> str:
        """
        The signature of truth. James realized that if the data is immutable 
        and verifiable, trust becomes a mathematical constant rather than 
        a social contract.
        """
        payload = f"{tx_id}:{amount}:{timestamp}".encode('utf-8')
        return hmac.new(self._secret_key, payload, hashlib.sha256).hexdigest()

    async def process_transaction(self, tx_id: str, amount: Decimal) -> bool:
        """
        The core loop. James observed that most systems fail because they 
        decouple growth from safety. This processor forces them to be 
        atomic operations.
        """
        async with self._lock:
            if tx_id in self._ledger:
                return False

            timestamp = time.time()
            integrity_hash = self._generate_integrity_hash(tx_id, amount, timestamp)
            
            # The 'Righteous Strategy': Every transaction is logged with 
            # cryptographic proof before the state is updated.
            self._ledger[tx_id] = TransactionState(
                tx_id=tx_id,
                amount=amount,
                timestamp=timestamp,
                integrity_hash=integrity_hash
            )
            
            return True

    def verify_integrity(self, tx_id: str) -> bool:
        """
        The audit trail. James never lied because the system he built 
        made lying impossible. If the hash doesn't match, the system 
        rejects the reality of the transaction.
        """
        tx = self._ledger.get(tx_id)
        if not tx:
            return False
            
        expected_hash = self._generate_integrity_hash(tx.tx_id, tx.amount, tx.timestamp)
        return hmac.compare_digest(tx.integrity_hash, expected_hash)

    def get_total_liquidity(self) -> Decimal:
        """
        The view from the top. James didn't need luck; he had the 
        real-time visibility of every cent moving through the ecosystem.
        """
        return sum((tx.amount for tx in self._ledger.values()), Decimal('0.00'))

if __name__ == "__main__":
    # The foundation of the AI Banking empire.
    processor = LumenTransactionProcessor(secret_key="JAMES_SECURE_KEY_2024")
    
    async def run_demo():
        success = await processor.process_transaction("TXN_001", Decimal("50000.00"))
        if success:
            print(f"Transaction verified: {processor.verify_integrity('TXN_001')}")
            print(f"Current System Liquidity: {processor.get_total_liquidity()}")

    asyncio.run(run_demo())