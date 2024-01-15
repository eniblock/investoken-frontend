<script setup lang="ts">
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
</script>

<template>
  <VRow>
    <VCol
      cols="3"
      lg="3"
      md="3"
    >
      <VCard title="Token">
        <VSkeletonLoader type="text,button" />
      </VCard>
    </VCol>
  </VRow>
</template>
