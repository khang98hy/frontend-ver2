/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

import Auth from 'layouts/Auth'
import AuthAPI from 'services/api/auth.api'
import UserAPI from 'services/api/user.api'
import apiClient from 'services/axios'
import store from 'store'

export async function login(username, password) {
  const payload = {
    username,
    password,
  }

  return AuthAPI.login(payload)
    .then((response) => {
      if (response) {
        const { id_token } = response.data
        if (id_token) {
          store.set('accessToken', id_token)
        }
        return response.data
      }
      store.remove('accessToken')
      return false
    })
    .catch((error) => console.log(error))
}

export async function register(payload) {
  return AuthAPI.register(payload)
    .then((response) => {
      if (response) {
        return true
      }
      return false
    })
    .catch((error) => console.log(error))
}

export async function forgotPassword(payload) {
  return AuthAPI.forgotPassword(payload)
    .then((response) => {
      if (response) {
        return true
      }
      return false
    })
    .catch((error) => console.log(error))
}

export async function resetPassword(payload) {
  return AuthAPI.resetPassword(payload)
    .then((response) => {
      if (response) {
        return true
      }
      return false
    })
    .catch((error) => console.log(error))
}

export async function currentAccount() {
  if (store.get('accessToken')) {
    return UserAPI.getCurrentUserInfo()
      .then((response) => {
        if (response) {
          return response.data
        }
        store.remove('accessToken')
        return false
      })
      .catch((error) => console.log(error))
  }
  return false
}

export async function logout() {
  try {
    store.remove('accessToken')
    return true
  } catch (error) {
    return (err) => console.log(err)
  }
}
