/// <reference types="vite/client" />
declare module '*.vue' {
  import { App, defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void
  }
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}
