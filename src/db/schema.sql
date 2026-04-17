--
-- PostgreSQL schema for the Safeguard American Voter Eligibility (SAVE) System
--
-- This schema is designed to support the requirements outlined in the
-- "EXECUTIVE ORDER: SAFEGUARDING AMERICAN VOTER ELIGIBILITY AND ESTABLISHING THE MILITARY FUND"
-- and the associated SAVE America Act (H.R. 7296).
--
-- It provides a structured database for managing voter registration, citizenship verification,
-- document handling, auditing, and inter-agency data exchange.
--

-- Enable the pgcrypto extension for UUID generation, if not already enabled.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Define ENUM types for data consistency and integrity.

CREATE TYPE registration_status_enum AS ENUM (
    'active',               -- Verified and eligible to vote.
    'inactive',             -- Potentially moved or otherwise requires confirmation.
    'pending_verification', -- Application received, awaiting citizenship verification.
    'provisional',          -- Eligible to cast a provisional ballot, requires post-election verification.
    'removed'               -- Confirmed ineligible and removed from rolls.
);

CREATE TYPE citizenship_status_enum AS ENUM (
    'verified',             -- Citizenship confirmed through an authoritative source.
    'unverified',           -- Initial state, not yet checked.
    'discrepancy',          -- Mismatch found, requires resolution per Sec 4.3.
    'non_citizen'           -- Confirmed non-citizen status.
);

CREATE TYPE document_type_enum AS ENUM (
    'us_passport',
    'real_id_license',
    'birth_certificate',
    'naturalization_cert',
    'citizenship_cert',
    'military_record',      -- Includes records from DOD and historical Dept. of War.
    'tribal_id',
    'consular_report_birth_abroad',
    'uniform_affidavit'     -- For alternative proof of citizenship per Sec 4.2.3.
);

CREATE TYPE verification_source_enum AS ENUM (
    'save_program',         -- DHS Systematic Alien Verification for Entitlements.
    'ssa',                  -- Social Security Administration.
    'dod',                  -- Department of Defense.
    'manual_document_review'
);

CREATE TYPE verification_result_enum AS ENUM (
    'confirmed_citizen',
    'not_confirmed',
    'discrepancy_found',
    'error_in_query'
);

CREATE TYPE election_type_enum AS ENUM (
    'general',
    'primary',
    'special',
    'runoff'
);

-- Table: states
-- Purpose: Stores information about each state and territory.
CREATE TABLE states (
    state_id CHAR(2) PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL UNIQUE,
    chief_election_official_name VARCHAR(255),
    chief_election_official_contact VARCHAR(255),
    has_voter_registration BOOLEAN DEFAULT TRUE NOT NULL, -- For states without voter registration, per Sec 09.01.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: election_officials
-- Purpose: Manages user accounts for state and local election officials accessing the system.
CREATE TABLE election_officials (
    official_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id CHAR(2) NOT NULL REFERENCES states(state_id),
    username VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL, -- Should be a strong, salted hash (e.g., bcrypt).
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    access_level VARCHAR(50) NOT NULL, -- e.g., 'admin', 'verifier', 'read_only'
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: voters
-- Purpose: The central table for voter registration applicants and registered voters.
CREATE TABLE voters (
    voter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id CHAR(2) NOT NULL REFERENCES states(state_id),
    state_voter_id VARCHAR(100) UNIQUE, -- The ID from the state's own system.
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    registration_date DATE NOT NULL,
    registration_status registration_status_enum NOT NULL DEFAULT 'pending_verification',
    citizenship_status citizenship_status_enum NOT NULL DEFAULT 'unverified',
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voters_state_id ON voters(state_id);
CREATE INDEX idx_voters_name_dob ON voters(last_name, first_name, date_of_birth);
CREATE INDEX idx_voters_registration_status ON voters(registration_status);
CREATE INDEX idx_voters_citizenship_status ON voters(citizenship_status);

-- Table: citizenship_documents
-- Purpose: Stores records of documents presented as proof of U.S. citizenship.
CREATE TABLE citizenship_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES voters(voter_id) ON DELETE CASCADE,
    document_type document_type_enum NOT NULL,
    document_identifier VARCHAR(255), -- e.g., Passport number, Certificate number.
    issuing_authority VARCHAR(255) NOT NULL, -- e.g., 'US Dept of State', 'CA DMV', 'DOD', 'Department of War'.
    issue_date DATE,
    expiration_date DATE,
    document_reference_url TEXT, -- URL to a secure, access-controlled document storage location.
    document_hash VARCHAR(256), -- SHA-256 hash of the document file for integrity verification.
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'verified', 'rejected'.
    verified_by_official_id UUID REFERENCES election_officials(official_id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citizenship_documents_voter_id ON citizenship_documents(voter_id);

-- Table: verification_logs
-- Purpose: Logs all verification queries to external systems (SAVE, SSA) for auditing and data retention compliance.
CREATE TABLE verification_logs (
    log_id BIGSERIAL PRIMARY KEY,
    voter_id UUID NOT NULL REFERENCES voters(voter_id) ON DELETE CASCADE,
    verification_source verification_source_enum NOT NULL,
    query_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_timestamp TIMESTAMPTZ,
    verification_result verification_result_enum,
    response_data_hash VARCHAR(256), -- Hash of the response payload for auditing.
    transaction_id VARCHAR(255), -- ID from the external service (e.g., SAVE transaction ID).
    queried_by_official_id UUID NOT NULL REFERENCES election_officials(official_id),
    retained_until TIMESTAMPTZ NOT NULL -- Calculated based on policy (e.g., 24 months, Sec 3.1.5) for data minimization.
);

CREATE INDEX idx_verification_logs_voter_id ON verification_logs(voter_id);
CREATE INDEX idx_verification_logs_retained_until ON verification_logs(retained_until); -- For automated data purging jobs.

-- Table: discrepancy_resolutions
-- Purpose: Tracks the process of resolving citizenship status discrepancies as per Sec 4.3.
CREATE TABLE discrepancy_resolutions (
    discrepancy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES voters(voter_id) ON DELETE CASCADE,
    triggering_log_id BIGINT REFERENCES verification_logs(log_id),
    discrepancy_details TEXT NOT NULL,
    notice_sent_at TIMESTAMPTZ,
    voter_response_received_at TIMESTAMPTZ,
    resolution_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'resolved_citizen', 'resolved_ineligible'.
    resolution_details TEXT,
    resolved_by_official_id UUID REFERENCES election_officials(official_id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discrepancy_resolutions_voter_id ON discrepancy_resolutions(voter_id);

-- Table: elections
-- Purpose: Stores information about Federal elections.
CREATE TABLE elections (
    election_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_name VARCHAR(255) NOT NULL,
    election_date DATE NOT NULL,
    election_type election_type_enum NOT NULL,
    is_federal BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_elections_date ON elections(election_date);

-- Table: provisional_ballots
-- Purpose: Manages provisional ballots cast during an election, per Sec 8.2.
CREATE TABLE provisional_ballots (
    provisional_ballot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES voters(voter_id),
    election_id UUID NOT NULL REFERENCES elections(election_id),
    reason_for_provisional TEXT NOT NULL, -- e.g., 'Citizenship not verified at polling place'.
    cast_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_verification', -- e.g., 'pending_verification', 'counted', 'rejected'.
    verification_deadline TIMESTAMPTZ NOT NULL, -- e.g., 48 hours after polls close.
    finalized_at TIMESTAMPTZ,
    finalized_by_official_id UUID REFERENCES election_officials(official_id)
);

CREATE INDEX idx_provisional_ballots_voter_election ON provisional_ballots(voter_id, election_id);

-- Table: naturalization_notifications
-- Purpose: Logs notifications of new naturalizations from DHS to facilitate voter registration, per Sec 6.5.
CREATE TABLE naturalization_notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    full_legal_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_naturalization DATE NOT NULL,
    residential_address TEXT,
    received_from_dhs_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_by_state_at TIMESTAMPTZ,
    state_id CHAR(2) NOT NULL REFERENCES states(state_id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' -- e.g., 'pending', 'processed', 'error'.
);

CREATE INDEX idx_naturalization_notifications_state_id ON naturalization_notifications(state_id);

-- Table: state_implementation_grants
-- Purpose: Tracks the allocation and purpose of State Implementation Grants, per Sec 15.2.
CREATE TABLE state_implementation_grants (
    grant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id CHAR(2) NOT NULL REFERENCES states(state_id),
    fiscal_year INTEGER NOT NULL,
    amount_allocated NUMERIC(15, 2) NOT NULL,
    purpose TEXT NOT NULL,
    date_awarded DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: audit_trail
-- Purpose: Provides a comprehensive, immutable log of all significant actions for security and accountability.
CREATE TABLE audit_trail (
    audit_id BIGSERIAL PRIMARY KEY,
    official_id UUID REFERENCES election_officials(official_id),
    action_type VARCHAR(100) NOT NULL, -- e.g., 'VOTER_UPDATE', 'VERIFICATION_QUERY', 'RECORD_PURGE'.
    target_entity VARCHAR(100) NOT NULL, -- e.g., 'voters', 'documents'.
    target_id VARCHAR(255) NOT NULL, -- The ID of the affected record.
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    details JSONB -- Stores before/after state of the data for non-repudiation.
);

CREATE INDEX idx_audit_trail_official_id ON audit_trail(official_id);
CREATE INDEX idx_audit_trail_target ON audit_trail(target_entity, target_id);

-- Function and Triggers for automatically updating 'updated_at' timestamps.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON states
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON election_officials
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON voters
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();