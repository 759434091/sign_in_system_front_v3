import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/index',
            name: 'index',
            children: [
                {
                    path: 'student',
                    name: 'student',
                    redirect: 'student/courseTable',
                    children: [
                        {
                            path: 'courseTable',
                            name: 'courseTable',
                            component: () => import('./components/student/CourseTable.vue')
                        }
                    ],
                    component: () => import('./components/Student.vue')
                },
                {
                    path: 'administrator',
                    name: 'administrator',
                    children: [],
                    component: () => import('./components/Administrator.vue')
                },
                {
                    path: 'setting',
                    name: 'setting',
                    redirect: 'setting/passwordSetting',
                    children: [
                        {
                            path: 'passwordSetting',
                            name: 'passwordSetting',
                            component: () => import('./components/setting/PasswordSetting.vue')
                        },
                        {
                            path: 'roleSetting',
                            name: 'roleSetting',
                            component: () => import('./components/setting/RoleSetting.vue')
                        }],
                    component: () => import('./components/Setting.vue')
                }
            ],
            // route level
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/Index.vue'),
        }
    ]
})
