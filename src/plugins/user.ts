import type { User } from '@auth0/auth0-vue'

export function hasRole(user: Ref<User | undefined>, role: string) {
  if (user && user.value)
    return ref(user.value[import.meta.env.VITE_AUTH0_CLAIM_ROLES].includes(role))

  return ref(false)
}
