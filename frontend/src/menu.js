import {
  mdiDesktopMac,
  mdiSquareEditOutline,
  mdiTable,
  mdiLock,
  mdiFileDocumentOutline
} from '@mdi/js'

const externalLink = () => {
  return process.env.NODE_ENV === 'production' ? window.location.origin + '/api-docs' : 'http://localhost:8080/api-docs';
}

export default [
  'General',
  [
    {
      to: '/',
      label: 'Dashboard',
      icon: mdiDesktopMac
    }
  ],
  'Entities',
  [

  {
    to: '/users',
    label: 'Users',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Users/UsersView.vue'),
},

  {
    to: '/products',
    label: 'Products',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Products/ProductsView.vue'),
},

  {
    to: '/categories',
    label: 'Categories',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Categories/CategoriesView.vue'),
},

  {
    to: '/orders',
    label: 'Orders',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Orders/OrdersView.vue'),
},

  {
    to: '/reviews',
    label: 'Reviews',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Reviews/ReviewsView.vue'),
},

  {
    to: '/promo_codes',
    label: 'Promo codes',
    icon: mdiTable,
    component: () => import('@/views/CRUD/Promo_codes/Promo_codesView.vue'),
},

    {
      to: '/change_password',
      label: 'Change Password',
      icon: mdiLock,
      component: () => import('@/views/ChangePasswordView.vue'),
    },
    {
      href: externalLink(),
      label: 'API docs',
      icon: mdiFileDocumentOutline,
    },
  ],
]
