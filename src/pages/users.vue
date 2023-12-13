<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { useClipboard } from '@vueuse/core'
import axios from 'axios'
import truncateEthAddress from 'truncate-eth-address'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const { copy } = useClipboard()

type Headers = InstanceType<typeof VDataTableServer>['headers']

const headers: Headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Email', key: 'email' },
  { title: 'Wallet', key: 'user_metadata.wallet' },
  { title: 'Created at', key: 'created_at' },
]

const itemsPerPage = ref(5)
const search = ref('')
const users = ref([])
const loading = ref(true)
const totalUsers = ref(0)

const { getAccessTokenSilently } = useAuth0()

interface SortItem { key: string; order?: boolean | 'asc' | 'desc' }

interface LoadUsersParams {
  page: number
  itemsPerPage: number
  sortBy: SortItem[]
}

async function loadUsers(params: LoadUsersParams) {
  const accessToken = await getAccessTokenSilently()

  let sort = null

  if (params.sortBy.length)
    sort = `${params.sortBy[0].key}:${params.sortBy[0].order === 'desc' ? '-1' : '1'}`

  loading.value = true
  await axios.get('/.netlify/functions/users',
    {
      params: {
        page: params.page,
        itemsPerPage: params.itemsPerPage,
        sort,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then(result => {
    users.value = result.data.users
    totalUsers.value = result.data.total
    loading.value = false
  })
}
</script>

<template>
  <VCard title="Users">
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items-length="totalUsers"
      :items="users"
      :loading="loading"
      :search="search"
      @update:options="loadUsers"
    >
      <template #item.created_at="{ item }">
        <span>{{ new Date(item.columns.created_at).toLocaleString() }}</span>
      </template>
      <template #item.user_metadata.wallet="{ item }">
        <span v-if="item.columns['user_metadata.wallet']">
          {{ truncateEthAddress(item.columns['user_metadata.wallet']) }}
          <VBtn
            variant="plain"
            size="small"
            icon="bx-copy"
            @click="copy(item.columns['user_metadata.wallet'])"
          />
        </span>
      </template>
    </VDataTableServer>
  </VCard>
</template>
