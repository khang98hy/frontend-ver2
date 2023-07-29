import { BASE_URL_SERVER } from '../constants'

/* eslint-disable no-unused-vars */
export default function formatUrlImage(url) {
  if (url) {
    return BASE_URL_SERVER + url
  }
  return ''
}
