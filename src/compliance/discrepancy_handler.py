import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

# Configure logging for audit trails
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DiscrepancyHandler")

@dataclass
class DiscrepancyCase:
    case_id: str
    voter_id: str
    discrepancy_type: str
    source_system: str
    status: str = "PENDING"
    created_at: datetime = field(default_factory=datetime.now)
    resolution_deadline: datetime = field(default_factory=lambda: datetime.now() + timedelta(days=30))
    evidence_submitted: List[str] = field(default_factory=list)

class DiscrepancyHandler:
    """
    Workflow engine for managing and resolving citizenship discrepancies 
    as mandated by the Executive Order on Election Integrity.
    """

    def __init__(self):
        self.active_cases: Dict[str, DiscrepancyCase] = {}

    def initiate_discrepancy_case(self, voter_id: str, discrepancy_type: str, source: str) -> str:
        """Creates a new case for a citizenship verification discrepancy."""
        case_id = str(uuid.uuid4())
        case = DiscrepancyCase(
            case_id=case_id,
            voter_id=voter_id,
            discrepancy_type=discrepancy_type,
            source_system=source
        )
        self.active_cases[case_id] = case
        logger.info(f"Initiated discrepancy case {case_id} for voter {voter_id}. Source: {source}")
        return case_id

    def notify_voter(self, case_id: str):
        """Triggers the mandatory notification process for the voter."""
        case = self.active_cases.get(case_id)
        if not case:
            raise ValueError("Case not found.")
        
        # Logic for sending physical/electronic mail as per Section 4.3.1
        logger.info(f"Notification sent to voter for case {case_id}. Deadline: {case.resolution_deadline}")

    def submit_evidence(self, case_id: str, document_type: str, document_ref: str):
        """Adds evidence to a case for manual review."""
        case = self.active_cases.get(case_id)
        if not case or case.status != "PENDING":
            raise ValueError("Case is not open for evidence submission.")
        
        case.evidence_submitted.append(f"{document_type}:{document_ref}")
        logger.info(f"Evidence added to case {case_id}.")

    def perform_manual_review(self, case_id: str, reviewer_id: str, approved: bool) -> str:
        """Conducts secondary manual review as per Section 4.3.4."""
        case = self.active_cases.get(case_id)
        if not case:
            raise ValueError("Case not found.")
        
        if approved:
            case.status = "RESOLVED_VERIFIED"
        else:
            case.status = "RESOLVED_DENIED"
            
        logger.info(f"Manual review completed for case {case_id} by {reviewer_id}. Result: {case.status}")
        return case.status

    def purge_expired_data(self):
        """
        Securely purges data older than 24 months as per Section 3.1.5 
        and Section 4.3.7.
        """
        cutoff = datetime.now() - timedelta(days=730)
        expired_cases = [cid for cid, case in self.active_cases.items() if case.created_at < cutoff]
        
        for cid in expired_cases:
            del self.active_cases[cid]
            logger.info(f"Securely purged case {cid} due to retention policy expiration.")

    def get_case_status(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Returns the current status of a discrepancy case."""
        case = self.active_cases.get(case_id)
        if case:
            return {
                "case_id": case.case_id,
                "status": case.status,
                "deadline": case.resolution_deadline.isoformat()
            }
        return None