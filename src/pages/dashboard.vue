<script setup lang="ts">
import { useEniblock } from '@/plugins/eniblock'

onMounted(async () => {
  const sdk = useEniblock()

  if (sdk) {
    // await sdk.wallet.destroy()

    const wallet = await sdk.wallet.instantiate()

    console.log(wallet)

    const account = await wallet.account.instantiate(import.meta.env.VITE_ENIBLOCK_ACCOUNT)

    console.log(account)

    console.log(await account.getAddress())
  }
})
</script>

<template>
  <VRow />
</template>
