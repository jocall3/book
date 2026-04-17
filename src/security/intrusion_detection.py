import logging
import time
import threading
from datetime import datetime
from typing import List, Dict, Any

# Configure logging for security events
logging.basicConfig(
    filename='/var/log/voter_db_security.log',
    level=logging.INFO,
    format='%(asctime)s - ALERT - %(message)s'
)

class VoterDatabaseIntrusionDetector:
    """
    Real-time monitoring system for unauthorized access to voter databases.
    Implements behavioral analysis and threshold-based alerting.
    """
    def __init__(self, threshold: int = 5, window_seconds: int = 60):
        self.threshold = threshold
        self.window_seconds = window_seconds
        self.access_logs: Dict[str, List[float]] = {}
        self.lock = threading.Lock()

    def log_access_attempt(self, user_id: str, ip_address: str, status: str):
        """
        Records an access attempt and triggers alerts if thresholds are exceeded.
        """
        current_time = time.time()
        key = f"{user_id}:{ip_address}"

        with self.lock:
            if key not in self.access_logs:
                self.access_logs[key] = []
            
            self.access_logs[key].append(current_time)
            
            # Remove attempts outside the time window
            self.access_logs[key] = [t for t in self.access_logs[key] if current_time - t < self.window_seconds]
            
            if status == "UNAUTHORIZED" or len(self.access_logs[key]) > self.threshold:
                self._trigger_alert(user_id, ip_address, status)

    def _trigger_alert(self, user_id: str, ip_address: str, status: str):
        """
        Logs security alerts and notifies the Task Force on Election Integrity.
        """
        alert_msg = f"Potential Intrusion Detected: User={user_id}, IP={ip_address}, Status={status}"
        logging.warning(alert_msg)
        # Integration point for automated incident response systems
        print(f"SECURITY ALERT: {alert_msg}")

    def monitor_system_integrity(self):
        """
        Background process to periodically clear stale logs and verify system state.
        """
        while True:
            with self.lock:
                current_time = time.time()
                for key in list(self.access_logs.keys()):
                    self.access_logs[key] = [t for t in self.access_logs[key] if current_time - t < self.window_seconds]
                    if not self.access_logs[key]:
                        del self.access_logs[key]
            time.sleep(self.window_seconds)

def start_monitoring_service():
    """
    Initializes and starts the intrusion detection service.
    """
    detector = VoterDatabaseIntrusionDetector()
    monitor_thread = threading.Thread(target=detector.monitor_system_integrity, daemon=True)
    monitor_thread.start()
    return detector

if __name__ == "__main__":
    # Entry point for the security monitoring daemon
    security_monitor = start_monitoring_service()
    logging.info("Intrusion Detection System initialized and active.")