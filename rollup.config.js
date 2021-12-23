import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'

// 可以直接使用 ESM
export default {
  // 库的入口文件
  input: './src/index.ts',
  // 打包完成后的输出
  output: [
    // CommonJS
    {
      format: 'cjs',
      file: pkg.main
    },
    // ESM
    {
      format: 'es',
      file: pkg.module
    }
  ],
  // 配置插件 @rollup/plugin-typescript
  plugins: [typescript()]
}
