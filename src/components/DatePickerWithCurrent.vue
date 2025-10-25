<template>
  <div class="date-picker-with-current">
    <!-- 触发器 -->
    <div 
      class="date-picker-trigger"
      @click="togglePicker"
    >
      <span class="date-text">{{ displayText }}</span>
      <el-icon class="arrow-icon" :class="{ 'is-reverse': showPicker }">
        <ArrowDown />
      </el-icon>
    </div>

    <!-- 日期选择面板 -->
    <div v-if="showPicker" class="date-picker-panel">
      <div class="panel-header">
        <el-icon class="nav-arrow" @click="prevYear">
          <ArrowLeft />
        </el-icon>
        <span class="year-text">{{ currentYear }}年</span>
        <el-icon class="nav-arrow" @click="nextYear">
          <ArrowRight />
        </el-icon>
      </div>

      <div class="months-grid">
        <div
          v-for="month in months"
          :key="month.value"
          class="month-item"
          :class="{ 'is-selected': isSelectedMonth(month.value) }"
          @click="selectMonth(month.value)"
        >
          {{ month.label }}
        </div>
      </div>

      <div v-if="showCurrent" class="panel-footer">
        <div 
          class="current-option"
          :class="{ 'is-selected': isCurrent }"
          @click="toggleCurrent"
        >
          至今
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="showPicker" class="picker-overlay" @click="closePicker"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowDown, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '选择日期'
  },
  current: {
    type: Boolean,
    default: false
  },
  showCurrent: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:current'])

const showPicker = ref(false)
const currentYear = ref(new Date().getFullYear())

const months = [
  { value: 1, label: '一月' },
  { value: 2, label: '二月' },
  { value: 3, label: '三月' },
  { value: 4, label: '四月' },
  { value: 5, label: '五月' },
  { value: 6, label: '六月' },
  { value: 7, label: '七月' },
  { value: 8, label: '八月' },
  { value: 9, label: '九月' },
  { value: 10, label: '十月' },
  { value: 11, label: '十一月' },
  { value: 12, label: '十二月' }
]

const isCurrent = computed(() => props.current)

const displayText = computed(() => {
  if (props.current) {
    return '至今'
  }
  if (props.modelValue) {
    const [year, month] = props.modelValue.split('-')
    return `${year}年${String(month).padStart(2, '0')}月`
  }
  return props.placeholder
})

const selectedYear = computed(() => {
  if (props.modelValue) {
    return parseInt(props.modelValue.split('-')[0])
  }
  return null
})

const selectedMonth = computed(() => {
  if (props.modelValue) {
    return parseInt(props.modelValue.split('-')[1])
  }
  return null
})

const isSelectedMonth = (month) => {
  return selectedYear.value === currentYear.value && selectedMonth.value === month
}

const togglePicker = () => {
  showPicker.value = !showPicker.value
  if (showPicker.value && props.modelValue) {
    currentYear.value = selectedYear.value
  }
}

const closePicker = () => {
  showPicker.value = false
}

const prevYear = () => {
  currentYear.value--
}

const nextYear = () => {
  currentYear.value++
}

const selectMonth = (month) => {
  const value = `${currentYear.value}-${String(month).padStart(2, '0')}`
  emit('update:modelValue', value)
  emit('update:current', false)
  showPicker.value = false
}

const toggleCurrent = () => {
  const newCurrentValue = !props.current
  emit('update:current', newCurrentValue)
  if (newCurrentValue) {
    emit('update:modelValue', '')
  }
  showPicker.value = false
}

// 点击外部关闭面板
const handleClickOutside = (event) => {
  if (!event.target.closest('.date-picker-with-current')) {
    showPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.date-picker-with-current {
  position: relative;
  width: 100%;
}

.date-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 32px;
  box-sizing: border-box;
}

.date-picker-trigger:hover {
  border-color: #c0c4cc;
}

.date-picker-trigger.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
}

.date-text {
  font-size: 14px;
  color: #606266;
  flex: 1;
}

.date-picker-trigger.is-disabled .date-text {
  color: #c0c4cc;
}

.arrow-icon {
  font-size: 14px;
  color: #c0c4cc;
  transition: transform 0.3s;
}

.arrow-icon.is-reverse {
  transform: rotate(180deg);
}

.date-picker-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 2000;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 8px;
  color: #334155;
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.nav-arrow {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #64748b;
}

.nav-arrow:hover {
  background-color: #f1f5f9;
  color: #334155;
  transform: scale(1.1);
}

.year-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.month-item {
  padding: 14px 8px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.month-item:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.month-item.is-selected {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.panel-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 16px;
}

.current-option {
  text-align: center;
  padding: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #475569;
}

.current-option:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.current-option.is-selected {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
}
</style>