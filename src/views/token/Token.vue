<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import { ref } from 'vue'

const { getAccessTokenSilently } = useAuth0()
let accessToken = await getAccessTokenSilently()

const tokenPrice = ref((await axios.get('/.netlify/functions/tokenPrice',
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
)).data)

async function submit() {
  accessToken = await getAccessTokenSilently()

  await axios.patch('/.netlify/functions/tokenPrice',
    tokenPrice.value,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}
</script>

<template>
  <VRow>
    <VCol
      cols="3"
      lg="3"
      md="3"
    >
      <VCard title="Token">
        <VSheet>
          <VForm
            fast-fail
            @submit.prevent="submit"
          >
            <VTextField
              v-model="tokenPrice"
              type="number"
              min="0"
              step=".01"
              label="Price (€)"
              required
            />
            <VBtn
              type="submit"
              block
              class="mt-2"
            >
              Save
            </VBtn>
          </VForm>
        </VSheet>
      </vcard>
    </VCol>
  </VRow>
</template>
