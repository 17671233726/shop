import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter);

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/welcome/Welcome')
const User = () => import('views/user/User')
const Rights = () => import('views/power/Rights');
const Roles = () => import('views/power/Roles');

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: User
                },
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Roles
                }
            ]
        }
    ],
    mode: 'history',
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})

export default router