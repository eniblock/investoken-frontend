<script setup lang="ts">
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="12"
    >
      <VRow>
        <VCol
          cols="12"
          lg="12"
          md="12"
        >
          <VSkeletonLoader
            class="text-2xl mb-5"
            type="text"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText class="d-flex align-center pb-4">
              <VAvatar
                rounded
                variant="tonal"
                color="grey"
              />
            </VCardText>
            <VCardText>
              <VSkeletonLoader
                type="heading"
                height="69"
              />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText class="d-flex align-center pb-4">
              <VAvatar
                rounded
                variant="tonal"
                color="grey"
              />
            </VCardText>
            <VCardText>
              <VSkeletonLoader
                type="heading"
                height="69"
              />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText class="d-flex align-center pb-4">
              <VAvatar
                rounded
                variant="tonal"
                color="grey"
              />
            </VCardText>
            <VCardText>
              <VSkeletonLoader
                type="heading"
                height="69"
              />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText class="d-flex align-center pb-4">
              <VAvatar
                rounded
                variant="tonal"
                color="grey"
              />
            </VCardText>
            <VCardText>
              <VSkeletonLoader
                type="heading"
                height="69"
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
