<script setup lang="ts">
import { ethers } from 'ethers'
import { useRoute } from 'vue-router'
import ERC20 from '@/assets/abi/ERC20.json'
import { useEniblock } from '@/plugins/eniblock'
import investoken from '@images/svg/investoken.svg'

const route = useRoute()

let amount = 0
let tokenBalance = 0
let totalSupply = 0
let symbol: string
let name: string
let contractAddress: string
const tokenPrice = 123.45

if (route.query.token)
  contractAddress = route.query.token.toString()

else
  contractAddress = '0x0000000000000000000000000000000000001010'

console.log(contractAddress)

const sdk = useEniblock()

if (sdk) {
  const wallet = await sdk.wallet.instantiate()

  console.log(wallet)

  const account = await wallet.account.instantiate(import.meta.env.VITE_ENIBLOCK_ACCOUNT)

  console.log(account)

  console.log(await account.getAddress())

  console.log(await account.getTokensBalance())

  const tokens = await sdk.utils.getTokensBalance(await account.getAddress(), [contractAddress])

  if (tokens.length > 0) {
    tokenBalance = tokens[0].balance.toNumber()
    amount = tokens[0].balance.multipliedBy(tokenPrice).toNumber()
  }

  const provider = await sdk.getProvider()
  const contract = new ethers.Contract(contractAddress, ERC20, provider)

  totalSupply = Number(ethers.utils.formatUnits((await contract.totalSupply()), await contract.decimals()))

  symbol = await contract.symbol()
  name = await contract.name()
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
            {{ name }}
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
            :stats="$n(tokenBalance, 'decimal').concat(` ${symbol}`)"
            title="Token Balance"
            icon="bx-circle-three-quarter"
          />
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            :stats="$n(tokenPrice, 'currency')"
            title="Token Price"
            icon="bx-euro"
          />
        </VCol>

        <VCol
          cols="12"
          md="3"
        >
          <CardStatisticsVertical
            :stats="$n(totalSupply, 'compact')"
            title="Total supply"
            icon="bx-transfer"
          />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
