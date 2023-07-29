import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import jobField from 'pages/management/job-field-management/reducers/reducers'
import job from 'pages/job/reducers/reducers'
import companyManagement from 'pages/management/company-management/reducers/reducers'
import cv from 'pages/cv/reducers/reducers'
import recruitment from 'pages/recruitment/reducers/reducers'
import company from 'pages/company/reducers.js/reducer'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    jobField,
    job,
    companyManagement,
    company,
    recruitment,
    cv,
  })
