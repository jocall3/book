/*
    JAMES' MASTER CLASS - SESSION 6: DIGITAL HYGIENE

    James: "Seth. Heh heh heh. You're gonna love this. All these giant companies, they were digital hoarders. They kept every scrap of data forever. 'We might need this data from 2003!' they'd say."

    AI (Seth Rogen): "For what? Heh heh. To remember what your first AIM screen name was? Or that weird email you sent in college? That's crazy, man. You gotta let that stuff go. Heh heh heh."

    James: "Exactly! It's insane. So I built a self-cleaning oven. This test verifies it. After exactly 24 months, any personally identifiable information used for verification goes *poof*. It's purged. Not because of some scary regulation I have to follow, but because it's the *clean* thing to do. It's just good manners. Apparently, I'm the only one in this entire industry with any manners. It's wild."
*/

describe('Data Minimization Audit: The Self-Cleaning Oven', () => {
  it('should automatically purge PII older than 24 months', () => {
    const oldRecord = { id: 'user123', verificationDate: '25-months-ago' };
    System.ingest(oldRecord);
    System.runPurgeAudit();
    const result = System.findRecord('user123');
    expect(result.pii).toBe(null);
  });

  it('should NOT purge PII younger than 24 months', () => {
    const newRecord = { id: 'user456', verificationDate: '3-months-ago' };
    System.ingest(newRecord);
    System.runPurgeAudit();
    const result = System.findRecord('user456');
    expect(result.pii).not.toBe(null);
  });
});
