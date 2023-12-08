<script setup lang="ts">
import { useEniblock } from '@/plugins/eniblock'

import investoken from '@images/svg/investoken.svg'

const amount = 12345
const supply = 12345667.12
let balance = 0

const sdk = useEniblock()

if (sdk) {
  // await sdk.wallet.destroy()

  const wallet = await sdk.wallet.instantiate()

  console.log(wallet)

  const account = await wallet.account.instantiate(import.meta.env.VITE_ENIBLOCK_ACCOUNT)

  console.log(account)

  console.log(await account.getAddress())

  console.log(await account.getTokensBalance())

  const tokens = await sdk.utils.getTokensBalance(await account.getAddress(), ['0x0000000000000000000000000000000000001010'])

  balance = tokens[0].balance.toNumber()
}
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
          <p class="text-2xl mb-6">
            <VAvatar
              class="cursor-pointer"
              rounded="0"
              :image="investoken"
            />
            Investoken
          </p>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            v-if="amount"
            :stats="$n(amount, 'currency')"
            title="Amount"
            icon="bx-wallet"
          />
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            :stats="$n(balance, 'decimal').concat(' ITVK')"
            title="Token Balance"
            icon="bx-circle-three-quarter"
          />
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            :stats="$n(amount, 'currency')"
            title="Token Price"
            icon="bx-euro"
          />
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            :stats="$n(supply, 'compact')"
            title="Circulating supply"
            icon="bx-transfer"
          />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
