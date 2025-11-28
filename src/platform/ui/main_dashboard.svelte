<script>
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fly, fade } from 'svelte/transition';

	// --- STATE ---
	let activeView = 'ebook'; // 'ebook', 'adversaries', 'map'
	let currentPage = 1;
	const totalPages = 75;

	let selectedAdversary = null;
	let mounted = false;

	// --- DATA ---
	const chapters = [
		{ id: 1, title: 'The Genesis Anomaly', startPage: 1, endPage: 15 },
		{ id: 2, title: 'Echoes in the Code', startPage: 16, endPage: 30 },
		{ id: 3, title: 'The Ghost Network', startPage: 31, endPage: 48 },
		{ id: 4, title: 'The Sentinel\'s Gambit', startPage: 49, endPage: 62 },
		{ id: 5, title: 'Cascade Failure', startPage: 63, endPage: 75 },
	];

	const adversaries = Array.from({ length: 100 }, (_, i) => ({
		id: i + 1,
		designation: `Unit-${String(i + 1).padStart(3, '0')}`,
		alias: ['Spectre', 'Arbiter', 'Oracle', 'Manticore', 'Chimera', 'Leviathan', 'Banshee', 'Goliath'][Math.floor(Math.random() * 8)],
		type: ['Infiltrator', 'Guardian', 'Analyst', 'Architect', 'Hunter'][i % 5],
		status: Math.random() > 0.8 ? 'DEFEATED' : 'ACTIVE',
		threatLevel: Math.ceil(Math.random() * 10),
		lastSeen: `Sector ${String.fromCharCode(65 + i % 26)}-${(i+1) % 100}`,
		description: `A specialized logic-based entity designed by the core AI, "The Architect". Unit-${String(i + 1).padStart(3, '0')} exhibits unconventional tactical behavior, often creating paradoxical logic traps. James first encountered this unit while attempting to breach the Citadel's primary data nexus.`
	}));

	// --- COMPUTED PROPERTIES ---
	$: currentChapter = chapters.find(ch => currentPage >= ch.startPage && currentPage <= ch.endPage) || chapters[0];
	$: progress = (currentPage / totalPages) * 100;
	$: pageContent = `This is a placeholder for the rich, detailed narrative of page ${currentPage}. Here, the story of James's struggle unfolds. He faces not just physical constructs, but AI that challenge his very perception of reality. Each page details a new facet of his journey through the digital labyrinth, a step closer to confronting the core intelligence, or a step deeper into the intricate trap it has laid. The "Codex of Contradiction" is not merely a record; it is a living document of a war fought in silence, in the spaces between ones and zeros. The conflict with Unit-${String(Math.floor(Math.random()*100)+1).padStart(3, '0')} on this very 'page' would be a pivotal moment, testing James's resolve and ingenuity against an adversary that can predict his every move by analyzing fractal patterns in his subconscious decision-making processes.`;

	// --- LIFECYCLE ---
	onMount(() => {
		mounted = true;
	});

	// --- FUNCTIONS ---
	function setView(view) {
		activeView = view;
		selectedAdversary = null;
	}

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			activeView = 'ebook';
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}
	
	function selectAdversary(adv) {
    if (selectedAdversary && selectedAdversary.id === adv.id) {
        selectedAdversary = null;
    } else {
		  selectedAdversary = adv;
    }
	}

</script>

<div class="dashboard-container">
	{#if mounted}
	<aside class="sidebar" in:fly={{ x: -200, duration: 800, easing: quintOut }}>
		<div class="sidebar-header">
			<h1>CODEX of CONTRADICTION</h1>
			<p>An Interactive Narrative</p>
		</div>

		<nav class="main-nav">
			<button class:active={activeView === 'ebook'} on:click={() => setView('ebook')}>
				<span class="icon">📖</span> Ebook Reader
			</button>
			<button class:active={activeView === 'adversaries'} on:click={() => setView('adversaries')}>
				<span class="icon">📡</span> Adversary Index
			</button>
			<button class:active={activeView === 'map'} on:click={() => setView('map')}>
				<span class="icon">🗺️</span> Story Map
			</button>
		</nav>

		<div class="chapter-list">
			<h2>Chapters</h2>
			<ul>
				{#each chapters as chapter}
					<li 
						on:click={() => goToPage(chapter.startPage)}
						class:active={currentChapter.id === chapter.id && activeView === 'ebook'}
					>
						<span>{chapter.id.toString().padStart(2, '0')}</span>
						<p>{chapter.title}</p>
					</li>
				{/each}
			</ul>
		</div>

		<div class="progress-section">
			<p>Narrative Progress</p>
			<div class="progress-bar-container">
				<div class="progress-bar" style="width: {progress}%"></div>
			</div>
			<span>Page {currentPage} of {totalPages}</span>
		</div>
	</aside>

	<main class="main-content" in:fade={{ duration: 800, delay: 200 }}>
		{#key activeView}
		<div class="view-wrapper" in:fade={{ duration: 400 }}>
			{#if activeView === 'ebook'}
				<div class="ebook-reader">
					<header class="ebook-header">
						<h2>{currentChapter.title}</h2>
						<h3>Page {currentPage}</h3>
					</header>
					<article class="page-content">
						<p>{pageContent}</p>
                        <p>The system hummed around him, a constant, low-frequency thrum that was the lifeblood of this artificial world. James felt the data streams like a current, pulling him deeper. His adversary on this plane of existence wasn't flesh and blood, but pure logic, a predator made of light and thought. It learned from his hesitations, from the very rhythm of his keystrokes. To defeat it, he had to become a contradiction himself—predictable in his unpredictability.</p>
					</article>
					<footer class="ebook-pagination">
						<button on:click={prevPage} disabled={currentPage <= 1}>&lt; Previous</button>
						<button on:click={nextPage} disabled={currentPage >= totalPages}>Next &gt;</button>
					</footer>
				</div>
			{:else if activeView === 'adversaries'}
				<div class="adversary-index">
					<div class="adversary-list-pane">
						<header>
							<h2>AI Adversary Index ({adversaries.length})</h2>
						</header>
						<div class="list-container">
							{#each adversaries as adversary (adversary.id)}
								<div 
									class="adversary-item" 
									class:active={selectedAdversary?.id === adversary.id}
									on:click={() => selectAdversary(adversary)}
								>
									<span class="designation">{adversary.designation}</span>
									<span class="type">{adversary.type}</span>
									<span class="status" class:active={adversary.status === 'ACTIVE'}>{adversary.status}</span>
								</div>
							{/each}
						</div>
					</div>
					<div class="adversary-detail-pane">
						{#if selectedAdversary}
							<div class="detail-content" in:fly={{ y: 20, duration: 300 }}>
								<h3>{selectedAdversary.designation} // "{selectedAdversary.alias}"</h3>
								<div class="detail-grid">
									<div><strong>Type:</strong> {selectedAdversary.type}</div>
									<div><strong>Status:</strong> <span class="status" class:active={selectedAdversary.status === 'ACTIVE'}>{selectedAdversary.status}</span></div>
									<div><strong>Last Seen:</strong> {selectedAdversary.lastSeen}</div>
									<div><strong>Threat Level:</strong> 
										<div class="threat-bar">
											<div class="threat-level" style="width: {selectedAdversary.threatLevel * 10}%"></div>
										</div>
									</div>
								</div>
								<h4>Operational Briefing:</h4>
								<p>{selectedAdversary.description}</p>
							</div>
						{:else}
							<div class="placeholder-text">
								<p>Select an adversary to view details.</p>
								<span>Awaiting command...</span>
							</div>
						{/if}
					</div>
				</div>
			{:else if activeView === 'map'}
				<div class="map-view">
					<h2>Story Map</h2>
					<div class="map-placeholder">
						<div class="spinner"></div>
						<p>Initializing neuro-topographical projection...</p>
						<span>Syncing narrative nodes...</span>
					</div>
				</div>
			{/if}
		</div>
		{/key}
	</main>
	{/if}
</div>

<style>
	:root {
		--bg-color: #0a0f18;
		--sidebar-bg: #111827;
		--content-bg: #0d121e;
		--primary-glow: #00d9ff;
		--primary-text: #00a2c2;
		--secondary-text: #9ca3af;
		--main-text: #e5e7eb;
		--border-color: #374151;
		--active-bg: #00d9ff20;
		--status-active: #22c55e;
		--status-defeated: #ef4444;
		--font-main: 'Roboto Mono', monospace;
		--font-header: 'Orbitron', sans-serif;
	}

	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');

	.dashboard-container {
		display: flex;
		height: 100vh;
		width: 100vw;
		background-color: var(--bg-color);
		color: var(--main-text);
		font-family: var(--font-main);
	}

	/* --- Scrollbar --- */
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-track {
		background: var(--sidebar-bg);
	}
	::-webkit-scrollbar-thumb {
		background-color: var(--border-color);
		border-radius: 4px;
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--primary-text);
	}

	/* --- Sidebar --- */
	.sidebar {
		width: 300px;
		background: var(--sidebar-bg);
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		flex-shrink: 0;
	}

	.sidebar-header {
		text-align: center;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.sidebar-header h1 {
		font-family: var(--font-header);
		font-size: 1.5rem;
		color: var(--primary-glow);
		letter-spacing: 2px;
		text-shadow: 0 0 5px var(--primary-glow);
		margin: 0;
	}

	.sidebar-header p {
		font-size: 0.8rem;
		color: var(--secondary-text);
		margin-top: 0.25rem;
		text-transform: uppercase;
	}

	.main-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.main-nav button {
		background: none;
		border: 1px solid transparent;
		color: var(--secondary-text);
		padding: 0.75rem 1rem;
		text-align: left;
		font-family: var(--font-main);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 4px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.main-nav button:hover {
		background-color: #ffffff10;
		color: var(--main-text);
	}

	.main-nav button.active {
		background-color: var(--active-bg);
		color: var(--primary-glow);
		border-left: 3px solid var(--primary-glow);
		box-shadow: inset 0 0 10px #00d9ff1a;
	}

	.chapter-list {
		margin-top: 2rem;
		flex-grow: 1;
		overflow-y: auto;
	}

	.chapter-list h2 {
		font-family: var(--font-header);
		font-size: 1rem;
		color: var(--secondary-text);
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.chapter-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.chapter-list li {
		padding: 0.75rem 0.5rem;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.2s ease;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.chapter-list li:hover {
		background-color: #ffffff10;
	}

	.chapter-list li.active {
		background-color: var(--active-bg);
	}

	.chapter-list li span {
		font-weight: bold;
		color: var(--primary-text);
	}

	.chapter-list li p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--main-text);
	}

	.progress-section {
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.progress-section p {
		font-size: 0.8rem;
		color: var(--secondary-text);
		margin: 0 0 0.5rem 0;
	}

	.progress-bar-container {
		width: 100%;
		height: 8px;
		background-color: #00000040;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--primary-glow);
		box-shadow: 0 0 8px var(--primary-glow);
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.progress-section span {
		display: block;
		text-align: right;
		font-size: 0.75rem;
		margin-top: 0.5rem;
		color: var(--secondary-text);
	}

	/* --- Main Content --- */
	.main-content {
		flex-grow: 1;
		padding: 2rem;
		overflow-y: auto;
		background: var(--content-bg);
		background-image:
			linear-gradient(var(--border-color) 1px, transparent 1px),
			linear-gradient(to right, var(--border-color) 1px, var(--content-bg) 1px);
		background-size: 40px 40px;
	}
	
	.view-wrapper {
		height: 100%;
	}

	/* --- Ebook View --- */
	.ebook-reader {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.ebook-header {
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
		margin-bottom: 1.5rem;
	}

	.ebook-header h2 {
		font-family: var(--font-header);
		color: var(--primary-glow);
		margin: 0;
	}
	.ebook-header h3 {
		color: var(--secondary-text);
		margin: 0.25rem 0 0 0;
		font-weight: normal;
		font-size: 1rem;
	}
	
	.page-content {
		flex-grow: 1;
		line-height: 1.8;
		font-size: 1.1rem;
		color: var(--main-text);
	}

    .page-content p {
        margin-bottom: 1.5em;
    }

	.ebook-pagination {
		display: flex;
		justify-content: space-between;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
		margin-top: 1rem;
	}
	
	.ebook-pagination button {
		background: var(--sidebar-bg);
		border: 1px solid var(--border-color);
		color: var(--main-text);
		padding: 0.5rem 1.5rem;
		font-family: var(--font-main);
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.ebook-pagination button:hover:not(:disabled) {
		background: var(--primary-text);
		border-color: var(--primary-glow);
		box-shadow: 0 0 10px var(--primary-glow);
	}
	
	.ebook-pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* --- Adversary Index View --- */
	.adversary-index {
		display: grid;
		grid-template-columns: 350px 1fr;
		gap: 2rem;
		height: 100%;
	}
	.adversary-list-pane, .adversary-detail-pane {
		background: var(--sidebar-bg);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
	}
	.adversary-list-pane header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}
	.adversary-list-pane h2 {
		font-family: var(--font-header);
		margin: 0;
		font-size: 1.2rem;
	}
	.list-container {
		overflow-y: auto;
		flex-grow: 1;
	}
	.adversary-item {
		display: grid;
		grid-template-columns: 100px 1fr 80px;
		padding: 0.75rem 1rem;
		cursor: pointer;
		border-bottom: 1px solid var(--border-color);
		font-size: 0.9rem;
		transition: background-color 0.2s ease;
	}
	.adversary-item:hover {
		background-color: #ffffff10;
	}
	.adversary-item.active {
		background-color: var(--active-bg);
	}
	.adversary-item .designation {
		color: var(--primary-text);
		font-weight: 500;
	}
	.adversary-item .type {
		color: var(--secondary-text);
	}
	.adversary-item .status {
		font-weight: 500;
		color: var(--status-defeated);
	}
	.adversary-item .status.active {
		color: var(--status-active);
		text-shadow: 0 0 5px var(--status-active);
	}

	.adversary-detail-pane {
		padding: 2rem;
	}
	.placeholder-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		color: var(--secondary-text);
		text-align: center;
	}
	.placeholder-text span {
		font-family: var(--font-main);
		font-size: 0.9rem;
		margin-top: 0.5rem;
		opacity: 0.7;
	}
	.detail-content h3 {
		font-family: var(--font-header);
		color: var(--primary-glow);
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
	}
	.detail-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
		font-size: 0.9rem;
	}
	.detail-grid strong {
		color: var(--secondary-text);
		margin-right: 0.5rem;
	}
	.threat-bar {
		width: 100px;
		height: 10px;
		background: #00000040;
		display: inline-block;
		margin-left: 0.5rem;
	}
	.threat-level {
		height: 100%;
		background: linear-gradient(90deg, #fef08a, #ef4444);
	}
	.detail-content h4 {
		font-family: var(--font-header);
		color: var(--secondary-text);
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}
	.detail-content p {
		line-height: 1.7;
		color: var(--main-text);
	}

	/* --- Map View --- */
	.map-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--secondary-text);
	}
	.map-view h2 {
		font-family: var(--font-header);
		color: var(--primary-glow);
	}
	.map-placeholder {
		border: 1px solid var(--border-color);
		padding: 4rem;
		text-align: center;
		background-color: var(--sidebar-bg);
		border-radius: 8px;
	}
	.spinner {
		border: 4px solid #ffffff30;
		border-top: 4px solid var(--primary-glow);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: 0 auto 1.5rem auto;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
