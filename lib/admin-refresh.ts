import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/** Revalidate server-rendered admin data after mutations. */
export function refreshAdminData(router: AppRouterInstance) {
  router.refresh()
}
