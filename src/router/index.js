import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页 - ResumeBuilder Pro'
    }
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('@/views/Templates.vue'),
    meta: {
      title: '模板选择 - ResumeBuilder Pro'
    }
  },
  {
    path: '/editor/:templateId?',
    name: 'Editor',
    component: () => import('@/views/Editor.vue'),
    meta: {
      title: '简历编辑器 - ResumeBuilder Pro'
    }
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/Preview.vue'),
    meta: {
      title: '简历预览 - ResumeBuilder Pro'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到 - ResumeBuilder Pro'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router