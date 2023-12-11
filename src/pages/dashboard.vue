<script setup lang="ts">
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import Dashboard from '@/layouts/components/Dashboard.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <Dashboard />
    </template>
    <template #fallback>
      <VSkeletonLoader type="card" />
    </template>
  </Suspense>
</template>
