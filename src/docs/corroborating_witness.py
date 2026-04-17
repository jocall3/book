"""
Generator for Corroborating Witness Affidavit forms.

This module provides functionality to generate the text content for a
Corroborating Witness Affidavit, as mandated by Section 4.2.3(c) and 4.2.5(a)
of the Executive Order: SAFEGUARDING AMERICAN VOTER ELIGIBILITY AND
ESTABLISHING THE MILITARY FUND.

The generated affidavit includes details about the witness, their relationship
to the applicant, and their sworn attestation of the applicant's U.S. citizenship.
It also includes a warning about penalties for false statements.
"""

import datetime
from typing import Dict, Any, Optional

class CorroboratingWitnessAffidavitGenerator:
    """
    Generates the text content for a Corroborating Witness Affidavit.

    This class takes details for both the corroborating witness and the
    voter registration applicant, validates them against the Executive Order's
    requirements, and produces a formatted affidavit string.
    """

    AFFIDAVIT_TEMPLATE = """
UNIFORM CORROBORATING WITNESS AFFIDAVIT OF CITIZENSHIP
(Pursuant to Executive Order: Safeguarding American Voter Eligibility, Section 4.2.3(c))

STATE OF {witness_state}
COUNTY OF {witness_county}

I, {witness_full_name}, being duly sworn, depose and state the following under penalty of perjury:

1.  I am a citizen of the United States of America.
2.  My current residential address is: {witness_address}, {witness_city}, {witness_state} {witness_zip}.
3.  I am providing this affidavit to corroborate the United States citizenship of
    {applicant_full_name} (hereinafter "the Applicant"), who is applying to register to vote.
4.  I have known the Applicant for approximately {duration_of_acquaintance}.
5.  My relationship to the Applicant is: {relationship_to_applicant}.
    I affirm that I am NOT the Applicant's spouse or parent.
6.  I have personal knowledge that the Applicant is a citizen of the United States.
    The basis for my personal knowledge is as follows:
    {basis_of_knowledge}

I understand that providing a false statement in this affidavit is a felony punishable
by fines and/or imprisonment under Federal law, including 18 U.S.C. § 1001.

I declare under penalty of perjury under the laws of the United States of America
that the foregoing is true and correct.

Executed on this {day} day of {month}, {year}.

_________________________________________
Signature of Corroborating Witness

_________________________________________
Printed Name of Corroborating Witness

---
FOR OFFICIAL USE ONLY:
Applicant's Full Legal Name: {applicant_full_name}
Applicant's Date of Birth: {applicant_dob}
Applicant's Place of Birth: {applicant_pob}
"""

    def __init__(self):
        """Initializes the generator."""
        pass

    def validate_witness_data(self, witness_data: Dict[str, Any]) -> None:
        """
        Validates the provided witness data against Executive Order requirements.

        Args:
            witness_data (Dict[str, Any]): A dictionary containing witness details.
                Expected keys: 'full_name', 'address', 'city', 'state', 'zip',
                'is_us_citizen', 'relationship_to_applicant',
                'duration_of_acquaintance', 'basis_of_knowledge'.

        Raises:
            ValueError: If any required data is missing or invalid according
                        to the Executive Order.
        """
        required_fields = [
            'full_name', 'address', 'city', 'state', 'zip',
            'is_us_citizen', 'relationship_to_applicant',
            'duration_of_acquaintance', 'basis_of_knowledge'
        ]

        for field in required_fields:
            if field not in witness_data or not witness_data[field]:
                raise ValueError(f"Missing required witness data: '{field}'")

        if not witness_data['is_us_citizen']:
            raise ValueError("Corroborating witness must be a U.S. citizen.")

        relationship = str(witness_data['relationship_to_applicant']).lower()
        if "spouse" in relationship or "parent" in relationship:
            raise ValueError("Corroborating witness cannot be the applicant's spouse or parent.")

        if not isinstance(witness_data['duration_of_acquaintance'], str) or \
           not witness_data['duration_of_acquaintance'].strip():
            raise ValueError("Duration of acquaintance must be provided.")

        if not isinstance(witness_data['basis_of_knowledge'], str) or \
           not witness_data['basis_of_knowledge'].strip():
            raise ValueError("Basis of personal knowledge must be provided.")

    def validate_applicant_data(self, applicant_data: Dict[str, Any]) -> None:
        """
        Validates the provided applicant data for context in the affidavit.

        Args:
            applicant_data (Dict[str, Any]): A dictionary containing applicant details.
                Expected keys: 'full_name', 'date_of_birth', 'place_of_birth'.

        Raises:
            ValueError: If any required data is missing.
        """
        required_fields = ['full_name', 'date_of_birth', 'place_of_birth']
        for field in required_fields:
            if field not in applicant_data or not applicant_data[field]:
                raise ValueError(f"Missing required applicant data: '{field}'")

    def generate_affidavit(
        self,
        witness_data: Dict[str, Any],
        applicant_data: Dict[str, Any],
        execution_date: Optional[datetime.date] = None
    ) -> str:
        """
        Generates the full text of the Corroborating Witness Affidavit.

        Args:
            witness_data (Dict[str, Any]): A dictionary containing witness details.
                Expected keys: 'full_name', 'address', 'city', 'state', 'zip',
                'is_us_citizen', 'relationship_to_applicant',
                'duration_of_acquaintance', 'basis_of_knowledge'.
            applicant_data (Dict[str, Any]): A dictionary containing applicant details.
                Expected keys: 'full_name', 'date_of_birth', 'place_of_birth'.
            execution_date (Optional[datetime.date]): The date the affidavit is executed.
                Defaults to today's date if None.

        Returns:
            str: The formatted text content of the Corroborating Witness Affidavit.

        Raises:
            ValueError: If any validation fails for witness or applicant data.
        """
        self.validate_witness_data(witness_data)
        self.validate_applicant_data(applicant_data)

        if execution_date is None:
            execution_date = datetime.date.today()

        # Prepare data for template
        template_vars = {
            "witness_full_name": witness_data['full_name'],
            "witness_address": witness_data['address'],
            "witness_city": witness_data['city'],
            "witness_state": witness_data['state'],
            "witness_county": witness_data.get('county', 'N/A'), # County might not always be provided, default to N/A
            "witness_zip": witness_data['zip'],
            "applicant_full_name": applicant_data['full_name'],
            "applicant_dob": applicant_data['date_of_birth'],
            "applicant_pob": applicant_data['place_of_birth'],
            "duration_of_acquaintance": witness_data['duration_of_acquaintance'],
            "relationship_to_applicant": witness_data['relationship_to_applicant'],
            "basis_of_knowledge": witness_data['basis_of_knowledge'],
            "day": execution_date.day,
            "month": execution_date.strftime("%B"),
            "year": execution_date.year,
        }

        return self.AFFIDAVIT_TEMPLATE.format(**template_vars).strip()

if __name__ == '__main__':
    # Example Usage:
    generator = CorroboratingWitnessAffidavitGenerator()

    sample_witness_data = {
        'full_name': "Jane Doe",
        'address': "123 Main St",
        'city': "Anytown",
        'state': "CA",
        'county': "Any County",
        'zip': "90210",
        'is_us_citizen': True,
        'relationship_to_applicant': "Long-time friend and neighbor",
        'duration_of_acquaintance': "25 years",
        'basis_of_knowledge': "I have known John since he was born in Anytown, CA. "
                              "I attended school with him and his family has always "
                              "been U.S. citizens. I have personal knowledge of his "
                              "birth in the United States.",
    }

    sample_applicant_data = {
        'full_name': "John Smith",
        'date_of_birth': "January 1, 1980",
        'place_of_birth': "Anytown, CA, USA",
    }

    try:
        affidavit_text = generator.generate_affidavit(sample_witness_data, sample_applicant_data)
        print("--- Generated Corroborating Witness Affidavit ---")
        print(affidavit_text)
        print("\n-------------------------------------------------\n")

        # Example of invalid witness data (not a US citizen)
        invalid_witness_data_citizen = sample_witness_data.copy()
        invalid_witness_data_citizen['is_us_citizen'] = False
        try:
            generator.generate_affidavit(invalid_witness_data_citizen, sample_applicant_data)
        except ValueError as e:
            print(f"Validation Error (expected): {e}")

        # Example of invalid witness data (spouse)
        invalid_witness_data_relationship = sample_witness_data.copy()
        invalid_witness_data_relationship['relationship_to_applicant'] = "Spouse"
        try:
            generator.generate_affidavit(invalid_witness_data_relationship, sample_applicant_data)
        except ValueError as e:
            print(f"Validation Error (expected): {e}")

        # Example of missing applicant data
        missing_applicant_data = sample_applicant_data.copy()
        del missing_applicant_data['place_of_birth']
        try:
            generator.generate_affidavit(sample_witness_data, missing_applicant_data)
        except ValueError as e:
            print(f"Validation Error (expected): {e}")

    except ValueError as e:
        print(f"An unexpected error occurred during affidavit generation: {e}")
    except Exception as e:
        print(f"An unhandled exception occurred: {e}")