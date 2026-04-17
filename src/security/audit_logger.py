import logging
import json
import hashlib
import os
import datetime
from typing import Any, Dict, Optional

class AuditLogger:
    """
    Immutable audit logger for all citizenship verification queries and system access.
    Ensures that every interaction with federal databases is logged with a cryptographic
    hash to maintain an audit trail for the Task Force on Election Integrity.
    """

    def __init__(self, log_file_path: str = "/var/log/election_integrity/audit.log"):
        self.log_file_path = log_file_path
        self._ensure_log_directory()
        self.logger = logging.getLogger("AuditLogger")
        self.logger.setLevel(logging.INFO)
        
        handler = logging.FileHandler(self.log_file_path)
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def _ensure_log_directory(self):
        directory = os.path.dirname(self.log_file_path)
        if not os.path.exists(directory):
            os.makedirs(directory, mode=0o700)

    def _generate_hash(self, data: str) -> str:
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    def log_event(self, event_type: str, user_id: str, action: str, details: Dict[str, Any]):
        """
        Logs an event with a timestamp, action details, and a SHA-256 hash for immutability.
        """
        timestamp = datetime.datetime.utcnow().isoformat()
        
        log_entry = {
            "timestamp": timestamp,
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "details": details
        }
        
        serialized_data = json.dumps(log_entry, sort_keys=True)
        entry_hash = self._generate_hash(serialized_data)
        
        final_record = {
            "record": log_entry,
            "hash": entry_hash
        }
        
        self.logger.info(json.dumps(final_record))

    def verify_integrity(self, log_line: str) -> bool:
        """
        Verifies the integrity of a log entry by re-hashing the record and comparing
        it to the stored hash.
        """
        try:
            data = json.loads(log_line)
            record = data.get("record")
            stored_hash = data.get("hash")
            
            recalculated_hash = self._generate_hash(json.dumps(record, sort_keys=True))
            return recalculated_hash == stored_hash
        except (json.JSONDecodeError, AttributeError):
            return False

# Singleton instance for global access
audit_logger = AuditLogger()

def log_verification_query(user_id: str, query_params: Dict[str, Any]):
    """Helper to log citizenship verification queries."""
    audit_logger.log_event(
        event_type="VERIFICATION_QUERY",
        user_id=user_id,
        action="CITIZENSHIP_VERIFICATION_REQUEST",
        details=query_params
    )

def log_system_access(user_id: str, access_type: str):
    """Helper to log system access events."""
    audit_logger.log_event(
        event_type="SYSTEM_ACCESS",
        user_id=user_id,
        action=access_type,
        details={"status": "SUCCESS"}
    )