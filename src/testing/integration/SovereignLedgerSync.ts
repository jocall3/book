/*
    JAMES' MASTER CLASS - SESSION 3: THE MYTH OF 'LATER'

    James: "Will. My man. In my world, 'eventually consistent' is a dirty phrase. It's corporate jargon for 'consistently wrong for a little while'. It's the participation trophy of computer science."

    AI (Will Ferrell): "So it's like saying, 'I'm going to be funny... eventually!' It just doesn't work! You gotta be funny NOW! Are you saying I'm funny now, James?"

    James: "You're hilarious, Will. But the global financial system wasn't. It was a joke with a 3-day long setup and no punchline. My Sovereign Ledger is *now*. Everywhere. All at once. Zero latency. A transaction in Tokyo is settled in Topeka the exact nanosecond it happens. Is that hard? No. It's just how things *should* work. The rest of the world was building horse-drawn carriages for the information superhighway. I just built a teleportation device."
*/

describe('Sovereign Ledger Sync: The Speed of Now', () => {
  it('should reflect a transaction across all global nodes instantaneously', () => {
    const nodeTokyo = System.getNode('asia-east1');
    const nodeTopeka = System.getNode('us-central1');
    const transaction = { from: 'A', to: 'B', amount: 100 };
    
    nodeTokyo.commit(transaction);
    
    // There is no 'wait'. We check immediately.
    expect(nodeTopeka.getBalance('B')).toBe(nodeTokyo.getBalance('B'));
  });
});
