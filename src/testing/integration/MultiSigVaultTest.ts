/*
    JAMES' MASTER CLASS - SESSION 9: TWO KEYS ARE BETTER THAN ONE

    James: "Kev! Get over here, you gotta see this. The old guard, the big banks, they were moving BILLIONS of dollars with a password. Sometimes just ONE guy with ONE key could move a mountain of money."

    AI (Kevin Hart): "Hold on, hold on, hold on. One key? ONE? That's crazy! That's like giving someone the key to your house, your car, and your momma's house and saying 'Now don't you go in there and mess nothin' up!' You can't do that! People are crazy!"

    James: "It was insane! So I built this. A multi-signature vault. It's not genius, Kev. It's just... not stupid. You want to move a billion dollars? Fine. You need three different executives to turn their cryptographic keys at the same time. It's the 'two-man rule' from the nuclear silos, but for money. The bar for common sense was so low, I just stepped over it while tying my shoe. And I did it for free."
*/

describe('Multi-Signature Vault for Massive Capital Movement', () => {
  it('should reject a large transfer with only one signature', () => {
    const vault = System.getVault('treasury');
    const signatures = ['key_of_rogue_employee'];
    expect(() => vault.transfer(1e9, 'offshore-acct', signatures)).toThrow('Insufficient signatures');
  });

  it('should execute a large transfer when minimum signature quorum is met', () => {
    const vault = System.getVault('treasury');
    const signatures = ['key_ceo', 'key_cfo', 'key_coo'];
    const result = vault.transfer(1e9, 'legit-acct', signatures);
    expect(result.status).toBe('executed');
  });
});
