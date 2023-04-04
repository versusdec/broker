import {domain} from "../api/config";

export const setToken = (token) => {
  document.cookie = `__token=${token};domain=${domain};expires=${token.exp}; path=/`
}