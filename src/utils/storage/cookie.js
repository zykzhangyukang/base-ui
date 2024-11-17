import Cookies from 'js-cookie'

const accessToken = 'ACCESS_TOKEN'
const refreshToken = 'REFRESH_TOKEN'
const expiresIn = 'EXPIRES_IN'

export function getAccessToken() {
    return Cookies.get(accessToken)
}

export function setAccessToken(token) {
    return Cookies.set(accessToken, token, {expires: 30})
}

export function removeAccessToken() {
    return Cookies.remove(accessToken)
}

export function getRefreshToken() {
    return Cookies.get(refreshToken)
}

export function setRefreshToken(token) {
    return Cookies.set(refreshToken, token, {expires: 30})
}

export function removeRefreshToken() {
    return Cookies.remove(refreshToken)
}

export function setExpiresIn(seconds) {
    return Cookies.set(expiresIn, seconds, {expires: 30})
}

export function removeExpiresIn() {
    return Cookies.remove(expiresIn)
}

export function getExpiresIn() {
    return Cookies.get(expiresIn)
}

