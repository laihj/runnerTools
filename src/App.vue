<template>
  <a href="https://www.paceguru.app/plans/hanson" target="_blank" class="upgrade-banner">
    <div class="banner-content">
      <span class="banner-icon">🚀</span>
      <div class="banner-text">
        <span class="banner-title">Try PaceGuru - The Upgraded Version!</span>
        <span class="banner-subtitle">Smarter training plans, better tracking, more features →</span>
      </div>
    </div>
  </a>
  <h1>Hanson Marathon Method Pace Calculator</h1>
  <h3 class="hint">Generate Training Plan Based on Your Marathon Goal</h3>
  <DataTable :data="paceArray" />
</template>

<script>
import DataTable from './components/DataTable.vue'
import json from './assets/pace.json'

export default {
  name: 'App',
  components: {
      DataTable
  },
  setup() {
     return {
      paceArray : json
    }
   }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.hint {
  color: #4b4f53;
}

/* Upgrade Banner Styles */
.upgrade-banner {
  display: block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 16px 20px;
  margin: 0 0 30px 0;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.upgrade-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #7b8eea 0%, #8b5ba2 100%);
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.banner-icon {
  font-size: 28px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.banner-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.banner-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: 14px;
  opacity: 0.95;
}

@media (max-width: 600px) {
  .upgrade-banner {
    margin: 0 10px 20px 10px;
    padding: 12px 16px;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .banner-text {
    align-items: center;
  }
  
  .banner-title {
    font-size: 16px;
  }
  
  .banner-subtitle {
    font-size: 12px;
  }
}
</style>
