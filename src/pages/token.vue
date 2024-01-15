<script setup lang="ts">
import Token from '@/views/token/Token.vue'
import TokenSkeleton from '@/views/token/TokenSkeleton.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <Token />
    </template>
    <template #fallback>
      <TokenSkeleton />
    </template>
  </Suspense>
</template>
