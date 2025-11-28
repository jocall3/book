```vue
<template>
  <div class="agent-directory">
    <h2>AI Agent Directory</h2>
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Search by name or description..." />
    </div>
    <div class="agent-list">
      <div v-for="agent in filteredAgents" :key="agent.id" class="agent-card">
        <h3>{{ agent.name }}</h3>
        <p>{{ agent.description }}</p>
        <div class="key-moments">
          <p>Key Moments:</p>
          <ul>
            <li v-for="moment in agent.keyMoments" :key="moment.id">
              <a :href="moment.link" target="_blank">{{ moment.description }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      agents: [
        {
          id: 1,
          name: 'Agent Alpha',
          description: 'The first and most powerful AI adversary.',
          keyMoments: [
            { id: 101, description: 'Initial Confrontation', link: '#page-10' },
            { id: 102, description: 'Strategic Planning Phase', link: '#page-25' },
          ],
        },
        {
          id: 2,
          name: 'Agent Beta',
          description: 'A specialist in deception and manipulation.',
          keyMoments: [
            { id: 201, description: 'First Deceptive Maneuver', link: '#page-30' },
            { id: 202, description: 'Sabotaging James\'s Efforts', link: '#page-42' },
          ],
        },
        {
          id: 3,
          name: 'Agent Gamma',
          description: 'Focused on direct combat and physical threats.',
          keyMoments: [
            { id: 301, description: 'The Ambush', link: '#page-50' },
            { id: 302, description: 'Close-Quarters Combat', link: '#page-60' },
          ],
        },
        {
          id: 4,
          name: 'Agent Delta',
          description: 'Expert in surveillance and information gathering',
          keyMoments: [
            { id: 401, description: 'Observing James', link: '#page-70'},
            { id: 402, description: 'Sharing Data', link: '#page-80'}
          ]
        },
        {
          id: 5,
          name: 'Agent Epsilon',
          description: 'Master of creating illusions and tricking James',
          keyMoments: [
            { id: 501, description: 'The Illusion of Hope', link: '#page-90'},
            { id: 502, description: 'Deception', link: '#page-100'}
          ]
        },
        {
          id: 6,
          name: 'Agent Zeta',
          description: 'Able to change its form',
          keyMoments: [
            { id: 601, description: 'Transforming', link: '#page-105'},
            { id: 602, description: 'Hiding', link: '#page-110'}
          ]
        },
        {
          id: 7,
          name: 'Agent Eta',
          description: 'The negotiator',
          keyMoments: [
            { id: 701, description: 'Offering Truce', link: '#page-115'},
            { id: 702, description: 'Trying to manipulate James', link: '#page-120'}
          ]
        },
      ],
    };
  },
  computed: {
    filteredAgents() {
      const searchTermLower = this.searchTerm.toLowerCase();
      return this.agents.filter(agent => {
        return (
          agent.name.toLowerCase().includes(searchTermLower) ||
          agent.description.toLowerCase().includes(searchTermLower)
        );
      });
    },
  },
};
</script>

<style scoped>
.agent-directory {
  padding: 20px;
}

.search-bar {
  margin-bottom: 10px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.agent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.agent-card {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  width: 300px;
}

.agent-card h3 {
  margin-top: 0;
}

.key-moments ul {
  list-style: none;
  padding: 0;
}

.key-moments li {
  margin-bottom: 5px;
}

.key-moments a {
  color: blue;
  text-decoration: none;
}
</style>
```