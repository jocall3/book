import uuid
import datetime
from dataclasses import dataclass
from typing import List, Dict, Literal

# Define program types for type safety and clarity, based on the Executive Order.
ProgramType = Literal[
    "state_reimbursement",
    "mobile_verification_units",
    "records_modernization",
    "infrastructure_security"
]

@dataclass
class Disbursement:
    """Represents a single disbursement transaction from the Military Fund."""
    transaction_id: str
    timestamp: datetime.datetime
    program: ProgramType
    recipient: str
    amount: float
    details: Dict[str, any]
    status: Literal["approved", "denied"]

class MilitaryFundManager:
    """
    Manages the appropriations, allocations, and grants for the Military Fund.

    This class handles the financial operations of the Military Fund as established
    by the Executive Order, ensuring funds are allocated and disbursed according
    to the specified mandates for election integrity and citizen assistance.
    """

    MAX_ALLOCATION_PERCENTAGE = 15.0

    def __init__(self, total_implementation_appropriation: float):
        """
        Initializes the MilitaryFundManager.

        Args:
            total_implementation_appropriation (float): The total annual
                appropriation for the overall SAVE America Act implementation.
        """
        if total_implementation_appropriation < 0:
            raise ValueError("Total implementation appropriation cannot be negative.")
        
        self.total_implementation_appropriation = total_implementation_appropriation
        self.military_fund_percentage: float = 0.0
        self.total_budget: float = 0.0
        self.unallocated_balance: float = 0.0
        
        self.allocations: Dict[ProgramType, float] = {
            "state_reimbursement": 0.0,
            "mobile_verification_units": 0.0,
            "records_modernization": 0.0,
            "infrastructure_security": 0.0
        }
        
        self.disbursements: List[Disbursement] = []

    def set_annual_allocation_percentage(
        self, 
        percentage: float, 
        secretary_of_defense: str, 
        attorney_general: str
    ) -> bool:
        """
        Sets the annual percentage of the total appropriation for the Military Fund.

        This action simulates the annual determination by the Secretary of Defense
        and the Attorney General, as per Section 15.1.2.

        Args:
            percentage (float): The percentage to allocate (0 to 15).
            secretary_of_defense (str): Name of the approving Secretary of Defense.
            attorney_general (str): Name of the approving Attorney General.

        Returns:
            bool: True if the allocation was set successfully, False otherwise.
        """
        if not (0 <= percentage <= self.MAX_ALLOCATION_PERCENTAGE):
            print(f"Error: Percentage must be between 0 and {self.MAX_ALLOCATION_PERCENTAGE}.")
            return False

        self.military_fund_percentage = percentage
        self.total_budget = (self.total_implementation_appropriation * percentage) / 100.0
        self.unallocated_balance = self.total_budget
        
        # Reset previous allocations and disbursements for the new fiscal period
        self.allocations = {key: 0.0 for key in self.allocations}
        self.disbursements = []

        print(f"Annual Military Fund budget set to ${self.total_budget:,.2f} ({percentage}%) "
              f"by SoD {secretary_of_defense} and AG {attorney_general}.")
        return True

    def allocate_funds_for_program(self, program: ProgramType, amount: float) -> bool:
        """
        Earmarks funds from the unallocated balance for a specific program.

        Args:
            program (ProgramType): The program to allocate funds to.
            amount (float): The amount of money to allocate.

        Returns:
            bool: True if funds were successfully allocated, False otherwise.
        """
        if amount <= 0:
            print("Error: Allocation amount must be positive.")
            return False
        if amount > self.unallocated_balance:
            print(f"Error: Insufficient unallocated balance. "
                  f"Requested ${amount:,.2f}, Available ${self.unallocated_balance:,.2f}.")
            return False

        self.unallocated_balance -= amount
        self.allocations[program] += amount
        print(f"Successfully allocated ${amount:,.2f} to the '{program}' program.")
        return True

    def process_reimbursement_request(
        self, 
        state: str, 
        vital_records_office: str, 
        amount: float, 
        documentation_count: int
    ) -> Disbursement:
        """
        Processes a reimbursement request for state vital records offices.

        As per Section 20.1, this reimburses states for costs associated with
        issuing citizenship documents to citizens with financial hardship.

        Args:
            state (str): The state requesting reimbursement.
            vital_records_office (str): The specific office within the state.
            amount (float): The total reimbursement amount requested.
            documentation_count (int): The number of documents issued.

        Returns:
            Disbursement: A record of the transaction.
        """
        program: ProgramType = "state_reimbursement"
        details = {
            "state": state,
            "vital_records_office": vital_records_office,
            "documentation_count": documentation_count
        }
        
        if self.allocations[program] >= amount:
            self.allocations[program] -= amount
            status = "approved"
        else:
            status = "denied"
            details["reason"] = "Insufficient allocated funds for this program."

        return self._log_disbursement(program, f"{vital_records_office}, {state}", amount, details, status)

    def approve_mobile_unit_grant(
        self, 
        state: str, 
        coordinating_agency: str, 
        amount: float, 
        proposal_id: str
    ) -> Disbursement:
        """
        Approves a grant for Mobile Verification Units.

        As per Section 21.3, this funds DHS and state efforts to provide
        verification services to rural or underserved communities.

        Args:
            state (str): The state where the units will operate.
            coordinating_agency (str): The agency managing the grant (e.g., DHS).
            amount (float): The grant amount.
            proposal_id (str): The unique identifier for the grant proposal.

        Returns:
            Disbursement: A record of the transaction.
        """
        program: ProgramType = "mobile_verification_units"
        details = {
            "state": state,
            "coordinating_agency": coordinating_agency,
            "proposal_id": proposal_id
        }

        if self.allocations[program] >= amount:
            self.allocations[program] -= amount
            status = "approved"
        else:
            status = "denied"
            details["reason"] = "Insufficient allocated funds for this program."

        return self._log_disbursement(program, f"{coordinating_agency} ({state})", amount, details, status)

    def fund_records_modernization_project(
        self, 
        agency: str, 
        project_id: str, 
        amount: float
    ) -> Disbursement:
        """
        Funds a project for modernizing military service record verification systems.

        As per Section 15.1.2, this supports enhancing systems for verifying
        military records for citizenship purposes.

        Args:
            agency (str): The agency undertaking the project (e.g., DoD, NARA).
            project_id (str): The unique identifier for the modernization project.
            amount (float): The amount of funding requested.

        Returns:
            Disbursement: A record of the transaction.
        """
        program: ProgramType = "records_modernization"
        details = {"agency": agency, "project_id": project_id}

        if self.allocations[program] >= amount:
            self.allocations[program] -= amount
            status = "approved"
        else:
            status = "denied"
            details["reason"] = "Insufficient allocated funds for this program."

        return self._log_disbursement(program, agency, amount, details, status)

    def issue_infrastructure_security_grant(
        self, 
        state: str, 
        project_description: str, 
        amount: float
    ) -> Disbursement:
        """
        Issues a grant to secure election infrastructure.

        As per Section 1.4, this integrates defense and military funds to
        secure critical election systems.

        Args:
            state (str): The state receiving the grant.
            project_description (str): A brief description of the security project.
            amount (float): The amount of the grant.

        Returns:
            Disbursement: A record of the transaction.
        """
        program: ProgramType = "infrastructure_security"
        details = {"state": state, "project_description": project_description}

        if self.allocations[program] >= amount:
            self.allocations[program] -= amount
            status = "approved"
        else:
            status = "denied"
            details["reason"] = "Insufficient allocated funds for this program."

        return self._log_disbursement(program, f"State of {state}", amount, details, status)

    def _log_disbursement(
        self, 
        program: ProgramType, 
        recipient: str, 
        amount: float, 
        details: Dict,
        status: Literal["approved", "denied"]
    ) -> Disbursement:
        """A helper method to create and log a disbursement record."""
        transaction = Disbursement(
            transaction_id=str(uuid.uuid4()),
            timestamp=datetime.datetime.now(datetime.timezone.utc),
            program=program,
            recipient=recipient,
            amount=amount,
            details=details,
            status=status
        )
        self.disbursements.append(transaction)
        print(f"Transaction {transaction.transaction_id} logged with status: {status.upper()}.")
        return transaction

    def get_fund_status(self) -> Dict[str, any]:
        """
        Provides a summary of the current financial status of the Military Fund.

        Returns:
            A dictionary containing key financial metrics.
        """
        total_disbursed = sum(d.amount for d in self.disbursements if d.status == "approved")
        total_allocated_to_programs = sum(self.allocations.values())
        
        return {
            "total_budget": self.total_budget,
            "unallocated_balance": self.unallocated_balance,
            "total_allocated_to_programs": total_allocated_to_programs,
            "total_disbursed": total_disbursed,
            "current_program_allocations": self.allocations,
            "disbursement_count": len(self.disbursements)
        }

    def generate_annual_report(self) -> Dict[str, any]:
        """
        Generates a comprehensive annual report of the fund's activities.

        Returns:
            A dictionary structured as an annual report.
        """
        status = self.get_fund_status()
        report = {
            "report_generated_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "fiscal_period_summary": {
                "total_implementation_appropriation": self.total_implementation_appropriation,
                "military_fund_percentage": self.military_fund_percentage,
                "military_fund_total_budget": status["total_budget"],
                "total_disbursed": status["total_disbursed"],
                "final_unallocated_balance": status["unallocated_balance"],
                "final_program_balances": status["current_program_allocations"]
            },
            "disbursements_by_program": {
                prog: [d.__dict__ for d in self.disbursements if d.program == prog]
                for prog in self.allocations.keys()
            },
            "full_transaction_log": [d.__dict__ for d in self.disbursements]
        }
        return report