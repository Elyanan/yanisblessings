import { revalidatePath, revalidateTag } from 'next/cache'

/** Bust cached menu data on the storefront and admin after CMS mutations. */
export function revalidateMenuContent() {
  revalidateTag('menu-items', 'max')
  revalidateTag('categories', 'max')
  revalidatePath('/menu')
  revalidatePath('/admin/menu')
}
