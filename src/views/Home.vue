<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="h-15 flex items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-lg font-bold text-blue-600 m-0">ResumeBuilder Pro</h1>
            <span class="text-sm text-gray-600 ml-2">专业简历生成器</span>
          </div>
          <nav>
            <el-button type="primary" @click="goToTemplates">开始制作</el-button>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1">
      <!-- 英雄区域 -->
      <section class="py-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
        <div class="container mx-auto px-4">
          <div class="relative z-2 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl lg:text-5xl font-bold leading-tight mb-6">制作专业简历，开启职业新篇章</h2>
              <p class="text-lg leading-relaxed mb-8 opacity-90">
                使用我们的专业简历生成器，轻松创建精美的简历。
                多种模板选择，实时预览，一键导出PDF，让您的简历脱颖而出。
              </p>
              <div class="flex flex-wrap gap-4 mb-8">
                <el-button type="primary" size="large" @click="goToTemplates">
                  <el-icon><Document /></el-icon>
                  立即开始
                </el-button>
                <el-button size="large" @click="scrollToFeatures">
                  <el-icon><InfoFilled /></el-icon>
                  了解更多
                </el-button>
              </div>
              
              <!-- 统计数据 -->
              <div class="flex flex-col sm:flex-row gap-8">
                <div class="text-center">
                  <span class="block text-xl font-bold mb-1">5+</span>
                  <span class="text-sm opacity-80">精美模板</span>
                </div>
                <div class="text-center">
                  <span class="block text-xl font-bold mb-1">100%</span>
                  <span class="text-sm opacity-80">免费使用</span>
                </div>
                <div class="text-center">
                  <span class="block text-xl font-bold mb-1">PDF</span>
                  <span class="text-sm opacity-80">一键导出</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-center items-center">
              <div class="w-75 h-100 bg-white rounded-lg p-6 shadow-2xl transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div class="h-full">
                  <div class="h-15 bg-blue-600 rounded mb-4"></div>
                  <div class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特色区域 -->
      <section class="py-12 bg-gray-50" ref="featuresSection">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">为什么选择 ResumeBuilder Pro？</h3>
            <p class="text-lg text-gray-600">我们提供最专业、最便捷的简历制作体验</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="text-center p-8 bg-white rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300" v-for="feature in features" :key="feature.id">
              <div class="w-15 h-15 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                <component :is="feature.icon" />
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">{{ feature.title }}</h4>
              <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 模板预览区域 -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">精美模板，任您选择</h3>
            <p class="text-lg text-gray-600">多种风格模板，适合不同行业和职位</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div 
              class="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group" 
              v-for="template in displayTemplates" 
              :key="template.id"
              @click="selectTemplate(template.id)"
            >
              <div class="relative h-50 overflow-hidden">
                <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <!-- 模板预览占位图 -->
                  <div class="text-5xl text-gray-400">
                    <el-icon><Document /></el-icon>
                  </div>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <el-button type="primary">选择模板</el-button>
                </div>
              </div>
              <div class="p-6">
                <h5 class="text-lg font-medium text-gray-900 mb-2">{{ template.name }}</h5>
                <p class="text-sm text-gray-600">{{ template.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <el-button type="primary" @click="goToTemplates">查看全部模板</el-button>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="py-12 bg-blue-600 text-white text-center">
        <div class="container mx-auto px-4">
          <div>
            <h3 class="text-2xl lg:text-3xl font-bold mb-4">准备好制作您的专业简历了吗？</h3>
            <p class="text-lg mb-8 opacity-90">立即开始，只需几分钟即可完成</p>
            <el-button type="primary" size="large" @click="goToTemplates">
              <el-icon><Edit /></el-icon>
              开始制作简历
            </el-button>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-center md:text-left">
            <h4 class="text-lg font-semibold mb-2">ResumeBuilder Pro</h4>
            <p class="text-gray-400 text-sm">专业的简历生成器，助您职业发展</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-500 text-sm">&copy; 2024 ResumeBuilder Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import {
  Document,
  InfoFilled,
  Edit,
  Star,
  Download,
  Setting,
  View,
  Tools,
  Timer
} from '@element-plus/icons-vue'

const router = useRouter()
const resumeStore = useResumeStore()
const featuresSection = ref(null)

// 功能特色数据
const features = ref([
  {
    id: 1,
    icon: markRaw(Star),
    title: '专业模板',
    description: '精心设计的多种简历模板，适合不同行业和职位需求'
  },
  {
    id: 2,
    icon: markRaw(Tools),
    title: '实时预览',
    description: '所见即所得的编辑体验，实时查看简历效果'
  },
  {
    id: 3,
    icon: markRaw(Download),
    title: 'PDF导出',
    description: '一键导出高质量PDF文件，支持打印和在线分享'
  },
  {
    id: 4,
    icon: markRaw(Setting),
    title: '自定义编辑',
    description: '灵活的编辑功能，支持拖拽排序和个性化定制'
  },
  {
    id: 5,
    icon: markRaw(View),
    title: '响应式设计',
    description: '完美适配各种设备，手机、平板、电脑都能正常使用'
  },
  {
    id: 6,
    icon: markRaw(Timer),
    title: '快速制作',
    description: '简单易用的界面设计，几分钟即可完成专业简历'
  }
])

// 显示的模板（前4个）
const displayTemplates = computed(() => {
  return resumeStore.templates.slice(0, 4)
})

// 方法
const goToTemplates = () => {
  router.push('/templates')
}

const scrollToFeatures = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const selectTemplate = (templateId) => {
  resumeStore.selectTemplate(templateId)
  router.push(`/editor/${templateId}`)
}
</script>

