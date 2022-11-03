import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Tables from '@/views/TablesView.vue'
import decode from 'jwt-decode';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const date = new Date().getTime() / 1000;
  const data = decode(token);
  if (!data) return;
  return date < data.exp;
}

const routes = [

  {
    meta: {
      title: 'Dashboard',
    },
    path: '/',
    name: 'Dashboard',
    component: Home
  },

    {
      meta: {
        title: 'Users'
      },
      path: '/users',
      name: 'Users',
      component: () => import('@/views/CRUD/Users/UsersView.vue'),
    },
    {
      meta: {
        title: 'New Users'
      },
      path: '/users/new',
      name: 'NewUsers',
      component: () => import('@/views/CRUD/Users/UsersNew.vue'),
    },
    {
      meta: {
        title: 'Edit Users'
      },
      path: '/users/:id/edit',
      name: 'EditUsers',
      component: () => import('@/views/CRUD/Users/UsersEdit.vue'),
    },

    {
      meta: {
        title: 'Products'
      },
      path: '/products',
      name: 'Products',
      component: () => import('@/views/CRUD/Products/ProductsView.vue'),
    },
    {
      meta: {
        title: 'New Products'
      },
      path: '/products/new',
      name: 'NewProducts',
      component: () => import('@/views/CRUD/Products/ProductsNew.vue'),
    },
    {
      meta: {
        title: 'Edit Products'
      },
      path: '/products/:id/edit',
      name: 'EditProducts',
      component: () => import('@/views/CRUD/Products/ProductsEdit.vue'),
    },

    {
      meta: {
        title: 'Categories'
      },
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CRUD/Categories/CategoriesView.vue'),
    },
    {
      meta: {
        title: 'New Categories'
      },
      path: '/categories/new',
      name: 'NewCategories',
      component: () => import('@/views/CRUD/Categories/CategoriesNew.vue'),
    },
    {
      meta: {
        title: 'Edit Categories'
      },
      path: '/categories/:id/edit',
      name: 'EditCategories',
      component: () => import('@/views/CRUD/Categories/CategoriesEdit.vue'),
    },

    {
      meta: {
        title: 'Orders'
      },
      path: '/orders',
      name: 'Orders',
      component: () => import('@/views/CRUD/Orders/OrdersView.vue'),
    },
    {
      meta: {
        title: 'New Orders'
      },
      path: '/orders/new',
      name: 'NewOrders',
      component: () => import('@/views/CRUD/Orders/OrdersNew.vue'),
    },
    {
      meta: {
        title: 'Edit Orders'
      },
      path: '/orders/:id/edit',
      name: 'EditOrders',
      component: () => import('@/views/CRUD/Orders/OrdersEdit.vue'),
    },

    {
      meta: {
        title: 'Reviews'
      },
      path: '/reviews',
      name: 'Reviews',
      component: () => import('@/views/CRUD/Reviews/ReviewsView.vue'),
    },
    {
      meta: {
        title: 'New Reviews'
      },
      path: '/reviews/new',
      name: 'NewReviews',
      component: () => import('@/views/CRUD/Reviews/ReviewsNew.vue'),
    },
    {
      meta: {
        title: 'Edit Reviews'
      },
      path: '/reviews/:id/edit',
      name: 'EditReviews',
      component: () => import('@/views/CRUD/Reviews/ReviewsEdit.vue'),
    },

    {
      meta: {
        title: 'Promo_codes'
      },
      path: '/promo_codes',
      name: 'Promo_codes',
      component: () => import('@/views/CRUD/Promo_codes/Promo_codesView.vue'),
    },
    {
      meta: {
        title: 'New Promo_codes'
      },
      path: '/promo_codes/new',
      name: 'NewPromo_codes',
      component: () => import('@/views/CRUD/Promo_codes/Promo_codesNew.vue'),
    },
    {
      meta: {
        title: 'Edit Promo_codes'
      },
      path: '/promo_codes/:id/edit',
      name: 'EditPromo_codes',
      component: () => import('@/views/CRUD/Promo_codes/Promo_codesEdit.vue'),
    },

  {
    meta: {
      title: 'Change Password'
    },
    path: '/change_password',
    name: 'Change Password',
    component: () => import('@/views/ChangePasswordView.vue'),
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
    {
      meta: {
        title: 'Register',
        fullScreen: true
      },
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      meta: {
        title: 'Verify',
        fullScreen: true
      },
      path: '/verify-email',
      name: 'Verify',
      component: () => import('@/views/VerifyEmailView.vue')
    },
    {
      meta: {
        title: 'Forgot',
        fullScreen: true
      },
      path: '/forgot',
      name: 'Forgot',
      component: () => import('@/views/ForgotPasswordView.vue')
    },
    {
      meta: {
        title: 'Reset',
        fullScreen: true
      },
      path: '/password-reset',
      name: 'Reset',
      component: () => import('@/views/ResetPasswordView.vue')
    },
  {
    meta: {
      title: 'Error',
      fullScreen: true
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  },
    {
      meta: {
        title: 'Starter',
        fullScreen: true
      },
      path: '/starter',
      name: 'Starter',
      component: () => import('@/views/StarterView.vue')
    },
    {
        meta: {
          title: 'Profile',
        },
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue')
      }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from) => {
  if (
    !isAuthenticated() && !['Login', 'Register', 'Verify', 'Reset', 'Forgot', 'Starter'].includes(to.name)
  ) {
    return { name: 'Starter' }
  }
})

export default router
