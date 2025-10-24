<template>
  <div class="editor-page">
    <div class="editor-header">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1>简历编辑器</h1>
            <p>当前模板: {{ currentTemplate?.name || '未选择' }}</p>
          </div>
          <div class="header-actions">
            <el-button @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <el-button type="primary">
              <el-icon><Download /></el-icon>
              导出PDF
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-content">
      <div class="container">
        <div class="editor-layout">
          <!-- 编辑区域 -->
          <div class="edit-panel">
            <div class="panel-header">
              <h3>编辑简历内容</h3>
            </div>
            
            <div class="form-section">
              <h4>个人信息</h4>
              <el-form :model="resumeData.personalInfo" label-width="80px">
                <el-form-item label="姓名">
                  <el-input v-model="resumeData.personalInfo.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="职位">
                  <el-input v-model="resumeData.personalInfo.title" placeholder="请输入目标职位" />
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="resumeData.personalInfo.phone" placeholder="请输入电话号码" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="resumeData.personalInfo.email" placeholder="请输入邮箱地址" />
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="resumeData.personalInfo.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="简介">
                  <el-input 
                    type="textarea" 
                    v-model="resumeData.personalInfo.summary" 
                    placeholder="请输入个人简介"
                    :rows="4"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!-- 预览区域 -->
          <div class="preview-panel">
            <div class="panel-header">
              <h3>实时预览</h3>
            </div>
            
            <div class="resume-preview">
              <div class="resume-container">
                <div class="resume-header">
                  <h2>{{ resumeData.personalInfo.name || '姓名' }}</h2>
                  <p class="title">{{ resumeData.personalInfo.title || '职位' }}</p>
                </div>
                
                <div class="resume-contact">
                  <div class="contact-item" v-if="resumeData.personalInfo.phone">
                    <span>电话: {{ resumeData.personalInfo.phone }}</span>
                  </div>
                  <div class="contact-item" v-if="resumeData.personalInfo.email">
                    <span>邮箱: {{ resumeData.personalInfo.email }}</span>
                  </div>
                  <div class="contact-item" v-if="resumeData.personalInfo.address">
                    <span>地址: {{ resumeData.personalInfo.address }}</span>
                  </div>
                </div>
                
                <div class="resume-summary" v-if="resumeData.personalInfo.summary">
                  <h3>个人简介</h3>
                  <p>{{ resumeData.personalInfo.summary }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { ArrowLeft, Download } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const resumeStore = useResumeStore()

// 计算属性
const currentTemplate = computed(() => resumeStore.currentTemplate)
const resumeData = computed(() => resumeStore.resumeData)

// 方法
const goBack = () => {
  router.go(-1)
}

// 监听数据变化，自动保存
watch(
  () => resumeStore.resumeData,
  () => {
    resumeStore.saveToLocalStorage()
  },
  { deep: true }
)

// 初始化
const templateId = route.params.templateId
if (templateId && templateId !== resumeStore.selectedTemplateId) {
  resumeStore.selectTemplate(templateId)
}
resumeStore.loadFromLocalStorage()
</script>

