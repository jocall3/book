import os
import time
import hmac
import hashlib
import base64
import struct
import secrets
from typing import Optional, Dict

class MFAProvider:
    """
    Multi-factor authentication service for election officials.
    Provides TOTP (Time-based One-Time Password) generation and verification
    to secure access to federal election database interfaces.
    """

    def __init__(self, secret_key: Optional[str] = None):
        # In production, the secret_key should be retrieved from a secure vault
        self.secret_key = secret_key or secrets.token_hex(32)
        self.step_size = 30  # Standard TOTP window

    def _get_hotp_token(self, secret: str, intervals_no: int) -> str:
        """Generates an HMAC-based One-Time Password."""
        key = base64.b32decode(secret.upper() + '=' * (-len(secret) % 8))
        msg = struct.pack(">Q", intervals_no)
        h = hmac.new(key, msg, hashlib.sha1).digest()
        o = h[19] & 15
        token = str((struct.unpack(">I", h[o:o + 4])[0] & 0x7fffffff) % 1000000)
        return token.zfill(6)

    def generate_token(self) -> str:
        """Generates the current TOTP token for the official."""
        intervals_no = int(time.time() // self.step_size)
        return self._get_hotp_token(self.secret_key, intervals_no)

    def verify_token(self, token: str, window: int = 1) -> bool:
        """
        Verifies the provided token against the current time window.
        Allows for a small drift window to account for network latency.
        """
        if not token or len(token) != 6:
            return False

        current_intervals = int(time.time() // self.step_size)
        
        # Check current window and surrounding windows for clock drift
        for i in range(-window, window + 1):
            if hmac.compare_digest(self._get_hotp_token(self.secret_key, current_intervals + i), token):
                return True
        return False

    @staticmethod
    def generate_secret() -> str:
        """Generates a new base32 secret for a new election official."""
        return base64.b32encode(os.urandom(20)).decode('utf-8')

class ElectionMFAStore:
    """
    Thread-safe storage interface for managing official MFA secrets.
    In a production environment, this would interface with a secure database.
    """
    def __init__(self):
        self._storage: Dict[str, str] = {}

    def register_official(self, official_id: str) -> str:
        secret = MFAProvider.generate_secret()
        self._storage[official_id] = secret
        return secret

    def get_provider(self, official_id: str) -> Optional[MFAProvider]:
        secret = self._storage.get(official_id)
        if secret:
            return MFAProvider(secret)
        return None