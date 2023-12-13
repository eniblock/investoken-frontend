<script setup lang="ts">
import Dashboard from '@/views/dashboard/Dashboard.vue'
import DashboardSkeleton from '@/views/dashboard/DashboardSkeleton.vue'
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
