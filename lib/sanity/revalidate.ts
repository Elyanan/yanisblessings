import { revalidatePath, revalidateTag } from 'next/cache'

/** Bust cached menu data on the storefront and admin after CMS mutations. */
export function revalidateMenuContent() {
  revalidateTag('menu-items', 'max')
  revalidateTag('categories', 'max')
  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin/menu')
  revalidatePath('/admin/categories')
}

/** Bust cached website images on the storefront after admin edits. */
export function revalidateWebsiteImages() {
  revalidateTag('website-images', 'max')
  revalidatePath('/', 'layout')
  revalidatePath('/about', 'layout')
  revalidatePath('/custom-orders', 'layout')
  revalidatePath('/admin/website-images')
}
