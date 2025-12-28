declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $currency: (value: number | null | undefined, currencyCode?: string, decimals?: number, locale?: string) => string
  }
}

// Vue 3 exports
declare module 'vue' {
  export * from '@vue/runtime-core'
  export { ref, computed, onMounted, reactive, watch, watchEffect, nextTick, createApp } from '@vue/runtime-core'
}
