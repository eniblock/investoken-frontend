<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const recentDevices = [
  {
    id: '1',
    type: 'New for you',
    email: true,
    browser: true,
    app: true,
  },
  {
    id: '2',
    type: 'Account activity',
    email: true,
    browser: true,
    app: true,
  },
  {
    id: '3',
    type: 'A new browser used to sign in',
    email: true,
    browser: true,
    app: false,
  },
  {
    id: '4',
    type: 'A new device is linked',
    email: true,
    browser: false,
    app: false,
  },
  {
    id: '5',
    type: 'A new device is linked',
    email: true,
    browser: false,
    app: false,
  },
  {
    id: '6',
    type: 'A new device is linked',
    email: true,
    browser: false,
    app: false,
  },
]

const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = recentDevices.slice()

        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order

          items.sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]

            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }

        const paginated = items.slice(start, end)

        resolve({ items: paginated, total: items.length })
      }, 500)
    })
  },
}

const itemsPerPage = ref(5)

const headers = ref([
  { title: 'Name', key: 'name', align: 'end' },
  { title: 'Email', key: 'email', align: 'end' },
  { title: 'Wallet', key: 'user_metadata.wallet', align: 'end' },
  { title: 'Created at', key: 'created_at', align: 'end' },
])

const search = ref('')
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

const { getAccessTokenSilently } = useAuth0()

async function loadItems({ page, itemsPerPage, sortBy }) {
  const accessToken = await getAccessTokenSilently()

  let sort = null

  if (sortBy.length)
    sort = `${sortBy[0].key}:${sortBy[0].order === 'desc' ? '-1' : '1'}`

  loading.value = true
  await axios.get('/.netlify/functions/users',
    {
      params: {
        page,
        itemsPerPage,
        sort,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then(result => {
    console.log(result.data)

    serverItems.value = result.data
    totalItems.value = 6 // todo
    loading.value = false
  })
}
</script>

<template>
  <VCard title="Users">
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items-length="totalItems"
      :items="serverItems"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    />
  </VCard>
</template>
