export {}
declare global {
  interface Window {
    $message: ReturnType<typeof import('naive-ui')['useMessage']>
  }
}
