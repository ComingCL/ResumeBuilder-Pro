import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        // 可以添加图标集合，如果需要的话
      }
    })
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#409EFF',
        light: '#79BBFF',
        lighter: '#A0CFFF',
        dark: '#337ECC'
      },
      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
      text: {
        primary: '#303133',
        regular: '#606266',
        secondary: '#909399',
        placeholder: '#A8ABB2'
      },
      border: {
        DEFAULT: '#DCDFE6',
        light: '#E4E7ED',
        lighter: '#EBEEF5',
        extra: '#F2F6FC'
      },
      fill: {
        DEFAULT: '#F0F2F5',
        light: '#F5F7FA',
        lighter: '#FAFAFA'
      }
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px',
      '5xl': '32px'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px'
    },
    borderRadius: {
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px'
    },
    boxShadow: {
      base: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
      light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      dark: '0 4px 16px rgba(0, 0, 0, 0.12)'
    }
  },
  shortcuts: {
    // 自定义快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'text-ellipsis': 'truncate',
    'btn-primary': 'bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors',
    'card': 'bg-white rounded-lg shadow-base p-6'
  },
  rules: [
    // 自定义规则
  ]
})