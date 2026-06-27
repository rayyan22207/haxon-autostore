import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Home from '../pages/Home.vue'
import Products from '../pages/Products.vue'
import ProductDetails from '../pages/ProductDetails.vue'
import Cart from '../pages/Cart.vue'
import Checkout from '../pages/Checkout.vue'
import Contact from '../pages/Contact.vue'
import TrackOrder from '../pages/TrackOrder.vue'
import Brands from '../pages/Brands.vue'
import About from '../pages/About.vue'
import Catalogs from '../pages/Catalogs.vue'
import Cars from '../pages/Cars.vue'

import Login from '../pages/admin/Login.vue'
import Dashboard from '../pages/admin/Dashboard.vue'
import AddProduct from '../pages/admin/AddProduct.vue'
import Orders from '../pages/admin/Orders.vue'
import AdminProducts from '../pages/admin/Products.vue'
import EditProduct from '../pages/admin/EditProduct.vue'
import OrderDetails from '../pages/admin/OrderDetails.vue'
import Content from '../pages/admin/Content.vue'
import AdminAccessDenied from '../components/admin/AdminAccessDenied.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductDetails },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/contact', component: Contact },
  { path: '/track-order', component: TrackOrder },
  { path: '/brands', component: Brands },
  { path: '/catalogs', component: Catalogs },
  { path: '/cars', component: Cars },
  { path: '/about', component: About},
  { path: '/admin/login', component: Login },
  { path: '/admin/access-denied', component: AdminAccessDenied, meta: { requiresAuthOnly: true } },
  { path: '/admin/forbidden', component: AdminAccessDenied, props: { mode: 'permission' }, meta: { requiresAdmin: true } },
  { path: '/admin', component: Dashboard, meta: { requiresAdmin: true } },
  { path: '/admin/products/add', component: AddProduct, meta: { requiresAdmin: true, permission: 'manage_products' } },
  { path: '/admin/orders', component: Orders, meta: { requiresAdmin: true, permission: 'manage_orders' } },
  { path: '/admin/orders/:id', component: OrderDetails, meta: { requiresAdmin: true, permission: 'manage_orders' } },
  { path: '/admin/products', component: AdminProducts, meta: { requiresAdmin: true, permission: 'manage_products' } },
  { path: '/admin/products/edit/:id', component: EditProduct, meta: { requiresAdmin: true, permission: 'manage_products' } },
  { path: '/admin/content', component: Content, meta: { requiresAdmin: true, permission: 'manage_content' } },
  { path: '/admin/content/:section', component: Content, meta: { requiresAdmin: true, permission: 'manage_content' } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.waitUntilReady()
  if (to.meta.requiresAuthOnly && !authStore.isAuthenticated) return { path: '/admin/login' }
  if (to.meta.requiresAdmin && !authStore.isAuthenticated) return { path: '/admin/login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !authStore.isAdmin) return { path: '/admin/access-denied' }
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) return { path: '/admin/forbidden' }
  if (to.path === '/admin/login' && authStore.isAdmin) return '/admin'
  if (to.path === '/admin/login' && authStore.isAuthenticated && !authStore.isAdmin) return '/admin/access-denied'
})

export default router
