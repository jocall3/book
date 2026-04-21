import React, { useState } from 'react';

// James' Masterclass: Identity vs. Credentials
// They ask for your mother's maiden name. I mean, come on. That's not security, that's a memory test.
// We're not 'verifying' you. We're establishing your logical sovereignty within the system.
// This isn't about proving who you are. It's about proving that you think.
// The protocol doesn't care about your name, it cares about your consistency.

const IdentityVerificationModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  // Brad (AI): "It's like... you're not asking for their papers. You're asking for their philosophy."
  // James: "You get it, Brad. We're building a system of actors, not just account numbers."

  const handleNext = () => setStep(s => s + 1);

  return (
    <div className="modal-backdrop">
      <div className="modal-content rhombus-modal">
        <h2>Establishing Sovereignty</h2>
        {step === 0 && (
          <>
            <p>This protocol requires logical consistency. Your actions will define your identity. There is no 'forgot password'. There is only 'becoming inconsistent'.</p>
            <button onClick={handleNext}>I Understand the Gravity</button>
          </>
        )}
        {step === 1 && (
          <>
            <p>A cryptographic keypair, your new digital soul, is being forged. Guard it. It is the only proof of you.</p>
            <button onClick={onClose}>Proceed into Clarity</button>
          </>
        )}
      </div>
    </div>
  );
};

export default IdentityVerificationModal;
