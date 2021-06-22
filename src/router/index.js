import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login';
import Home from '@/views/Home';
import System from '@/views/system';
import Error404 from '@/views/404.vue';

const query = () => import('../views/component/queryDrug.vue');
const uphold = () => import('../views/component/uphold.vue');
const queryXh = () => import('../views/component/queryXh.vue');

Vue.use(Router);
const routes = [
    {
        path: '/',
        name: 'login',
        hidden: true,
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        hidden: true,
        meta:{
            title:"业务系统"
        },
        component: Home
    },
    {
        path: '/system',
        name: 'system',
        hidden: true,
        meta:{
            title:"影响驾驶能力药物查询系统"
        },
        component: System,
        children:[
            {
                path: '/system/query',
                name: 'query',
                hidden: true,
                component: query
            },
            {
                path: '/system/uphold',
                name: 'uphold',
                hidden: true,
                component: uphold
            },
            {
                path: '/system/queryXh',
                name: 'uphold',
                hidden: true,
                component: queryXh
            }
        ]
    },
    {
        path: '/error404',
        name: 'error404',
        meta: {
            title: '404-页面不存在'
        },
        component: Error404
    },
];


export default new Router({
    mode: 'history',
    routes: routes,
})
