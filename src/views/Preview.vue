<template>
  <div class="preview-page">
    <div class="preview-header no-print">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1>简历预览</h1>
            <p>预览您的简历效果</p>
          </div>
          <div class="header-actions">
            <el-button @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回编辑
            </el-button>
            <el-button type="primary" @click="exportToPDF">
              <el-icon><Download /></el-icon>
              导出PDF
            </el-button>
            <el-button @click="printResume">
              <el-icon><Printer /></el-icon>
              打印
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-content">
      <div class="resume-wrapper">
        <div class="resume-page" ref="resumeRef">
          <div class="resume-header">
            <h1>{{ resumeData.personalInfo.name || '姓名' }}</h1>
            <p class="title">{{ resumeData.personalInfo.title || '职位' }}</p>
          </div>
          
          <div class="resume-contact">
            <div class="contact-row">
              <span v-if="resumeData.personalInfo.phone">📞 {{ resumeData.personalInfo.phone }}</span>
              <span v-if="resumeData.personalInfo.email">✉️ {{ resumeData.personalInfo.email }}</span>
              <span v-if="resumeData.personalInfo.address">📍 {{ resumeData.personalInfo.address }}</span>
            </div>
          </div>
          
          <div class="resume-summary" v-if="resumeData.personalInfo.summary">
            <h2>个人简介</h2>
            <p>{{ resumeData.personalInfo.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download, Printer } from '@element-plus/icons-vue'

const router = useRouter()
const resumeStore = useResumeStore()
const resumeRef = ref(null)

// 计算属性
const resumeData = computed(() => resumeStore.resumeData)

// 方法
const goBack = () => {
  router.go(-1)
}

const exportToPDF = async () => {
  try {
    ElMessage.info('PDF导出功能开发中...')
    // TODO: 实现PDF导出功能
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  }
}

const printResume = () => {
  window.print()
}

// 生命周期
onMounted(() => {
  resumeStore.loadFromLocalStorage()
})
</script>

