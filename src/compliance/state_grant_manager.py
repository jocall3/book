import datetime
import uuid
from typing import Dict, Any, List, Optional

class StateGrantManager:
    """
    Manages the application and distribution of State Implementation Grants
    as outlined in the Executive Order: SAFEGUARDING AMERICAN VOTER ELIGIBILITY
    AND ESTABLISHING THE MILITARY FUND.

    This class handles grant allocation calculations, application processing,
    compliance checks, and reporting for states seeking federal funds to
    modernize election systems and enhance citizenship verification.
    """

    # Constants derived from the Executive Order
    BASELINE_GRANT_AMOUNT = 500_000  # Section 3.2.4
    APPLICATION_DEADLINE = datetime.date(2026, 10, 1) # Section 3.2.4
    MILITARY_FUND_MAX_PERCENTAGE = 0.15 # Section 15.1.2 (for total implementation appropriation, not direct state grant factor)

    def __init__(self,
                 eac_guidance_issued: bool = False,
                 total_federal_appropriation: float = 0.0):
        """
        Initializes the StateGrantManager.

        Args:
            eac_guidance_issued (bool): Flag indicating if EAC guidance has been issued.
                                        Crucial for processing applications.
            total_federal_appropriation (float): The total federal funds appropriated
                                                 for the entire Executive Order implementation.
        """
        self.eac_guidance_issued = eac_guidance_issued
        self.total_federal_appropriation = total_federal_appropriation
        self.state_data: Dict[str, Dict[str, Any]] = {} # Stores state-specific data (VAP, registered voters, compliance)
        self.grant_applications: Dict[str, Dict[str, Any]] = {} # Stores submitted grant applications
        self.awarded_grants: Dict[str, Dict[str, Any]] = {} # Stores awarded grants
        self.military_fund_allocation: float = 0.0 # Allocation from total appropriation for military fund integration

        # Placeholder for EAC guidance issuance date, if needed for specific checks
        self.eac_guidance_date: Optional[datetime.date] = None

    def set_eac_guidance_status(self, issued: bool, date: Optional[datetime.date] = None):
        """
        Updates the status of EAC guidance issuance.
        This is a critical prerequisite for states to apply for grants.
        """
        self.eac_guidance_issued = issued
        self.eac_guidance_date = date
        if issued:
            print(f"EAC guidance issued on {date}. States can now apply for grants.")
        else:
            print("EAC guidance not yet issued. Grant applications cannot be fully processed.")

    def update_state_data(self, state_id: str, voting_age_population: int,
                          registered_voters: int, modernization_score: int = 0,
                          security_privacy_score: int = 0,
                          citizenship_verification_compliant: bool = False,
                          notification_mandate_compliant: bool = False,
                          matching_funds_commitment: float = 0.0):
        """
        Updates or adds demographic and compliance data for a specific state.

        Args:
            state_id (str): Unique identifier for the state (e.g., "CA", "NY").
            voting_age_population (int): The state's total voting-age population
                                         (from most recent US Census data).
            registered_voters (int): The total number of registered voters in the state.
            modernization_score (int): A score reflecting the state's existing infrastructure
                                       needs (higher score = greater need). Max 10.
            security_privacy_score (int): A score reflecting the state's commitment to
                                          data security/privacy (NIST certified bonus). Max 10.
            citizenship_verification_compliant (bool): True if state certifies compliance
                                                       with Section 4.1.3.
            notification_mandate_compliant (bool): True if state complies with Section 9.3.5.
            matching_funds_commitment (float): The amount of matching funds the state commits.
        """
        self.state_data[state_id] = {
            "voting_age_population": voting_age_population,
            "registered_voters": registered_voters,
            "modernization_score": modernization_score,
            "security_privacy_score": security_privacy_score,
            "citizenship_verification_compliant": citizenship_verification_compliant,
            "notification_mandate_compliant": notification_mandate_compliant,
            "matching_funds_commitment": matching_funds_commitment
        }
        print(f"State data updated for {state_id}.")

    def calculate_grant_allocation(self, state_id: str, total_vap_national: int, total_registered_voters_national: int) -> float:
        """
        Calculates the potential grant allocation for a state based on the Executive Order's formula.
        Combines elements from Sections 3.2.4, 15.1.2, and 15.2.3.

        Args:
            state_id (str): The ID of the state for which to calculate the grant.
            total_vap_national (int): The total voting-age population across all states.
            total_registered_voters_national (int): The total registered voters across all states.

        Returns:
            float: The calculated grant amount for the state. Returns 0 if state data is missing.
        """
        if state_id not in self.state_data:
            print(f"Error: No data available for state {state_id}.")
            return 0.0

        state_info = self.state_data[state_id]
        grant_amount = self.BASELINE_GRANT_AMOUNT

        # Proportional allocation based on voting-age population (VAP)
        # Assuming a portion of the total appropriation is for proportional distribution
        proportional_pool_vap = 50_000_000 # Example pool for VAP-based distribution
        if total_vap_national > 0:
            vap_proportion = state_info["voting_age_population"] / total_vap_national
            grant_amount += proportional_pool_vap * vap_proportion

        # Proportional allocation based on registered voters (Section 15.2.3)
        proportional_pool_registered = 25_000_000 # Example pool for registered voters-based distribution
        if total_registered_voters_national > 0:
            registered_proportion = state_info["registered_voters"] / total_registered_voters_national
            grant_amount += proportional_pool_registered * registered_proportion

        # Modernization Needs Bonus (Section 15.1.2, 15.2.3)
        # Assuming a max bonus of $10,000 per score point for a score of 10
        grant_amount += state_info["modernization_score"] * 10_000

        # Data Security and Privacy Commitment Bonus (NIST certified bonus) (Section 15.1.2)
        # Assuming a max bonus of $5,000 per score point for a score of 10
        grant_amount += state_info["security_privacy_score"] * 5_000

        # Matching Funds Bonus (Section 15.2.3) - e.g., 50% of matching funds up to a cap
        matching_bonus_cap = 250_000
        grant_amount += min(state_info["matching_funds_commitment"] * 0.5, matching_bonus_cap)

        return round(grant_amount, 2)

    def submit_grant_application(self, state_id: str, application_details: Dict[str, Any]) -> Optional[str]:
        """
        Submits a grant application for a state.

        Args:
            state_id (str): The ID of the state submitting the application.
            application_details (Dict[str, Any]): A dictionary containing application details
                                                 (project_description, budget, timeline, etc.
                                                 as per Section 15.2.5).

        Returns:
            Optional[str]: The application ID if successful, None otherwise.
        """
        if not self.eac_guidance_issued:
            print("Error: EAC guidance has not been issued. Applications cannot be processed yet.")
            return None

        if datetime.date.today() > self.APPLICATION_DEADLINE:
            print(f"Error: Application deadline of {self.APPLICATION_DEADLINE} has passed.")
            return None

        if state_id not in self.state_data:
            print(f"Error: State data for {state_id} is missing. Please update state data first.")
            return None

        application_id = str(uuid.uuid4())
        self.grant_applications[application_id] = {
            "state_id": state_id,
            "submission_date": datetime.date.today(),
            "status": "Submitted",
            "details": application_details,
            "compliance_checks": {} # To store results of compliance checks
        }
        print(f"Grant application for {state_id} submitted with ID: {application_id}.")
        return application_id

    def _check_state_compliance(self, state_id: str) -> Dict[str, Any]:
        """
        Internal method to check a state's compliance with Executive Order mandates.
        (Sections 4.1.3 and 9.3.5)
        """
        if state_id not in self.state_data:
            return {"overall_compliant": False, "reason": "State data missing."}

        state_info = self.state_data[state_id]
        compliance_status = {
            "citizenship_verification_compliant": state_info.get("citizenship_verification_compliant", False),
            "notification_mandate_compliant": state_info.get("notification_mandate_compliant", False)
        }
        
        reasons = []
        if not compliance_status["citizenship_verification_compliant"]:
            reasons.append("Non-compliant with Section 4.1.3 (Citizenship Verification Program).")
        if not compliance_status["notification_mandate_compliant"]:
            reasons.append("Non-compliant with Section 9.3.5 (Public Notification Mandates).")

        overall_compliant = all(compliance_status.values())
        compliance_status["overall_compliant"] = overall_compliant
        if not overall_compliant:
            compliance_status["reason"] = " ".join(reasons)
        return compliance_status

    def review_and_award_grant(self, application_id: str, total_vap_national: int, total_registered_voters_national: int) -> Optional[Dict[str, Any]]:
        """
        Reviews a submitted grant application, performs compliance checks,
        calculates allocation, and awards the grant if eligible.

        Args:
            application_id (str): The ID of the grant application to review.
            total_vap_national (int): The total voting-age population across all states.
            total_registered_voters_national (int): The total registered voters across all states.

        Returns:
            Optional[Dict[str, Any]]: The awarded grant details if successful, None otherwise.
        """
        if application_id not in self.grant_applications:
            print(f"Error: Application with ID {application_id} not found.")
            return None

        application = self.grant_applications[application_id]
        state_id = application["state_id"]

        # 1. Perform compliance checks (Section 4.1.3, 9.3.5)
        compliance_results = self._check_state_compliance(state_id)
        application["compliance_checks"] = compliance_results

        if not compliance_results["overall_compliant"]:
            application["status"] = f"Denied - Non-compliant: {compliance_results.get('reason', 'Unknown reason')}"
            print(f"Grant application {application_id} for {state_id} denied due to non-compliance.")
            return None

        # 2. Calculate potential allocation
        calculated_amount = self.calculate_grant_allocation(state_id, total_vap_national, total_registered_voters_national)
        if calculated_amount <= 0:
            application["status"] = "Denied - Zero Allocation"
            print(f"Grant application {application_id} for {state_id} denied due to zero or negative calculated allocation.")
            return None

        # 3. Simulate fund distribution (simplified)
        # In a real system, this would involve actual financial transactions and budget checks.
        awarded_amount = calculated_amount # For simplicity, award the calculated amount

        # 4. Update records
        application["status"] = "Approved"
        self.awarded_grants[application_id] = {
            "state_id": state_id,
            "application_id": application_id,
            "awarded_amount": awarded_amount,
            "award_date": datetime.date.today(),
            "eligible_uses": application["details"].get("eligible_uses", "General modernization and verification") # From 15.2.4
        }
        print(f"Grant application {application_id} for {state_id} approved. Awarded: ${awarded_amount:,.2f}.")
        return self.awarded_grants[application_id]

    def get_awarded_grants_by_state(self, state_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all grants awarded to a specific state.
        """
        return [grant for grant in self.awarded_grants.values() if grant["state_id"] == state_id]

    def get_all_awarded_grants(self) -> List[Dict[str, Any]]:
        """
        Retrieves all awarded grants.
        """
        return list(self.awarded_grants.values())

    def get_application_status(self, application_id: str) -> Optional[str]:
        """
        Returns the status of a specific grant application.
        """
        return self.grant_applications.get(application_id, {}).get("status")

    def set_military_fund_allocation(self, percentage: float):
        """
        Sets the percentage of the total federal appropriation to be allocated
        to the military fund for integration and enhancement of systems.
        (Section 15.1.2)
        """
        if not (0 <= percentage <= self.MILITARY_FUND_MAX_PERCENTAGE):
            print(f"Warning: Military fund percentage must be between 0 and {self.MILITARY_FUND_MAX_PERCENTAGE*100}%.")
            return

        self.military_fund_allocation = self.total_federal_appropriation * percentage
        print(f"Military fund allocated: ${self.military_fund_allocation:,.2f} ({(percentage*100):.2f}% of total appropriation).")

    def get_military_fund_status(self) -> float:
        """
        Returns the current allocation to the military fund.
        """
        return self.military_fund_allocation

    def submit_quarterly_report(self, state_id: str, report_data: Dict[str, Any]) -> bool:
        """
        Simulates the submission of a quarterly report by a grantee state to the Attorney General.
        (Section 15.2.6)

        Args:
            state_id (str): The ID of the state submitting the report.
            report_data (Dict[str, Any]): The content of the quarterly report.

        Returns:
            bool: True if the report is "submitted" successfully, False otherwise.
        """
        # In a real system, this would involve storing the report, validation, etc.
        # For this simulation, we just acknowledge receipt.
        if state_id not in self.state_data:
            print(f"Error: State {state_id} is not recognized as a potential grantee.")
            return False

        # Check if the state has an active grant (simplified check)
        if not any(grant["state_id"] == state_id for grant in self.awarded_grants.values()):
            print(f"Warning: State {state_id} is submitting a report but has no active grants.")

        print(f"Quarterly report from {state_id} received by Attorney General's office (simulated).")
        # Here, you would typically store `report_data` in a database associated with the state and grant.
        return True