<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">选择简历模板</h1>
            <p class="text-lg text-gray-600">选择一个适合您的专业模板，开始制作简历</p>
          </div>
          
          <div class="flex-shrink-0">
            <el-button @click="goHome">
              <el-icon><ArrowLeft /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row gap-4 py-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">分类筛选：</label>
            <el-select v-model="selectedCategory" placeholder="选择分类" @change="filterTemplates" class="w-40">
              <el-option label="全部" value="all" />
              <el-option label="商务" value="business" />
              <el-option label="创意" value="creative" />
              <el-option label="技术" value="technical" />
              <el-option label="教育" value="education" />
              <el-option label="国际" value="international" />
            </el-select>
          </div>
          
          <div class="flex items-center gap-2 flex-1">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">搜索：</label>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索模板名称"
              @input="filterTemplates"
              clearable
              class="max-w-xs"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板网格 -->
    <div class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredTemplates.length === 0" class="flex flex-col items-center justify-center py-16">
          <div class="text-6xl text-gray-400 mb-4">
            <el-icon><DocumentRemove /></el-icon>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的模板</h3>
          <p class="text-gray-600">请尝试调整筛选条件或搜索关键词</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
            v-for="template in filteredTemplates"
            :key="template.id"
            :class="{ 'ring-2 ring-blue-500 border-blue-500': selectedTemplateId === template.id }"
            @click="selectTemplate(template.id)"
          >
            <div class="relative">
              <div class="aspect-[3/4] bg-gray-50 rounded-t-lg overflow-hidden relative">
                <!-- 模板预览图 -->
                <div class="flex items-center justify-center h-full text-4xl text-gray-400">
                  <component :is="getTemplateIcon(template.category)" />
                </div>
                
                <!-- 选中标识 -->
                <div v-if="selectedTemplateId === template.id" class="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  <el-icon><Check /></el-icon>
                </div>
                
                <!-- 悬停遮罩 -->
                <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div class="flex flex-col gap-2">
                    <el-button type="primary" size="large">
                      <el-icon><View /></el-icon>
                      预览模板
                    </el-button>
                    <el-button size="large">
                      <el-icon><Edit /></el-icon>
                      使用模板
                    </el-button>
                  </div>
                </div>
              </div>
              
              <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-semibold text-gray-900 text-lg truncate flex-1 mr-2">{{ template.name }}</h3>
                  <el-tag :type="getCategoryType(template.category)" size="small">
                    {{ getCategoryName(template.category) }}
                  </el-tag>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ template.description }}</p>
                
                <div class="flex flex-col gap-2">
                  <el-button
                    type="primary"
                    @click.stop="useTemplate(template.id)"
                    :loading="loadingTemplateId === template.id"
                    class="w-full"
                  >
                    <el-icon><Edit /></el-icon>
                    使用此模板
                  </el-button>
                  
                  <el-button @click.stop="previewTemplate(template.id)" class="w-full">
                    <el-icon><View /></el-icon>
                    预览
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="模板预览"
      width="80%"
      :before-close="closePreviewDialog"
    >
      <div class="p-6">
        <div class="bg-gray-50 rounded-lg p-8 min-h-96">
          <!-- 这里将来放置模板预览组件 -->
          <div class="flex flex-col items-center justify-center h-full text-gray-500">
            <div class="text-6xl mb-4">
              <el-icon><Document /></el-icon>
            </div>
            <p class="text-lg">{{ currentPreviewTemplate?.name }} 模板预览</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2 p-4">
          <el-button @click="closePreviewDialog">取消</el-button>
          <el-button type="primary" @click="useCurrentPreviewTemplate">
            <el-icon><Edit /></el-icon>
            使用此模板
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Search,
  DocumentRemove,
  Check,
  View,
  Edit,
  Document,
  Briefcase,
  Star,
  Monitor,
  School,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const resumeStore = useResumeStore()

// 响应式数据
const selectedCategory = ref('all')
const searchKeyword = ref('')
const selectedTemplateId = ref(resumeStore.selectedTemplateId)
const loadingTemplateId = ref(null)
const previewDialogVisible = ref(false)
const currentPreviewTemplate = ref(null)

// 计算属性
const filteredTemplates = computed(() => {
  let templates = resumeStore.templates

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    templates = templates.filter(template => template.category === selectedCategory.value)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    templates = templates.filter(template =>
      template.name.toLowerCase().includes(keyword) ||
      template.description.toLowerCase().includes(keyword)
    )
  }

  return templates
})

// 方法
const goHome = () => {
  router.push('/')
}

const filterTemplates = () => {
  // 筛选逻辑已在计算属性中实现
}

const selectTemplate = (templateId) => {
  selectedTemplateId.value = templateId
}

const useTemplate = async (templateId) => {
  try {
    loadingTemplateId.value = templateId
    
    // 选择模板
    resumeStore.selectTemplate(templateId)
    
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('模板选择成功！')
    
    // 跳转到编辑器
    router.push(`/editor/${templateId}`)
  } catch (error) {
    ElMessage.error('选择模板失败，请重试')
  } finally {
    loadingTemplateId.value = null
  }
}

const previewTemplate = (templateId) => {
  const template = resumeStore.templates.find(t => t.id === templateId)
  if (template) {
    currentPreviewTemplate.value = template
    previewDialogVisible.value = true
  }
}

const closePreviewDialog = () => {
  previewDialogVisible.value = false
  currentPreviewTemplate.value = null
}

const useCurrentPreviewTemplate = () => {
  if (currentPreviewTemplate.value) {
    useTemplate(currentPreviewTemplate.value.id)
    closePreviewDialog()
  }
}

const getTemplateIcon = (category) => {
  const iconMap = {
    business: Briefcase,
    creative: Star,
    technical: Monitor,
    education: School,
    international: Connection
  }
  return iconMap[category] || Document
}

const getCategoryName = (category) => {
  const nameMap = {
    business: '商务',
    creative: '创意',
    technical: '技术',
    education: '教育',
    international: '国际'
  }
  return nameMap[category] || '其他'
}

const getCategoryType = (category) => {
  const typeMap = {
    business: 'primary',
    creative: 'success',
    technical: 'info',
    education: 'warning',
    international: 'danger'
  }
  return typeMap[category] || ''
}

// 生命周期
onMounted(() => {
  // 从本地存储加载数据
  resumeStore.loadFromLocalStorage()
})
</script>

