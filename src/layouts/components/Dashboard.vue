<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import { ethers } from 'ethers'
import { useRoute } from 'vue-router'
import investoken from '@images/svg/investoken.svg'
import { useEniblock } from '@/plugins/eniblock'
import ERC20 from '@/assets/abi/ERC20.json'

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

const sdk = useEniblock()
const { getAccessTokenSilently, user } = useAuth0()

if (sdk) {
  const accessToken = await getAccessTokenSilently()
  let walletAddress

  if (user.value) {
    const metadata = user.value[import.meta.env.VITE_AUTH0_CLAIM_METADATA]

    if (metadata.wallet) {
      walletAddress = metadata.wallet
    }
    else {
      const wallet = await sdk.wallet.instantiate()
      const account = await wallet.account.instantiate(import.meta.env.VITE_ENIBLOCK_ACCOUNT)

      walletAddress = await account.getAddress()

      axios.patch('/.netlify/functions/wallets',
        {
          wallet: walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
    }
  }

  const provider = new ethers.providers.JsonRpcBatchProvider((await sdk.getProvider()).connection)
  const contract = new ethers.Contract(contractAddress, ERC20, provider)

  const promises = []

  promises.push(contract.totalSupply())
  promises.push(contract.decimals())
  promises.push(contract.symbol())
  promises.push(contract.name())
  promises.push(contract.balanceOf(walletAddress))

  const result = await Promise.all(promises)

  totalSupply = Number(ethers.utils.formatUnits(result[0], result[1]))
  symbol = result[2]
  name = result[3]
  tokenBalance = Number(ethers.utils.formatUnits(result[4], result[1]))
  amount = tokenBalance * tokenPrice
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
