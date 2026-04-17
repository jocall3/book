import requests
import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration for SAVE API integration
SAVE_API_ENDPOINT = "https://api.save.uscis.gov/v1/verify"
TIMEOUT_SECONDS = 30

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("save_integration")

class SAVEIntegration:
    """
    Interface for the Systematic Alien Verification for Entitlements (SAVE) program
    as mandated by the Executive Order for citizenship verification.
    """

    def __init__(self, api_key: str, agency_id: str):
        self.api_key = api_key
        self.agency_id = agency_id
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": self.api_key,
            "X-Agency-ID": self.agency_id,
            "User-Agent": "Federal-Election-Integrity-System/1.0"
        }

    def verify_citizenship(self, voter_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Queries the SAVE system to verify the citizenship status of a voter applicant.
        
        :param voter_data: Dictionary containing applicant details (e.g., SSN, Name, DOB)
        :return: Verification result from the SAVE system
        """
        payload = {
            "request_type": "CITIZENSHIP_VERIFICATION",
            "timestamp": datetime.utcnow().isoformat(),
            "applicant": voter_data
        }

        try:
            response = requests.post(
                SAVE_API_ENDPOINT,
                headers=self.headers,
                data=json.dumps(payload),
                timeout=TIMEOUT_SECONDS
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"SAVE API connection error: {str(e)}")
            return {"status": "ERROR", "message": "Verification service unavailable"}

    def get_status_by_case_id(self, case_id: str) -> Dict[str, Any]:
        """
        Retrieves the status of a previously submitted verification case.
        """
        try:
            response = requests.get(
                f"{SAVE_API_ENDPOINT}/case/{case_id}",
                headers=self.headers,
                timeout=TIMEOUT_SECONDS
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to retrieve case {case_id}: {str(e)}")
            return {"status": "ERROR", "message": "Case retrieval failed"}

    def log_verification_event(self, voter_id: str, result: str):
        """
        Internal logging for audit trails as required by Section 5.3.4.
        """
        log_entry = {
            "voter_id": voter_id,
            "result": result,
            "timestamp": datetime.utcnow().isoformat(),
            "action": "CITIZENSHIP_VERIFICATION_QUERY"
        }
        logger.info(f"Audit Log: {json.dumps(log_entry)}")

def create_save_client(api_key: str, agency_id: str) -> SAVEIntegration:
    """
    Factory function to initialize the SAVE integration client.
    """
    return SAVEIntegration(api_key, agency_id)