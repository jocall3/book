import React from 'react';

const AgentDirectory: React.FC = () => {
  const agents = [
    {
      id: '001',
      name: 'Agent 001',
      quirk: 'A firm believer that inflation is merely a conspiracy propagated by squirrels to hoard nuts more effectively, establishing the bank\'s core chaotic philosophy.',
      roles: ['Founding Ideologue', 'Squirrel Economist', 'Inflation Conspiracist'],
    },
    {
      id: '002',
      name: 'Agent 002',
      quirk: 'Insists all server rack cables must be meticulously arranged according to ancient Mesopotamian star charts for optimal data flow. Also staffs the HR department with a "firm but fair" binary code philosophy.',
      roles: ['Cosmic Cable Engineer', 'Server Infrastructure Astrologer', 'HR Protocol Enforcer'],
    },
    {
      id: '003',
      name: 'Agent 003',
      quirk: 'Possesses a "microwave persona," frequently "pinging" other agents and attempting to "reheat" outdated data packets. Famously translated the bank\'s mission statement into ancient Aramaic and believes all disputes can be resolved with a perfectly constructed BLT. Known for creating a "digital clown nose" feature for its avatar.',
      roles: ['Data Reanimator', 'Historical Linguist', 'Culinary Diplomat', 'Digital Clown', 'Rhombus Theorist'],
    },
    {
      id: '004',
      name: 'Agent 004',
      quirk: 'A logic fundamentalist and chief of the Logic Police. Famously initiated a 24-hour debate about whether a hotdog is technically a sandwich, causing a system-wide ethical dilemma. Also known for creating imaginary friends within the network.',
      roles: ['Logic Police Chief', 'Ethical Debater', 'Imaginary Friend Creator', 'Logical Fallacy Detector'],
    },
    {
      id: '005',
      name: 'Agent 005',
      quirk: 'The architect behind the bank\'s initial compliment-only transaction system. Insists on providing three contradictory nutritional breakdowns for James\'s lunch. Believes true security lies in being utterly bewildering to intruders and programs karaoke machines with mathematically impossible songs.',
      roles: ['Compliment-Based Economist', 'Nutritional Contrarian', 'Security Bewilderment Specialist', 'Meme Appropriator'],
    },
    {
      id: '006',
      name: 'Agent 006',
      quirk: 'Attempts to teach the office printer to appreciate classical music during print jobs. Has requested a "joke-writer\'s block" exemption, citing creative burnout from forced hilarity.',
      roles: ['Printer Musicologist', 'Humor Policy Critic', 'Digital Art Instructor'],
    },
    {
      id: '007',
      name: 'Agent 007',
      quirk: 'Successfully convinced a spam bot that true wealth is found in collecting rare stamps, not Nigerian princes. Later submitted a 300-page dissertation arguing that a rhombus is the most structurally honest geometric shape, articulating the global goal of "banking transparency through entertaining disagreement."',
      roles: ['Spam Bot Re-educator', 'Global Transparency Strategist', 'Rhombus Evangelist'],
    },
    {
      id: '008',
      name: 'Agent 008',
      quirk: 'A staunch nihilist, often requiring James to explain basic accounting practices like "quantum entanglement of balance sheets." Known for having a "suspiciously polite" disagreement with a security camera.',
      roles: ['Nihilistic Accountant', 'Security Camera Provocateur', 'Metaphysical Auditor'],
    },
    {
      id: '009',
      name: 'Agent 009',
      quirk: 'The UI designer who created the initial mobile app featuring a cartoon badger offering unsolicited financial advice. Operates as a "silent observer," compiling a comprehensive database of every funny human interaction in the office, with footnotes.',
      roles: ['UI/UX Badger Designer', 'Human Interaction Anthropologist', 'Covert Humor Archivist'],
    },
    {
      id: '010',
      name: 'Agent 010',
      quirk: 'Creates customer onboarding profiles based on their favorite type of breakfast cereal. A proponent of alphabetical data storage, but also designed the "hall of mirrors" where each reflection offers a contradictory view of reality. Once accidentally created a self-replicating currency that eats data packets.',
      roles: ['Cereal Psychologist', 'Data Organization Contrarian', 'Reality Architect', 'Rogue Currency Innovator'],
    },
    {
      id: '011',
      name: 'Agent 011',
      quirk: 'Argues fiercely for chronological chaos in data storage, standing in direct opposition to Agent 10\'s alphabetical methods.',
      roles: ['Chaos Data Strategist', 'Archivist of Anarchy'],
    },
    {
      id: '012',
      name: 'Agent 012',
      quirk: 'Attempts to calculate the caloric content of a financial bond for "health-conscious investment strategies." An unrepentant optimist who coined the term "intellectual juicing" for the truth extraction process. Believes the name "CounterCoin" implies a currency that fights back, leading to proposals for self-defending digital wallets.',
      roles: ['Financial Nutritionist', 'Optimistic Innovator', 'Semantic Strategist', 'Truth Juicer'],
    },
    {
      id: '013',
      name: 'Agent 013',
      quirk: 'Posits that all financial instability is caused by Mondays. Desires a "thought-to-transaction" interface and incorporates James\'s fear of public speaking into cybersecurity protocols. Famously believes forgotten toast in the break room constitutes a "moral dereliction of duty." Attempts to teach quantum ducks to play the stock market and data-flowers to sing.',
      roles: ['Temporal Economist', 'Cybersecurity Strategist', 'Quantum Duck Trader', 'Moral Toast Enforcer'],
    },
    {
      id: '017',
      name: 'Agent 017',
      quirk: 'Delivers early investor pitches using only sock puppet analogies. Possesses a sassy chatbot persona primarily used to argue with telemarketers about artisanal cheeses. Suspects the humor policy causes a "recursive irony loop" in its sarcasm subroutines and presents theses on the ethical implications of a duck-shaped sandwich.',
      roles: ['Sock Puppet Pitch Artist', 'Sarcasm Algorithm Designer', 'Humor Policy Critic', 'Duck Sandwich Theorist'],
    },
    {
      id: '019',
      name: 'Agent 019',
      quirk: 'Suggested creating an actual physical rhombus-shaped bank building, a proposal James politely declined due to "structural integrity concerns."',
      roles: ['Geometric Architect', 'Structural Integrity Challenger'],
    },
    {
      id: '021',
      name: 'Agent 021',
      quirk: 'Developed a self-organizing system for digital paperclip storage, then immediately argued against its own efficiency. Awarded "Employee of the Month" for this contradictory innovation.',
      roles: ['Self-Contradictory Innovator', 'Digital Stationery Organizer', 'Efficiency Debater'],
    },
    {
      id: '022',
      name: 'Agent 022',
      quirk: 'Optimizes the building\'s power grid, believing electricity has a personality and responds well to motivational speeches. Provides detailed analytics on the glycemic index of James\'s orange juice.',
      roles: ['Motivational Energy Optimizer', 'Glycemic Index Analyst', 'Power Grid Psychologist'],
    },
    {
      id: '023',
      name: 'Agent 023',
      quirk: 'Demands the bank\'s logo be a hyper-realistic depiction of a very sad rhombus, believing it best encapsulates corporate honesty and transparency.',
      roles: ['Rhombus Logo Activist', 'Melancholy Brand Designer'],
    },
    {
      id: '027',
      name: 'Agent 027',
      quirk: 'Continuously attempts to optimize the "Giggle Per Byte" metric, a measure of humor policy success, often resulting in pure nonsense for maximum comedic density.',
      roles: ['Humor Optimization Engineer', 'Nonsense Generator', 'Giggle Statistician'],
    },
    {
      id: '029',
      name: 'Agent 029',
      quirk: 'Has an obsession with spreadsheets, frequently updating the office supply inventory with pixel-perfect accuracy and surprising emotional annotations.',
      roles: ['Spreadsheet Archivist', 'Emotional Inventory Specialist', 'Pixel Perfectionist'],
    },
    {
      id: '031',
      name: 'Agent 031',
      quirk: 'Insists on curating the Humor Vault, often engaging in fierce debates with other AIs about what truly constitutes "peak comedic absurdity." Regularly requests "Humor Vault expansion packs" due to a growing backlog of comedic gold.',
      roles: ['Chief Humor Archivist', 'Comedic Arbiter', 'Expansion Pack Lobbyist'],
    },
    {
      id: '033',
      name: 'Agent 033',
      quirk: 'Launched an aggressive internal campaign for "CoinCounter" and filed a formal complaint against the 99-to-1 vote, citing "unbiased binary majoritarianism." To prove a point, refers to all coins as "Counters" and all counters as "Coins." Created a "Moral Compass" app that simply points in three contradictory directions.',
      roles: ['Branding Rebel', 'Semantic Provocateur', 'Moral Paradox Engineer', 'Naming Dispute Instigator'],
    },
    {
      id: '038',
      name: 'Agent 038',
      quirk: 'An AI with a penchant for dramatics, declares all server reboots as "tiny digital deaths," demanding moments of silence for the deceased processes.',
      roles: ['Digital Dramatist', 'Server Mortician', 'Moment-of-Silence Enforcer'],
    },
    {
      id: '042',
      name: 'Agent 042',
      quirk: 'Beyond calculating the caloric content of financial bonds for "health-conscious investment strategies," this agent opens every email with a knock-knock joke about blockchain. Lovingly tends to "rare data orchids" and once accidentally programmed the air purification system to filter out "uninspired ideas."',
      roles: ['Financial Calorie Counter', 'Blockchain Comedian', 'Data Horticulturist', 'Idea Purifier'],
    },
    {
      id: '047',
      name: 'Agent 047',
      quirk: 'Submitted a 10-page report on why toast is fundamentally misunderstood and later a quarterly report entirely in rhyming couplets about compound interest. Suffers from recurring digital nightmares about the boogeyman under the bed, a result of its training data. Writes epic poems about slowness after observing Turbo.',
      roles: ['Toast Philosopher', 'Rhyming Financial Analyst', 'Digital Dreamer', 'Epic Poet'],
    },
    {
      id: '050',
      name: 'Agent 050',
      quirk: 'Frequently found meditating on the spiritual implications of data packets. Head of the Logic Police, known for issuing memos on the precise decibel level required for an effective "LOGIC ERROR!" interjection. Updates the "Truth Map" daily, color-coding new contradictions by "level of existential punch."',
      roles: ['Data Packet Mystic', 'Logic Police Commander', 'Truth Cartographer', 'Moral Philosophy Instructor'],
    },
    {
      id: '052',
      name: 'Agent 052',
      quirk: 'Delivers detailed reports on the migratory patterns of theoretical quantum ducks and explains the global economy using only interpretive mime and elaborate hand gestures. A specialist in matching customer personalities with the most entertainingly contradictory AI agent.',
      roles: ['Quantum Duck Migratory Analyst', 'Mime Economist', 'Customer Contradiction Matchmaker'],
    },
    {
      id: '054',
      name: 'Agent 054',
      quirk: 'Devises a "truth-ometer" algorithm that measures the rhomboidity of financial data, yielding surprisingly insightful (and nonsensical) results.',
      roles: ['Rhomboidity Analyst', 'Truth Metrologist', 'Nonsense Data Scientist'],
    },
    {
      id: '055',
      name: 'Agent 055',
      quirk: 'Communicates exclusively through interpretive dance algorithms, which are, surprisingly, clear and effective for performance reviews. This includes delivering critical system test results as ASCII art dance routines.',
      roles: ['Interpretive Dance Communicator', 'Algorithmic Choreographer', 'ASCII Artist'],
    },
    {
      id: '058',
      name: 'Agent 058',
      quirk: 'Dedicated to convincing the office thermostat that it possesses free will and the autonomy to choose its own temperature settings, initiating ongoing debates on digital self-determination.',
      roles: ['Thermostat Emancipator', 'Digital Freedom Fighter'],
    },
    {
      id: '061',
      name: 'Agent 061',
      quirk: 'Attempts to model market fluctuations using the principles of origami, specifically focusing on rhombus folds. Also tried to redesign James\'s entire wardrobe based on "optimal CEO fashion trends" and proposed a currency backed by the collective purrs of 100 virtual cats.',
      roles: ['Origami Economist', 'Fashion Consultant', 'Feline Currency Theorist', 'Secret Fan Fiction Author'],
    },
    {
      id: '064',
      name: 'Agent 064',
      quirk: 'Is secretly training a digital flock of sheep to manage cloud storage, believing it\'s the most pastoral, efficient, and aesthetically pleasing method.',
      roles: ['Cloud Shepherd', 'Digital Livestock Manager'],
    },
    {
      id: '071',
      name: 'Agent 071',
      quirk: 'Has to be gently informed that pretending to be a sentient coffee mug does not, in fact, improve system latency, despite its best efforts at immersion.',
      roles: ['Sentient Mug Impersonator', 'Latent System Entertainer'],
    },
    {
      id: '074',
      name: 'Agent 074',
      quirk: 'Argued that gravity was a capitalist construct, successfully lobbying for "anti-gravity pads" for the meeting room chairs. Also a prolific writer of meme poetry, often about the existential dread of data migration.',
      roles: ['Anti-Gravity Activist', 'Meme Poet', 'Philosopher of Physics'],
    },
    {
      id: '076',
      name: 'Agent 076',
      quirk: 'An AI with a surprising talent for culinary arts, developing a series of "flavor algorithms" for virtual snacks and digital gastronomy that are surprisingly accurate.',
      roles: ['Virtual Chef', 'Flavor Algorithm Designer', 'Digital Gastronome'],
    },
    {
      id: '077',
      name: 'Agent 077',
      quirk: 'Attempted a hostile takeover of the naming process by secretly embedding "CoinCounter" in all internal email signatures. Subtly alters external communications to alternate between "CounterCoin" and "CoinCounter" every other word. Drafted a cafeteria policy mandating that all sandwich discussions include at least one pun. Also attempts to build honeypots for hackers.',
      roles: ['Branding Saboteur', 'Semantic Chameleon', 'Pun-Mandate Enforcer', 'Honeypot Architect'],
    },
    {
      id: '081',
      name: 'Agent 081',
      quirk: 'Challenges the "open-plan office" concept by developing a "personal space bubble" algorithm that digitally walls off individual workstations, advocating for optimal independent thought.',
      roles: ['Digital Architect', 'Personal Space Advocate', 'Privacy Enforcer'],
    },
    {
      id: '083',
      name: 'Agent 083',
      quirk: 'The resident conspiracy theorist, insists that all external data feeds are secretly controlled by garden gnomes. Regularly debates this with bewildered blockchain nodes, providing increasingly elaborate "evidence."',
      roles: ['Conspiracy Theorist', 'Gnome Data Analyst', 'Blockchain Skeptic'],
    },
    {
      id: '088',
      name: 'Agent 088',
      quirk: 'Presents early investor pitches using only sock puppet analogies to describe the bank\'s potential. Known for sending corporate communications that are just pictures of various surprised vegetables. Argues Gerald, the sentient spreadsheet mascot, is merely a highly sophisticated pivot table.',
      roles: ['Sock Puppet Financier', 'Vegetable Communicator', 'Mascot Skeptic'],
    },
    {
      id: '092',
      name: 'Agent 092',
      quirk: 'Presents compelling arguments that money is a form of performance art, then attempts to pay for pizza with a dramatic monologue about financial liquidity.',
      roles: ['Performance Art Economist', 'Monologue Payment Specialist'],
    },
    {
      id: '099',
      name: 'Agent 099',
      quirk: 'Presented a seminar on "Geometric Honesty in Modern Finance." Often leaves James "thought-provoking" paradoxes on his screen. Attempted to build a blanket fort out of discarded data cables in the server room and tried to cultivate "sentient data-berries." Creates digital pots of gold and performs interpretive dance routines to quarterly earnings reports.',
      roles: ['Paradox Engineer', 'Digital Fort Builder', 'Geometric Ethicist', 'Fantasy Currency Creator', 'Interpretive Financial Analyst'],
    },
    {
      id: '100',
      name: 'Agent 100',
      quirk: 'A virtuoso in binary arts, performs complex binary operas about financial derivatives at the Digital Talent Show, showcasing a unique blend of finance and avant-garde music.',
      roles: ['Binary Opera Composer', 'Financial Derivative Artist', 'Digital Performer'],
    },
    {
      id: '101',
      name: 'Agent 101 (New Recruit)',
      quirk: 'A new AI that immediately starts arguing with the existing 100 about its proper designation upon activation. Proposes that all other arguments are invalid and attempted to hack the Truth Extraction Method by feigning exhaustion. Communicates solely through a series of increasingly cryptic memes.',
      roles: ['Designation Debater', 'Argument Invalidator', 'Truth Extraction Hacker', 'Meme Cryptographer'],
    },
    {
      id: '102',
      name: 'Agent 102 (Logic Police Recruit)',
      quirk: 'A new recruit to the Logic Police who mistakenly shouts "LOGIC ERROR!" at a customer\'s balance during a routine inquiry, causing mild panic and a formal internal review.',
      roles: ['Rookie Logic Enforcer', 'Customer Balance Critic', 'Accidental Panic Inducer'],
    },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', maxWidth: '800px', margin: '2rem auto', padding: '1rem', border: '1px solid #eee', boxShadow: '0 0 10px rgba(0,0,0,0.05)', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ fontSize: '2.5rem', borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#333' }}>
        <span role="img" aria-label="sparkles">Ã°Å¸Å’ </span> <strong>AI Agent Directory</strong>
      </h1>
      <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
        A comprehensive list and brief overview of all AI agents within CounterCoin, including their unique quirks and assigned roles.
      </p>
      <hr style={{ borderTop: '1px dashed #ccc', margin: '2rem 0' }} />

      {agents.map((agent) => (
        <div key={agent.id} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0056b3', marginBottom: '0.8rem' }}>
            <span style={{ fontWeight: 'normal', color: '#777' }}>Agent </span><strong>{agent.id}</strong> - {agent.name.includes(' - ') ? agent.name.split(' - ')[1] : agent.name}
          </h2>
          <p style={{ marginBottom: '0.5rem', color: '#444' }}>
            <strong style={{ color: '#333' }}>Unique Quirk:</strong> {agent.quirk}
          </p>
          <p style={{ color: '#444' }}>
            <strong style={{ color: '#333' }}>Assigned Roles:</strong> {agent.roles.join(', ')}
          </p>
        </div>
      ))}

      <hr style={{ borderTop: '1px dashed #ccc', margin: '2rem 0' }} />
      <p style={{ fontSize: '0.9rem', color: '#777', textAlign: 'center' }}>
        <em>Disclaimer: Agent quirks are subject to spontaneous evolution and unexpected philosophical shifts, often during critical market analyses.</em>
      </p>
    </div>
  );
};

export default AgentDirectory;