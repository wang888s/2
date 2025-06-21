import Vue from 'vue';
import Router from 'vue-router'
Vue.use(Router);

// 保存原来的push函数
const routerPush = Router.prototype.push
// 重写push函数
Router.prototype.push = function push(location) {

    // 这个语句用来解决报错
    // 调用原来的push函数，并捕获异常
    return routerPush.call(this, location).catch(error => error)
}
// 3. 路由实例配置
const router = new Router({
    mode: 'hash',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            // 离开页面时保存位置
            if (from.meta.keepAlive) {
                // console.log(document.body.scrollTop)
                from.meta.savedPosition = document.documentElement.scrollTop;
            }

            console.log('to.meta:',to.meta)
            return { x: 0, y: to.meta.savedPosition || 0 ,behavior: 'smooth'}
        }
    },
    routes: [
        {
            path: '/',
            redirect: '/home/detail'
        },
        {
            path: '/home',
            name: 'home',
            component: resolve => require(["@/views/home"], resolve),
            meta: {
                keepAlive: false,
                title: '重庆市生态产品数字化平台',
            }
        },
        {
            path: '/home/detail',
            name: 'home.detail',
            component: resolve => require(["@/views/home/detail"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/detail/county',
            name: 'home.detail.county',
            component: resolve => require(["@/views/county"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/detail/landTransfer',
            name: 'home.detail.landTransfer',
            component: resolve => require(["@/views/landTransfer"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/calculate',
            name: 'home.calculate',
            component: resolve => require(["@/views/calculate-home"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/calculate/detail',
            name: 'home.calculate.detail',
            component: resolve => require(["@/views/calculate"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/detail/adjust-service',
            name: 'home.detail.adjust-service',
            component: resolve => require(["@/views/adjust-service"], resolve),
            meta: {
                keepAlive: true,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/detail/material-supply',
            name: 'home.detail.material-supply',
            component: resolve => require(["@/views/material-supply"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
        {
            path: '/home/detail/culture-service',
            name: 'home.detail.culture-service',
            component: resolve => require(["@/views/culture-service"], resolve),
            meta: {
                keepAlive: false,
                title: '酉阳县生态产品价值实现平台',
            }
        },
    ]
})

// 游览器路径重复点击报错处理
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
