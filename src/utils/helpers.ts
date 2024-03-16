export const setLocalStorageItem = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value))

export const getLocalStorageItem = (key: string) =>
  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : null

export const removeLocalStorageItem = (key: string) => localStorage.removeItem(key)
