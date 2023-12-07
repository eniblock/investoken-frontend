import type { EniblockConfig } from '@eniblock/sdk'
import { Eniblock } from '@eniblock/sdk'
import type { App } from 'vue'

export const ENIBLOCK_TOKEN = '$eniblock'
export const ENIBLOCK_INJECTION_KEY: InjectionKey<Eniblock>
  = Symbol(ENIBLOCK_TOKEN)

export function useEniblock() {
  return inject(ENIBLOCK_INJECTION_KEY)
}

export default {
  install: async (app: App, options: EniblockConfig) => {
    const sdk = new Eniblock(options)

    app.provide(ENIBLOCK_INJECTION_KEY, sdk)
  },
}
