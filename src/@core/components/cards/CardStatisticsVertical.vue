<script setup lang="ts">
interface Props {
  title: string
  stats: string
  icon: string
}

const props = defineProps<Props>()
</script>

<template>
  <VCard>
    <VCardText class="d-flex align-center pb-4">
      <VAvatar
        rounded
        variant="tonal"
        color="primary"
      >
        <VIcon :icon="props.icon" />
      </VAvatar>
    </VCardText>

    <VCardText>
      <p class="mb-1">
        {{ props.title }}
      </p>
      <h5 class="text-h5 text-no-wrap mb-3">
        {{ props.stats }}
      </h5>
    </VCardText>
  </VCard>
</template>
