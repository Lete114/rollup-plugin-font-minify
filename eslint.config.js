import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'types',
  ],
  rules: {
    curly: ['error', 'multi-line', 'consistent'],
  },
})
