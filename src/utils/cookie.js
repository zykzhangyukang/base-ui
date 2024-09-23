import Cookies from 'js-cookie'

const accessToken = 'ACCESS_TOKEN'
const refreshToken = 'REFRESH_TOKEN'

export function getAccessToken() {
  return Cookies.get(accessToken)
}

export function setAccessToken(token) {
  return Cookies.set(accessToken, token)
}

export function removeAccessToken() {
  return Cookies.remove(accessToken)
}

export function getRefreshToken() {
  return Cookies.get(refreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshToken, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshToken)
}

