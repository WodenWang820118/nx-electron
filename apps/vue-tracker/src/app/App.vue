<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import HeaderComponent from '../components/shared/HeaderComponent.vue';
import FooterComponent from '../components/shared/FooterComponent.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useTheme } from '../composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
    <ConfirmDialog />
    <HeaderComponent />
    <main class="flex-1 max-w-5xl w-full mx-auto py-6">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped lang="css">
/* App-specific styles */
</style>
