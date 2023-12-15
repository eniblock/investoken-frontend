<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

const { isAuthenticated, user } = useAuth0()

function hasRole(role: string) {
  if (user.value && user.value[import.meta.env.VITE_AUTH0_CLAIM_ROLES])
    return user.value[import.meta.env.VITE_AUTH0_CLAIM_ROLES][0] === role

  return false
}
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Dashboard',
          icon: 'bx-home',
          to: '/',
        }"
      />

      <!-- 👉 Administration -->
      <VerticalNavSectionTitle
        v-if="isAuthenticated && hasRole('Admin')"
        :item="{
          heading: 'Administration',
        }"
      />
      <VerticalNavLink
        v-if="isAuthenticated && hasRole('Admin')"
        :item="{
          title: 'Users',
          icon: 'mdi-account-cog-outline',
          to: '/users',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
