<script setup lang="ts">
import { hasRole } from '@/plugins/user';
import { useAuth0 } from '@auth0/auth0-vue';

const { user, logout } = useAuth0()
const adminRole = import.meta.env.VITE_AUTH0_CLAIM_ROLES_ADMIN
const isAdmin = hasRole(user, adminRole)

const logoutReturnTo = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg
        referrerpolicy="no-referrer"
        :src="user?.picture"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg
                      referrerpolicy="no-referrer"
                      :src="user?.picture"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user?.name }}
            </VListItemTitle>
            <VListItemSubtitle v-if="isAdmin">
              {{ adminRole }}
            </VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logoutReturnTo">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="bx-log-out"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
