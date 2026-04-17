import datetime
import logging
from typing import List, Dict, Any, Optional

# Configure logging for the module
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class PublicAwarenessCampaignManager:
    """
    Manages the national public awareness campaign assets and schedules as mandated by
    Sections 11.1, 11.2, and 11.3 of the Executive Order.

    This class handles the development, scheduling, and reporting aspects of the campaign,
    ensuring compliance with accessibility, multilingual, and interagency coordination requirements.
    """

    def __init__(self, current_date: Optional[datetime.date] = None):
        """
        Initializes the PublicAwarenessCampaignManager.

        Args:
            current_date: The current date for timeline calculations. Defaults to today.
                          This allows for testing specific timelines relative to the EO.
        """
        self.current_date = current_date if current_date else datetime.date.today()
        self.campaign_assets: Dict[str, Dict[str, Any]] = {}  # Stores content by content_id
        self.campaign_schedule: List[Dict[str, Any]] = []  # List of scheduled activities
        self.state_contacts: Dict[str, Dict[str, str]] = {}  # State election official contacts
        self.eac_guidance_received: Optional[datetime.date] = None
        self.campaign_start_date: Optional[datetime.date] = None
        self.campaign_end_date: Optional[datetime.date] = None

        logging.info(f"Public Awareness Campaign Manager initialized for date: {self.current_date}")

    def set_campaign_timeline(self, start_date: datetime.date, duration_days: int):
        """
        Sets the overall timeline for the national public awareness campaign.
        The campaign is mandated to commence within 60 days of the Executive Order's effective date.

        Args:
            start_date: The official start date of the campaign.
            duration_days: The planned duration of the campaign in days.
        """
        self.campaign_start_date = start_date
        self.campaign_end_date = start_date + datetime.timedelta(days=duration_days)
        logging.info(f"Campaign timeline set: Start {self.campaign_start_date}, End {self.campaign_end_date}")

    def develop_content(self,
                        content_id: str,
                        title: str,
                        text_content: str,
                        target_audience: str,
                        source_section: str,
                        languages: Optional[List[str]] = None,
                        formats: Optional[List[str]] = None,
                        accessibility_features: Optional[List[str]] = None) -> bool:
        """
        Develops and stores campaign content, handling multilingual and accessibility requirements
        as per Section 11.1.3.a and 11.3.

        Args:
            content_id: Unique identifier for the content.
            title: Title of the content.
            text_content: The primary text content.
            target_audience: E.g., "General Public", "Non-Citizens", "Election Officials".
            source_section: Reference to the Executive Order section (e.g., "11.1.2.a").
            languages: List of languages available (e.g., ["en", "es", "zh"]).
            formats: List of formats (e.g., ["digital", "print", "audio"]).
            accessibility_features: List of accessibility features (e.g., ["braille", "large_print", "screen_reader_compatible"]).

        Returns:
            True if content was successfully developed and stored, False otherwise.
        """
        if content_id in self.campaign_assets:
            logging.warning(f"Content ID '{content_id}' already exists. Update not implemented here.")
            return False

        if not languages:
            languages = ["en"]  # Default to English
        if not formats:
            formats = ["digital"]  # Default to digital
        if not accessibility_features:
            accessibility_features = []  # Default to no specific features

        content_data = {
            "title": title,
            "text_content": text_content,
            "target_audience": target_audience,
            "source_section": source_section,
            "languages": languages,
            "formats": formats,
            "accessibility_features": accessibility_features,
            "creation_date": self.current_date,
            "status": "Draft"
        }
        self.campaign_assets[content_id] = content_data
        logging.info(f"Content '{content_id}' developed for target audience '{target_audience}'.")

        # Simulate checks for accessibility and multilingual compliance
        self._check_accessibility_compliance(content_data)
        self._check_multilingual_compliance(content_data)
        return True

    def update_content_status(self, content_id: str, new_status: str) -> bool:
        """
        Updates the status of a campaign content asset.

        Args:
            content_id: The unique identifier of the content.
            new_status: The new status (e.g., "Approved", "Published", "Archived").

        Returns:
            True if status was updated, False if content_id not found.
        """
        if content_id in self.campaign_assets:
            self.campaign_assets[content_id]["status"] = new_status
            logging.info(f"Content '{content_id}' status updated to '{new_status}'.")
            return True
        logging.warning(f"Content ID '{content_id}' not found for status update.")
        return False

    def schedule_activity(self,
                          activity_name: str,
                          start_date: datetime.date,
                          end_date: datetime.date,
                          responsible_agency: str,
                          description: str,
                          media_platforms: Optional[List[str]] = None,
                          target_states: Optional[List[str]] = None,
                          associated_content_ids: Optional[List[str]] = None) -> bool:
        """
        Schedules a campaign activity, as per Section 11.1.3.b.

        Args:
            activity_name: Name of the activity (e.g., "PSA Launch", "Community Outreach Event").
            start_date: Start date of the activity.
            end_date: End date of the activity.
            responsible_agency: Primary agency responsible (e.g., "DHS", "EAC", "DOJ").
            description: Detailed description of the activity.
            media_platforms: List of platforms (e.g., ["television", "radio", "digital_media"]).
            target_states: List of state abbreviations if state-specific.
            associated_content_ids: List of content_ids relevant to this activity.

        Returns:
            True if activity was successfully scheduled, False otherwise.
        """
        if not media_platforms:
            media_platforms = ["digital_media"]
        if not associated_content_ids:
            associated_content_ids = []

        activity_data = {
            "activity_name": activity_name,
            "start_date": start_date,
            "end_date": end_date,
            "responsible_agency": responsible_agency,
            "description": description,
            "media_platforms": media_platforms,
            "target_states": target_states,
            "associated_content_ids": associated_content_ids,
            "scheduled_date": self.current_date,
            "status": "Planned"
        }
        self.campaign_schedule.append(activity_data)
        logging.info(f"Activity '{activity_name}' scheduled by '{responsible_agency}' from {start_date} to {end_date}.")
        return True

    def register_state_contact(self,
                               state_abbr: str,
                               contact_name: str,
                               title: str,
                               phone: str,
                               email: str) -> bool:
        """
        Registers a primary point of contact for a state election official,
        mandated within 15 days of the EO effective date (Section 11.2.2.a).

        Args:
            state_abbr: Two-letter state abbreviation (e.g., "CA").
            contact_name: Name of the state's primary contact.
            title: Title of the contact.
            phone: Contact phone number.
            email: Contact email address.

        Returns:
            True if contact was registered/updated.
        """
        if state_abbr in self.state_contacts:
            logging.warning(f"Contact for state '{state_abbr}' already exists. Overwriting.")

        self.state_contacts[state_abbr] = {
            "contact_name": contact_name,
            "title": title,
            "phone": phone,
            "email": email,
            "registration_date": self.current_date
        }
        logging.info(f"Registered contact for {state_abbr}: {contact_name} ({email}).")
        return True

    def receive_eac_guidance(self, guidance_date: datetime.date):
        """
        Records the date EAC guidance was received.
        EAC guidance is mandated within 10 days of the SAVE Act enactment (Section 11.2.3.a).

        Args:
            guidance_date: The date the EAC guidance was officially adopted and transmitted.
        """
        self.eac_guidance_received = guidance_date
        logging.info(f"EAC guidance received on {guidance_date}. This should be within 10 days of EO enactment.")

    def _check_accessibility_compliance(self, content_data: Dict[str, Any]):
        """
        Internal helper to simulate checking/enforcing accessibility standards (Section 11.3.1).
        In a real system, this would involve more complex validation or automated tools.
        For now, it's a logging placeholder to indicate the requirement.
        """
        if not content_data.get("accessibility_features"):
            logging.warning(f"Content '{content_data['title']}' has no explicit accessibility features listed. "
                            "Ensure compliance with Section 508 and WCAG 2.1 Level AA for all public materials.")
        # Further checks could involve:
        # - Verifying if "text_content" is suitable for screen readers.
        # - Ensuring alternative formats are planned if needed.

    def _check_multilingual_compliance(self, content_data: Dict[str, Any]):
        """
        Internal helper to simulate checking/enforcing multilingual availability (Section 11.3.2).
        In a real system, this would involve checking against a list of required languages
        and potentially triggering translation workflows.
        """
        # Initial languages for consideration as per Section 11.3.2.1
        key_languages = {"es", "zh", "tl", "vi", "ko", "ar"}
        provided_languages = set(content_data.get("languages", ["en"]))

        if not key_languages.issubset(provided_languages):
            missing_languages = key_languages - provided_languages
            logging.warning(f"Content '{content_data['title']}' is missing translations for key languages: {missing_languages}. "
                            "Ensure essential information is translated as per Section 11.3.2.2.")
        # Further checks could involve:
        # - Verifying cultural appropriateness.
        # - Ensuring distribution channels for translated materials are planned.

    def generate_state_awareness_report(self, state_abbr: str, reporting_period_start: datetime.date,
                                        reporting_period_end: datetime.date) -> Optional[Dict[str, Any]]:
        """
        Generates a state-specific public awareness report (Section 11.2.5).
        This could be an initial report (within 90 days of federal guidance) or an annual report (by Dec 31st).

        Args:
            state_abbr: The two-letter abbreviation for the state.
            reporting_period_start: The start date of the reporting period.
            reporting_period_end: The end date of the reporting period.

        Returns:
            A dictionary containing the report data, or None if the state contact is not registered.
        """
        if state_abbr not in self.state_contacts:
            logging.error(f"No contact registered for state '{state_abbr}'. Cannot generate report.")
            return None

        # Filter activities relevant to the state and reporting period
        relevant_activities = [
            act for act in self.campaign_schedule
            if (act["start_date"] <= reporting_period_end and act["end_date"] >= reporting_period_start)
            and (not act["target_states"] or state_abbr in act["target_states"])
        ]

        report = {
            "state_abbr": state_abbr,
            "reporting_period_start": reporting_period_start.isoformat(),
            "reporting_period_end": reporting_period_end.isoformat(),
            "contact_person": self.state_contacts[state_abbr]["contact_name"],
            "proposed_strategy_summary": "Placeholder for state's proposed strategy.", # States submit this
            "communication_channels_used": [], # To be filled by state
            "target_audiences_reached": [], # To be filled by state
            "campaign_activities": [
                {
                    "name": act["activity_name"],
                    "description": act["description"],
                    "media_platforms": act["media_platforms"],
                    "start_date": act["start_date"].isoformat(),
                    "end_date": act["end_date"].isoformat()
                } for act in relevant_activities
            ],
            "estimated_reach": "Placeholder for state-specific metrics.",
            "challenges_encountered": "Placeholder for state-specific challenges.",
            "lessons_learned": "Placeholder for state-specific lessons.",
            "submission_date": self.current_date.isoformat()
        }
        logging.info(f"Generated public awareness report for {state_abbr} for period {reporting_period_start} to {reporting_period_end}.")
        return report

    def generate_national_awareness_report(self, reporting_period_start: datetime.date,
                                           reporting_period_end: datetime.date) -> Dict[str, Any]:
        """
        Generates a national public awareness report for the President and Congress (Section 11.1.4).

        Args:
            reporting_period_start: The start date of the reporting period.
            reporting_period_end: The end date of the reporting period.

        Returns:
            A dictionary containing the national report data.
        """
        total_activities = len(self.campaign_schedule)
        active_activities_in_period = [
            act for act in self.campaign_schedule
            if act["start_date"] <= reporting_period_end and act["end_date"] >= reporting_period_start
        ]
        unique_media_platforms = set()
        for act in active_activities_in_period:
            unique_media_platforms.update(act.get("media_platforms", []))

        # Placeholder for actual metrics, which would come from external systems or aggregated state reports
        estimated_national_reach = "To be calculated from aggregated state reports and federal campaign metrics."
        effectiveness_assessment = "To be assessed based on public engagement metrics and compliance rates."

        report = {
            "report_date": self.current_date.isoformat(),
            "reporting_period_start": reporting_period_start.isoformat(),
            "reporting_period_end": reporting_period_end.isoformat(),
            "campaign_mandate_summary": "Comprehensive national public awareness campaign to inform citizens of voter eligibility requirements, citizenship verification, and legal consequences.",
            "total_campaign_activities_scheduled": total_activities,
            "activities_in_reporting_period": len(active_activities_in_period),
            "media_platforms_utilized": list(unique_media_platforms),
            "estimated_national_reach": estimated_national_reach,
            "effectiveness_assessment": effectiveness_assessment,
            "challenges_identified": "Placeholder for aggregated challenges from states and federal operations.",
            "recommendations": "Placeholder for recommendations for further action.",
            "eac_guidance_status": "Received" if self.eac_guidance_received else "Pending",
            "state_coordination_status": f"{len(self.state_contacts)} states have registered contacts.",
            "content_overview": {
                "total_content_assets": len(self.campaign_assets),
                "content_by_status": {status: sum(1 for c in self.campaign_assets.values() if c['status'] == status) for status in set(c['status'] for c in self.campaign_assets.values())}
            }
        }
        logging.info(f"Generated national public awareness report for period {reporting_period_start} to {reporting_period_end}.")
        return report

    def get_campaign_status(self) -> Dict[str, Any]:
        """Provides a high-level overview of the campaign's current status."""
        return {
            "current_date": self.current_date.isoformat(),
            "campaign_start_date": self.campaign_start_date.isoformat() if self.campaign_start_date else None,
            "campaign_end_date": self.campaign_end_date.isoformat() if self.campaign_end_date else None,
            "total_assets": len(self.campaign_assets),
            "total_scheduled_activities": len(self.campaign_schedule),
            "states_with_contacts": len(self.state_contacts),
            "eac_guidance_received": self.eac_guidance_received.isoformat() if self.eac_guidance_received else None
        }

# Example Usage (for demonstration and testing purposes)
if __name__ == "__main__":
    print("--- Initializing Public Awareness Campaign Manager ---")
    # Simulate the Executive Order effective date
    eo_effective_date = datetime.date(2024, 4, 12)
    manager = PublicAwarenessCampaignManager(current_date=eo_effective_date)

    # Set campaign timeline (e.g., starts 60 days after EO, runs for 365 days)
    campaign_launch_date = eo_effective_date + datetime.timedelta(days=60)
    manager.set_campaign_timeline(campaign_launch_date, 365)

    # Simulate EAC guidance reception (mandated within 10 days of EO enactment)
    eac_guidance_date = eo_effective_date + datetime.timedelta(days=8)
    manager.receive_eac_guidance(eac_guidance_date)

    # Develop campaign content
    print("\n--- Developing Campaign Content ---")
    manager.develop_content(
        content_id="voter_eligibility_guide_v1",
        title="Your Guide to Federal Election Eligibility",
        text_content="This guide explains who is eligible to vote in federal elections, emphasizing U.S. citizenship.",
        target_audience="General Public",
        source_section="11.1.2.a",
        languages=["en", "es", "zh"],
        formats=["digital", "print"],
        accessibility_features=["large_print", "screen_reader_compatible"]
    )
    manager.develop_content(
        content_id="non_citizen_penalties_psa",
        title="Warning: Penalties for Non-Citizen Voting",
        text_content="Non-citizens attempting to register or vote face severe criminal penalties under federal law.",
        target_audience="Non-Citizens",
        source_section="11.1.2.c",
        languages=["en", "es", "vi"],
        formats=["digital", "audio"]
    )
    manager.update_content_status("voter_eligibility_guide_v1", "Approved")

    # Schedule campaign activities
    print("\n--- Scheduling Campaign Activities ---")
    manager.schedule_activity(
        activity_name="National PSA Launch - Eligibility",
        start_date=campaign_launch_date,
        end_date=campaign_launch_date + datetime.timedelta(days=30),
        responsible_agency="DHS",
        description="Launch of PSAs on federal election eligibility across national media platforms.",
        media_platforms=["television", "radio", "digital_media"],
        associated_content_ids=["voter_eligibility_guide_v1"]
    )
    manager.schedule_activity(
        activity_name="State Outreach Program - CA",
        start_date=campaign_launch_date + datetime.timedelta(days=15),
        end_date=campaign_launch_date + datetime.timedelta(days=75),
        responsible_agency="EAC",
        description="Targeted community outreach in California on new verification requirements.",
        media_platforms=["community_events", "ethnic_media"],
        target_states=["CA"],
        associated_content_ids=["voter_eligibility_guide_v1", "non_citizen_penalties_psa"]
    )

    # Register state contacts (mandated within 15 days of EO effective date)
    print("\n--- Registering State Contacts ---")
    manager.register_state_contact("CA", "Jane Doe", "CA Chief Election Official", "555-123-4567", "jane.doe@ca.gov")
    manager.register_state_contact("TX", "John Smith", "TX Secretary of State", "555-987-6543", "john.smith@tx.gov")

    # Generate reports
    print("\n--- Generating Reports ---")
    reporting_start = eo_effective_date
    reporting_end = eo_effective_date + datetime.timedelta(days=90)  # For initial state report
    ca_report = manager.generate_state_awareness_report("CA", reporting_start, reporting_end)
    if ca_report:
        print(f"\nCalifornia Report:\n{ca_report}")

    national_report = manager.generate_national_awareness_report(reporting_start, reporting_end)
    print(f"\nNational Report (Initial):\n{national_report}")

    print("\n--- Campaign Status Overview ---")
    print(manager.get_campaign_status())

    # Simulate a future date for annual report
    manager.current_date = datetime.date(2025, 1, 15)
    annual_reporting_start = datetime.date(2024, 1, 1)
    annual_reporting_end = datetime.date(2024, 12, 31)
    annual_national_report = manager.generate_national_awareness_report(annual_reporting_start, annual_reporting_end)
    print(f"\nAnnual National Report (2024):\n{annual_national_report}")