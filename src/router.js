import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/password' },
    { path: '/password', name: 'password', component: () => import('./views/PasswordGenerator.vue') },
    { path: '/hash', name: 'hash', component: () => import('./views/HashGenerator.vue') },
    { path: '/url', name: 'url', component: () => import('./views/UrlEncoder.vue') },
    { path: '/json', name: 'json', component: () => import('./views/JsonFormatter.vue') },
    { path: '/timestamp', name: 'timestamp', component: () => import('./views/TimestampConverter.vue') },
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
