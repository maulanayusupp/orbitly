import type { Product, ProductDraft, ProductStatus, ProductType } from '~/types'
import { productFromDraft, publishBlockers, uniqueSlug } from '~/services/commerce.service'
import { conversionRate } from '~/services/analytics.service'
import { PRODUCT_TYPES } from '~/config/products.config'

export function useProducts() {
  const { store } = useWorkspace()
  const products = computed(() => store.snapshot?.products ?? [])
  const published = computed(() => products.value.filter(p => p.status === 'published'))

  function byId(id: string) {
    return products.value.find(p => p.id === id)
  }

  function bySlug(slug: string) {
    return products.value.find(p => p.slug === slug)
  }

  function create(draft: ProductDraft, extras: Partial<Product> = {}): Product {
    const product = productFromDraft(draft, store.data.workspace, extras)
    product.slug = uniqueSlug(product.slug, products.value)
    store.addProduct(product)
    return product
  }

  function setStatus(id: string, status: ProductStatus) {
    store.setProductStatus(id, status)
  }

  return {
    products,
    published,
    byId,
    bySlug,
    create,
    setStatus,
    update: store.updateProduct,
    remove: store.removeProduct,
    recordView: store.recordView,
    blockers: publishBlockers,
    conversion: conversionRate,
    typeMeta: (type: ProductType) => PRODUCT_TYPES.find(t => t.id === type)!,
    types: PRODUCT_TYPES,
  }
}
