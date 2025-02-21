import { readonly, ref } from 'vue'

const error = ref<Error | null>(null)

export const errorCurrent = readonly(error)
export function setError(errorObject: Error | null) {
  error.value = errorObject
}
