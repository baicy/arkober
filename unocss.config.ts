import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [],
  rules: [
    [/^w([.\d]+)$/, ([, num]) => ({ width: `${num}px` })],
    [/^h([.\d]+)$/, ([, num]) => ({ height: `${num}px` })],
    [/^b([.\d]+)$/, ([, num]) => ({ border: `solid ${num}px` })]
  ]
})
