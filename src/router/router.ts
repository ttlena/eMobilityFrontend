import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import EditorView from "../views/EditorView.vue"
import Game from "../views/Game.vue"
import HomepageView from "../views/HomepageView.vue"
import LoginView from "../views/LoginView.vue"
import CreateLobbyView from "../views/CreateLobbyView.vue"

const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: HomepageView
        },
        {
            path: '/login',
            component: LoginView
        },
        {
            path: '/create',
            component: CreateLobbyView
        },
        {
            path: '/game/:gameId',
            component: Game,
            name: 'Game'
        },
        {
            path: '/edit/:gameId',
            component: EditorView,
            name: 'Edit'
        }
    ]
})

export default router