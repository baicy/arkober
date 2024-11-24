import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [],
  rules: [
    [/^w([.\d]+)$/, ([, num]) => ({ width: `${num}px`, 'min-width': `${num}px` })],
    [/^h([.\d]+)$/, ([, num]) => ({ height: `${num}px` })],
    [/^b([.\d]+)$/, ([, num]) => ({ border: `solid ${num}px` })],
    [
      /^sq([.\d]+)$/,
      ([, num]) => ({
        width: `${num}px`,
        'min-width': `${num}px`,
        height: `${num}px`,
        'text-align': 'center',
        'line-height': `${num}px`
      })
    ]
  ]
})
