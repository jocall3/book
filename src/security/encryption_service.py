import os
import base64
import logging
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend

class EncryptionService:
    """
    Provides AES-256-GCM encryption and key management for sensitive voter data.
    Implements NIST-compliant standards for data at rest.
    """

    def __init__(self, master_key: bytes):
        self.backend = default_backend()
        self.aesgcm = AESGCM(master_key)
        self.logger = logging.getLogger(__name__)

    @staticmethod
    def generate_master_key(password: str, salt: bytes) -> bytes:
        """
        Derives a 256-bit key from a password using PBKDF2.
        """
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=600000,
            backend=default_backend()
        )
        return kdf.derive(password.encode())

    def encrypt(self, data: str) -> str:
        """
        Encrypts plaintext data using AES-256-GCM.
        Returns a base64 encoded string containing nonce + ciphertext.
        """
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, data.encode(), None)
        return base64.b64encode(nonce + ciphertext).decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypts base64 encoded AES-256-GCM data.
        """
        try:
            raw_data = base64.b64decode(encrypted_data)
            nonce = raw_data[:12]
            ciphertext = raw_data[12:]
            decrypted_data = self.aesgcm.decrypt(nonce, ciphertext, None)
            return decrypted_data.decode('utf-8')
        except Exception as e:
            self.logger.error(f"Decryption failed: {str(e)}")
            raise ValueError("Decryption failed. Data may be corrupted or key invalid.")

    @staticmethod
    def generate_salt(length: int = 16) -> bytes:
        """
        Generates a cryptographically secure random salt.
        """
        return os.urandom(length)

    def rotate_key(self, old_key: bytes, new_key: bytes, encrypted_data: str) -> str:
        """
        Re-encrypts data with a new master key.
        """
        plaintext = self.decrypt(encrypted_data)
        self.aesgcm = AESGCM(new_key)
        return self.encrypt(plaintext)