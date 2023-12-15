import type { RedirectLoginOptions } from '@auth0/auth0-spa-js'
import type { Auth0VueClient } from '@auth0/auth0-vue'
import type { App } from 'vue'
import { unref, watchEffect } from 'vue'
import type { RouteLocation } from 'vue-router'

export function watchEffectOnceAsync<T>(watcher: () => T) {
  return new Promise<void>(resolve => {
    watchEffectOnce(watcher, resolve)
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function watchEffectOnce<T>(watcher: () => T, fn: Function) {
  const stopWatch = watchEffect(() => {
    if (watcher()) {
      fn()
      stopWatch()
    }
  })
}

async function createRoleGuardHandler(
  client: Auth0VueClient,
  to: RouteLocation,
  redirectLoginOptions?: RedirectLoginOptions,
) {
  const fn = async () => {
    if (unref(client.isAuthenticated)) {
      const user = unref(client.user)
      if (user && user[import.meta.env.VITE_AUTH0_CLAIM_ROLES])
        return user[import.meta.env.VITE_AUTH0_CLAIM_ROLES][0] === import.meta.env.VITE_AUTH0_CLAIM_ROLES_ADMIN
    }

    await client.loginWithRedirect({
      appState: { target: to.fullPath },
      ...redirectLoginOptions,
    })

    return false
  }

  if (!unref(client.isLoading))
    return fn()

  await watchEffectOnceAsync(() => !unref(client.isLoading))

  return fn()
}

/**
 * The options used when creating an AuthGuard.
 */
export interface AuthGuardOptions {

  /**
   * The vue application
   */
  app?: App

  /**
   * Route specific options to use when being redirected to Auth0
   */
  redirectLoginOptions?: RedirectLoginOptions
}

/**
 *
 * @param [app] The vue application
 */
export function createAuthRoleGuard(
  app: App
): (to: RouteLocation) => Promise<boolean>

export function createAuthRoleGuard(
  appOrOptions: App,
): (to: RouteLocation) => Promise<boolean> {
  const { app, redirectLoginOptions } = {
    app: appOrOptions as App,
    redirectLoginOptions: undefined,
  }

  return async (to: RouteLocation) => {
    const auth0 = app.config.globalProperties.$auth0 as Auth0VueClient

    return createRoleGuardHandler(auth0, to, redirectLoginOptions)
  }
}
