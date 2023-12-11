<script setup lang="ts">
import Dashboard from '@/layouts/components/Dashboard.vue'
import DashboardSkeleton from '@/layouts/components/DashboardSkeleton.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <Dashboard />
    </template>
    <template #fallback>
      <DashboardSkeleton />
    </template>
  </Suspense>
</template>
