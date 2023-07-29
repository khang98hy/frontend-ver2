/* eslint-disable no-unused-vars */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import * as jwt from 'services/jwt'
import AuthAPI from 'services/api/auth.api'
import actions from './actions'

const mapAuthProviders = {
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
    forgotPassword: jwt.forgotPassword,
    resetPassword: jwt.resetPassword,
  },
}

export function* FORGOT_PASSWORD({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select((state) => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].forgotPassword, payload)
  if (success) {
    notification.success({
      message:
        'Hệ thống đã gửi email xác nhận lấy lại mật khẩu đến email của bạn. Vui lòng kiểm tra email nhận được',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}
export function* CHANGE_PASSWORD({ payload }) {
  console.log('🚀 ~ file: sagas.js:43 ~ function*CHANGE_PASSWORD ~ payload', payload)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(AuthAPI.changePassword, payload)
  if (success) {
    notification.success({
      message: 'Đổi mật khẩu thành công',
    })
    yield put({
      type: 'user/LOGOUT',
    })
  } else {
    notification.error({
      message: 'Đổi mật khẩu không thành công',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}
export function* RESET_PASSWORD({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select((state) => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].resetPassword, payload)
  if (success) {
    notification.success({
      message: 'Đổi mật khẩu thành công',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
  yield history.push('/auth/login')
}

export function* LOGIN({ payload }) {
  const { username, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select((state) => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].login, username, password)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    if (history.location.state && history.location.state.previousPath) {
      yield history.push(history.location.state.previousPath)
    } else {
      yield history.push('/')
    }

    notification.success({
      message: 'Đăng nhập thành công',
    })
  }
  if (!success) {
    notification.error({
      message: 'Tài khoản hoặc mật khẩu chưa chính xác',
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select((state) => state.settings)
  const success = yield call(mapAuthProviders[authProvider].register, payload)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    yield history.push('/')
    notification.success({
      message: 'Đăng ký tài khoản thành công',
    })
  }
  if (!success) {
    notification.error({
      message: 'Đăng ký tài khoản không thành công',
    })

    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select((state) => state.settings)

  const response = yield call(mapAuthProviders[authProvider].currentAccount)

  if (response) {
    const { id, email, name, avatar, authorities, username, fullName, jobSeekerId } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id,
        name: fullName,
        email,
        avatar,
        username,
        role: authorities,
        authorized: true,
        jobSeekerId,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const { authProvider } = yield select((state) => state.settings)
  yield call(mapAuthProviders[authProvider].logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
  yield history.push('/auth/login')
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.FORGOT_PASSWORD, FORGOT_PASSWORD),
    takeEvery(actions.RESET_PASSWORD, RESET_PASSWORD),
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
