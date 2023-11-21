export function useLoading(defaultValue = false) {
  const loading = ref(defaultValue)
  async function withLoading(func: () => void | Promise<void>) {
    loading.value = true
    try {
      await func()
    }
    finally {
      loading.value = false
    }
  }
  return {
    loading,
    withLoading,
  } as const
}
