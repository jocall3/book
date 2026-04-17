"""
Core logic for enforcing the Executive Order's citizenship verification mandates.

This module provides the central PolicyEngine for processing voter registration
applications against the criteria established in the "EXECUTIVE ORDER:
SAFEGUARDING AMERICAN VOTER ELIGIBILITY AND ESTABLISHING THE MILITARY FUND".

It simulates interactions with federal databases (DHS SAVE, SSA, DoD) and
evaluates submitted documentation to determine an applicant's verification status.
"""

import datetime
from enum import Enum, auto
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass, field

# --- Constants and Enums ---

class VerificationStatus(Enum):
    """Represents the outcome of a citizenship verification check."""
    VERIFIED = auto()
    FAILED_NON_CITIZEN = auto()
    DISCREPANCY_FOUND = auto()
    PROVISIONAL_PENDING_PROOF = auto()
    ACCOMMODATION_PENDING_SECONDARY_VERIFICATION = auto()
    INSUFFICIENT_DOCUMENTATION = auto()
    PENDING_MANUAL_REVIEW = auto()

class Agency(Enum):
    """Enumeration of relevant government agencies for verification."""
    DHS_SAVE = "Department of Homeland Security (SAVE Program)"
    SSA = "Social Security Administration"
    DOD = "Department of Defense"
    STATE_VITAL_RECORDS = "State Vital Records Office"
    DEPT_OF_STATE = "Department of State"
    DEPT_OF_WAR = "Department of War (Historical)"
    FEDERALLY_RECOGNIZED_TRIBE = "Federally Recognized Indian Tribe"

class DocumentType(Enum):
    """Enumeration of acceptable document types for citizenship verification."""
    # Primary Documents (Sec 2.1, 2.2, 3.1.2)
    US_PASSPORT = "United States Passport or Passport Card"
    REAL_ID_CITIZENSHIP_CONFIRMED = "REAL ID-Compliant License/ID with Citizenship Verification"
    BIRTH_CERTIFICATE = "Certified Birth Certificate"
    CERTIFICATE_OF_NATURALIZATION = "Certificate of Naturalization"
    CERTIFICATE_OF_CITIZENSHIP = "Certificate of Citizenship"
    CONSULAR_REPORT_OF_BIRTH_ABROAD = "Consular Report of Birth Abroad (FS-240)"
    DOD_ID_CITIZENSHIP_CONFIRMED = "Department of Defense ID with Citizenship Verification"
    DD_214_CITIZENSHIP_CONFIRMED = "DD Form 214 with Citizenship Verification"
    DEPT_OF_WAR_RECORD = "Department of War Historical Birth/Service Record"
    TRIBAL_ID_CITIZENSHIP_CONFIRMED = "Tribal ID with Citizenship Verification"

    # Alternative/Secondary Documents (Sec 4.2.2)
    HOSPITAL_BIRTH_RECORD = "Hospital Birth Record (at or near time of birth)"
    CENSUS_RECORD = "U.S. Census Record"
    EARLY_SCHOOL_RECORD = "Early School Record"
    BAPTISMAL_CERTIFICATE = "Baptismal Certificate (at or near time of birth)"
    
    # Attestations (Sec 4.2.3)
    SWORN_AFFIDAVIT_OF_CITIZENSHIP = "Sworn Affidavit of Citizenship"
    CORROBORATING_WITNESS_AFFIDAVIT = "Corroborating Witness Affidavit"
    DISABILITY_ACCOMMODATION_ATTESTATION = "Sworn Attestation for Disability Accommodation"


# --- Data Structures ---

@dataclass
class SubmittedDocument:
    """Represents a document submitted by a voter applicant."""
    doc_type: DocumentType
    issuing_authority: Agency
    document_id: Optional[str] = None
    expiration_date: Optional[datetime.date] = None
    issue_date: Optional[datetime.date] = None
    details: Dict[str, Any] = field(default_factory=dict)

@dataclass
class VoterApplicant:
    """Represents the data for a voter registration applicant."""
    full_name: str
    date_of_birth: datetime.date
    ssn_last_4: Optional[str] = None
    has_disability_preventing_documentation: bool = False

@dataclass
class VerificationRequest:
    """Bundles an applicant and their documents for a verification request."""
    applicant: VoterApplicant
    documents: List[SubmittedDocument]
    registration_method: str  # e.g., "in-person", "mail-in", "dmv"

@dataclass
class VerificationResult:
    """Encapsulates the outcome of a verification check."""
    status: VerificationStatus
    message: str
    discrepancy_details: Optional[Dict[str, Any]] = None
    provisional_deadline: Optional[datetime.datetime] = None
    required_next_steps: List[str] = field(default_factory=list)


# --- Mock External Service Clients ---

class MockDHSSaveClient:
    """A mock client for the DHS Systematic Alien Verification for Entitlements (SAVE) program."""
    def verify_citizenship(self, applicant: VoterApplicant) -> Dict[str, Any]:
        """Simulates a SAVE query based on applicant name."""
        # Simulate different outcomes for testing purposes
        if "Citizen" in applicant.full_name:
            return {"status": "CITIZEN", "verified": True}
        if "NonCitizen" in applicant.full_name:
            return {"status": "NON_CITIZEN", "verified": False}
        if "Discrepancy" in applicant.full_name:
            return {"status": "DISCREPANCY", "verified": False, "details": "Name mismatch in federal records."}
        return {"status": "RECORD_NOT_FOUND", "verified": False}

class MockSSAClient:
    """A mock client for the Social Security Administration."""
    def verify_identity(self, applicant: VoterApplicant) -> bool:
        """Simulates an identity check with the SSA."""
        return applicant.ssn_last_4 is not None and "Invalid" not in applicant.full_name

class MockDoDClient:
    """A mock client for the Department of Defense records, including historical Dept. of War records."""
    def verify_military_record(self, document: SubmittedDocument) -> bool:
        """Simulates verification of military documentation."""
        # Recognizes both modern and historical records as valid for this mock
        if document.doc_type in [
            DocumentType.DOD_ID_CITIZENSHIP_CONFIRMED,
            DocumentType.DD_214_CITIZENSHIP_CONFIRMED,
            DocumentType.DEPT_OF_WAR_RECORD
        ]:
            return "invalid" not in document.document_id.lower()
        return False


# --- Core Policy Engine ---

class PolicyEngine:
    """
    Enforces the citizenship verification mandates of the Executive Order.
    """
    def __init__(self):
        """Initializes the PolicyEngine with mock clients for federal agencies."""
        self.save_client = MockDHSSaveClient()
        self.ssa_client = MockSSAClient()
        self.dod_client = MockDoDClient()
        self.today = datetime.date.today()

    def _is_document_expired(self, doc: SubmittedDocument) -> bool:
        """Checks if a document is expired."""
        return doc.expiration_date is not None and doc.expiration_date < self.today

    def _get_primary_documents(self, documents: List[SubmittedDocument]) -> List[SubmittedDocument]:
        """Filters for valid, unexpired primary documents per Sec 3.1.2."""
        primary_doc_types = [
            DocumentType.US_PASSPORT,
            DocumentType.REAL_ID_CITIZENSHIP_CONFIRMED,
            DocumentType.BIRTH_CERTIFICATE,
            DocumentType.CERTIFICATE_OF_NATURALIZATION,
            DocumentType.CERTIFICATE_OF_CITIZENSHIP,
            DocumentType.CONSULAR_REPORT_OF_BIRTH_ABROAD,
            DocumentType.DOD_ID_CITIZENSHIP_CONFIRMED,
            DocumentType.DD_214_CITIZENSHIP_CONFIRMED,
            DocumentType.DEPT_OF_WAR_RECORD,
        ]
        return [doc for doc in documents if doc.doc_type in primary_doc_types and not self._is_document_expired(doc)]

    def _handle_disability_accommodation(self, request: VerificationRequest) -> VerificationResult:
        """
        Handles verification for individuals with disabilities per Sec 3.5.
        Accepts a sworn attestation and triggers secondary database verification.
        """
        has_attestation = any(doc.doc_type == DocumentType.DISABILITY_ACCOMMODATION_ATTESTATION for doc in request.documents)
        if not has_attestation:
            return VerificationResult(
                status=VerificationStatus.INSUFFICIENT_DOCUMENTATION,
                message="Disability accommodation requires a sworn attestation.",
                required_next_steps=["Submit a sworn attestation of citizenship."]
            )

        # Per Sec 3.5.4, attestation must be followed by secondary verification
        save_result = self.save_client.verify_citizenship(request.applicant)
        ssa_result = self.ssa_client.verify_identity(request.applicant)

        if save_result.get("verified") and ssa_result:
            return VerificationResult(status=VerificationStatus.VERIFIED, message="Citizenship verified via disability accommodation and secondary database checks.")
        else:
            return VerificationResult(
                status=VerificationStatus.ACCOMMODATION_PENDING_SECONDARY_VERIFICATION,
                message="Disability attestation received, but secondary verification failed. Manual review required.",
                discrepancy_details={"save_status": save_result.get("status"), "ssa_verified": ssa_result},
                required_next_steps=["Await contact from an election official for manual review."]
            )

    def verify_voter_eligibility(self, request: VerificationRequest) -> VerificationResult:
        """
        The main method to verify a voter's eligibility based on the Executive Order.

        Args:
            request: A VerificationRequest object containing applicant and document info.

        Returns:
            A VerificationResult object with the outcome.
        """
        # Sec 3.5: Handle disability accommodations first
        if request.applicant.has_disability_preventing_documentation:
            return self._handle_disability_accommodation(request)

        # Sec 3.1: Check for primary documentary proof of citizenship
        primary_docs = self._get_primary_documents(request.documents)
        if primary_docs:
            # A valid primary document is present, now verify against federal systems
            save_result = self.save_client.verify_citizenship(request.applicant)
            
            if save_result.get("verified"):
                return VerificationResult(status=VerificationStatus.VERIFIED, message="Citizenship verified with primary documentation and federal database check.")
            
            elif save_result.get("status") == "DISCREPANCY":
                return VerificationResult(
                    status=VerificationStatus.DISCREPANCY_FOUND,
                    message="A discrepancy was found between the submitted document and federal records.",
                    discrepancy_details=save_result.get("details"),
                    required_next_steps=["Respond to the official notice within 30 days to cure the discrepancy."]
                )
            else: # FAILED_NON_CITIZEN or RECORD_NOT_FOUND
                return VerificationResult(
                    status=VerificationStatus.FAILED_NON_CITIZEN,
                    message="Federal databases indicate the applicant is not a U.S. citizen.",
                    discrepancy_details={"save_status": save_result.get("status")}
                )

        # Sec 3.3: Handle mail-in registration without prior proof
        if request.registration_method == "mail-in" and not primary_docs:
            deadline = datetime.datetime.now() + datetime.timedelta(hours=48)
            return VerificationResult(
                status=VerificationStatus.PROVISIONAL_PENDING_PROOF,
                message="Mail-in registration requires in-person proof of citizenship. A provisional ballot may be cast.",
                provisional_deadline=deadline,
                required_next_steps=[
                    "Present original documentary proof of citizenship in person to an election official.",
                    f"Proof must be presented within 48 hours of poll closing to count the provisional ballot."
                ]
            )
            
        # Sec 3.1.3: Handle cases with only an attestation (not for disability)
        has_attestation = any(doc.doc_type == DocumentType.SWORN_AFFIDAVIT_OF_CITIZENSHIP for doc in request.documents)
        if has_attestation and not primary_docs:
            return VerificationResult(
                status=VerificationStatus.INSUFFICIENT_DOCUMENTATION,
                message="A sworn attestation alone is not sufficient proof. It must be accompanied by primary documentation.",
                required_next_steps=["Provide a form of primary documentary proof of citizenship."]
            )

        # Default case: No valid primary documentation provided
        return VerificationResult(
            status=VerificationStatus.INSUFFICIENT_DOCUMENTATION,
            message="No valid, unexpired primary documentary proof of U.S. citizenship was provided.",
            required_next_steps=["Provide an acceptable form of primary documentation as listed in Sec 2.1 of the Executive Order."]
        )


if __name__ == '__main__':
    # --- Example Usage ---
    engine = PolicyEngine()
    print("--- Running Policy Engine Verification Scenarios ---\n")

    # Scenario 1: Clear-cut case, valid passport (Sec 3.1.2)
    print("Scenario 1: Valid Passport, In-Person Registration")
    applicant1 = VoterApplicant(full_name="John Citizen", date_of_birth=datetime.date(1980, 5, 15), ssn_last_4="1234")
    doc1 = SubmittedDocument(
        doc_type=DocumentType.US_PASSPORT,
        issuing_authority=Agency.DEPT_OF_STATE,
        document_id="P123456",
        expiration_date=datetime.date(2030, 1, 1)
    )
    request1 = VerificationRequest(applicant=applicant1, documents=[doc1], registration_method="in-person")
    result1 = engine.verify_voter_eligibility(request1)
    print(f"Status: {result1.status.name}")
    print(f"Message: {result1.message}\n")
    assert result1.status == VerificationStatus.VERIFIED

    # Scenario 2: Non-citizen attempt (Sec 6.1)
    print("Scenario 2: Non-Citizen Applicant")
    applicant2 = VoterApplicant(full_name="Jane NonCitizen", date_of_birth=datetime.date(1992, 3, 10))
    doc2 = SubmittedDocument(
        doc_type=DocumentType.REAL_ID_CITIZENSHIP_CONFIRMED, # Document claims citizenship
        issuing_authority=Agency.STATE_VITAL_RECORDS,
        document_id="D98765",
        expiration_date=datetime.date(2028, 1, 1)
    )
    request2 = VerificationRequest(applicant=applicant2, documents=[doc2], registration_method="dmv")
    result2 = engine.verify_voter_eligibility(request2)
    print(f"Status: {result2.status.name}")
    print(f"Message: {result2.message}\n")
    assert result2.status == VerificationStatus.FAILED_NON_CITIZEN

    # Scenario 3: Mail-in registration with no initial proof (Sec 3.3)
    print("Scenario 3: Mail-In Registration, No Documents")
    applicant3 = VoterApplicant(full_name="Mail-in Citizen", date_of_birth=datetime.date(1975, 11, 20))
    request3 = VerificationRequest(applicant=applicant3, documents=[], registration_method="mail-in")
    result3 = engine.verify_voter_eligibility(request3)
    print(f"Status: {result3.status.name}")
    print(f"Message: {result3.message}")
    print(f"Next Steps: {result3.required_next_steps}\n")
    assert result3.status == VerificationStatus.PROVISIONAL_PENDING_PROOF

    # Scenario 4: Discrepancy found (Sec 4.3)
    print("Scenario 4: Discrepancy in Federal Records")
    applicant4 = VoterApplicant(full_name="Discrepancy Citizen", date_of_birth=datetime.date(1988, 8, 8))
    doc4 = SubmittedDocument(
        doc_type=DocumentType.BIRTH_CERTIFICATE,
        issuing_authority=Agency.STATE_VITAL_RECORDS,
        document_id="BC555444"
    )
    request4 = VerificationRequest(applicant=applicant4, documents=[doc4], registration_method="in-person")
    result4 = engine.verify_voter_eligibility(request4)
    print(f"Status: {result4.status.name}")
    print(f"Message: {result4.message}")
    print(f"Details: {result4.discrepancy_details}\n")
    assert result4.status == VerificationStatus.DISCREPANCY_FOUND

    # Scenario 5: Disability accommodation (Sec 3.5)
    print("Scenario 5: Disability Accommodation with Attestation")
    applicant5 = VoterApplicant(
        full_name="Accommodated Citizen",
        date_of_birth=datetime.date(1960, 2, 29),
        ssn_last_4="5678",
        has_disability_preventing_documentation=True
    )
    doc5 = SubmittedDocument(
        doc_type=DocumentType.DISABILITY_ACCOMMODATION_ATTESTATION,
        issuing_authority=Agency.STATE_VITAL_RECORDS # Placeholder
    )
    request5 = VerificationRequest(applicant=applicant5, documents=[doc5], registration_method="agency-based")
    result5 = engine.verify_voter_eligibility(request5)
    print(f"Status: {result5.status.name}")
    print(f"Message: {result5.message}\n")
    assert result5.status == VerificationStatus.VERIFIED

    # Scenario 6: Attestation alone is not sufficient (Sec 3.1.3)
    print("Scenario 6: Attestation Submitted Without Primary Docs")
    applicant6 = VoterApplicant(full_name="Attestation Only Citizen", date_of_birth=datetime.date(1995, 1, 1))
    doc6 = SubmittedDocument(
        doc_type=DocumentType.SWORN_AFFIDAVIT_OF_CITIZENSHIP,
        issuing_authority=Agency.STATE_VITAL_RECORDS
    )
    request6 = VerificationRequest(applicant=applicant6, documents=[doc6], registration_method="in-person")
    result6 = engine.verify_voter_eligibility(request6)
    print(f"Status: {result6.status.name}")
    print(f"Message: {result6.message}\n")
    assert result6.status == VerificationStatus.INSUFFICIENT_DOCUMENTATION

    # Scenario 7: Historical Dept. of War record
    print("Scenario 7: Veteran with Historical Dept. of War Record")
    applicant7 = VoterApplicant(full_name="Veteran Citizen", date_of_birth=datetime.date(1945, 6, 6))
    doc7 = SubmittedDocument(
        doc_type=DocumentType.DEPT_OF_WAR_RECORD,
        issuing_authority=Agency.DEPT_OF_WAR,
        document_id="DW-1945-XYZ"
    )
    request7 = VerificationRequest(applicant=applicant7, documents=[doc7], registration_method="in-person")
    result7 = engine.verify_voter_eligibility(request7)
    print(f"Status: {result7.status.name}")
    print(f"Message: {result7.message}\n")
    assert result7.status == VerificationStatus.VERIFIED