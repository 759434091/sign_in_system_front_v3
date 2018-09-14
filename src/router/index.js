import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Logout from '@/pages/Logout'
import Setting from '@/pages/Setting'
import Index from '@/pages/Index'
import Student from '@/pages/Student'
import Supervisor from '@/pages/Supervisor'
import Administrator from '@/pages/Administrator'
import Teacher from '@/pages/Teacher'
import CourseTable from '@/components/student/CourseTable'
import SuvCourses from '@/components/supervisor/SuvCourses'
import SuvPool from '@/components/supervisor/SuvPool'
import ApproveLeave from '@/components/supervisor/ApproveLeave'
import SuvTrans from '@/components/supervisor/SuvTrans'
import SuvManage from '@/components/administrator/SuvManage'
import SuvCozManage from '@/components/administrator/SuvCozManage'
import SignInManage from '@/components/administrator/SignInManage'
import CozManage from '@/components/administrator/CozManage'
import Statistics from '@/components/administrator/Statistics'
import Upload from '@/components/administrator/Upload'
import TchCourses from '@/components/teacher/TchCourses'
import HistorySignIn from '@/components/teacher/HistorySignIn'
import HistorySuv from '@/components/teacher/HistorySuv'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Root',
    redirect: '/index'
  }, {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [{
      path: 'setting',
      name: 'Setting',
      component: Setting
    }, {
      path: 'student',
      name: 'Student',
      component: Student,
      redirect: 'student/courseTable',
      children: [{
        path: 'courseTable',
        name: 'CourseTable',
        component: CourseTable
      }]
    }, {
      path: 'supervisor',
      name: 'Supervisor',
      component: Supervisor,
      redirect: 'supervisor/suvCourses',
      children: [{
        path: 'suvCourses',
        name: 'SuvCourses',
        component: SuvCourses
      }, {
        path: 'suvPool',
        name: 'SuvPool',
        component: SuvPool
      }, {
        path: 'approveLeave',
        name: 'ApproveLeave',
        component: ApproveLeave
      }, {
        path: 'suvTrans',
        name: 'SuvTrans',
        component: SuvTrans
      }]
    }, {
      path: 'teacher',
      name: 'Teacher',
      component: Teacher,
      children: [{
        path: 'tchCourses',
        name: 'TchCourses',
        component: TchCourses
      }, {
        path: 'historySignIn',
        name: 'HistorySignIn',
        component: HistorySignIn
      }, {
        path: 'historySuv',
        name: 'HistorySuv',
        component: HistorySuv
      }]
    }, {
      path: 'administrator',
      name: 'Administrator',
      component: Administrator,
      redirect: 'administrator/statistics',
      children: [{
        path: 'statistics',
        name: 'Statistics',
        component: Statistics
      }, {
        path: 'suvManage',
        name: 'SuvManage',
        component: SuvManage
      }, {
        path: 'suvCozManage',
        name: 'SuvCozManage',
        component: SuvCozManage
      }, {
        path: 'cozManage',
        name: 'CozManage',
        component: CozManage
      }, {
        path: 'upload',
        name: 'Upload',
        component: Upload
      }, {
        path: 'signInManage',
        name: 'SignInManage',
        component: SignInManage
      }]
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/logout',
    name: 'Logout',
    component: Logout
  }]
})
