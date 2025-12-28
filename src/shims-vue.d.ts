declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue 3 exports
declare module 'vue' {
  export * from 'vue'
  export { ref, computed, onMounted, reactive, watch, watchEffect, nextTick, createApp } from 'vue'
}
