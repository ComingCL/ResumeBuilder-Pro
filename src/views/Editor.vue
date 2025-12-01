<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 保持与主页一致的头部 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="h-15 flex items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-lg font-bold text-blue-600 m-0">ResumeBuilder Pro</h1>
            <span class="text-sm text-gray-600 ml-2">简历编辑器</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600"
              >当前模板: {{ currentTemplate?.name || '技术专业' }}</span
            >
            <el-button @click="goBack" size="default">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <el-dropdown @command="handleExportCommand" trigger="click">
              <el-button type="primary" size="default">
                <el-icon><Download /></el-icon>
                导出
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="pdf">
                    <el-icon><Document /></el-icon>
                    导出PDF
                  </el-dropdown-item>
                  <el-dropdown-item command="json">
                    <el-icon><FolderOpened /></el-icon>
                    导出数据
                  </el-dropdown-item>
                  <el-dropdown-item command="all" divided>
                    <el-icon><Download /></el-icon>
                    批量导出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="importResumeData" size="default">
              <el-icon><Upload /></el-icon>
              导入数据
            </el-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主编辑区域 -->
    <div class="flex-1 flex h-0">
      <!-- 左侧编辑面板 -->
      <div class="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">编辑简历内容</h2>
              <p class="text-sm text-gray-600">填写您的个人信息，实时预览右侧效果</p>
            </div>

            <!-- 个人信息部分 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b-2 border-blue-500">
                <el-icon class="mr-2"><User /></el-icon>
                个人信息
              </h3>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="姓名" class="mb-0">
                    <el-input v-model="resumeData.personalInfo.name" placeholder="请输入您的姓名" />
                  </el-form-item>
                  <el-form-item label="职位" class="mb-0">
                    <el-input
                      v-model="resumeData.personalInfo.title"
                      placeholder="如：前端开发工程师"
                    />
                  </el-form-item>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="电话" class="mb-0">
                    <el-input v-model="resumeData.personalInfo.phone" placeholder="手机号码" />
                  </el-form-item>
                  <el-form-item label="邮箱" class="mb-0">
                    <el-input v-model="resumeData.personalInfo.email" placeholder="邮箱地址" />
                  </el-form-item>
                </div>
                <el-form-item label="地址" class="mb-0">
                  <el-input v-model="resumeData.personalInfo.address" placeholder="居住地址" />
                </el-form-item>
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="GitHub" class="mb-0">
                    <el-input
                      v-model="resumeData.personalInfo.github"
                      placeholder="GitHub 用户名或链接"
                    />
                  </el-form-item>
                  <el-form-item label="博客" class="mb-0">
                    <el-input v-model="resumeData.personalInfo.blog" placeholder="个人博客链接" />
                  </el-form-item>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="LinkedIn" class="mb-0">
                    <el-input
                      v-model="resumeData.personalInfo.linkedin"
                      placeholder="LinkedIn 链接"
                    />
                  </el-form-item>
                  <el-form-item label="个人网站" class="mb-0">
                    <el-input
                      v-model="resumeData.personalInfo.website"
                      placeholder="个人网站链接"
                    />
                  </el-form-item>
                </div>
                <div class="mb-2">
                  <label class="text-sm text-gray-600 mb-1 block">个人简介</label>
                  <v-md-editor
                    v-model="resumeData.personalInfo.summary"
                    height="200px"
                    mode="edit"
                    placeholder="## 关于我&#10;我是一名经验丰富的**前端开发工程师**，专注于：&#10;- 现代化前端技术栈&#10;- 用户体验优化&#10;- 团队协作与项目管理"
                  />
                </div>
                <el-form-item class="mb-0 hidden">
                  <el-input
                    type="textarea"
                    v-model="resumeData.personalInfo.summary"
                    placeholder="简要介绍您的专业背景和技能特长"
                    :rows="4"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- 教育经历部分 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 pb-3 border-b-2 border-green-500 flex-1"
                >
                  <el-icon class="mr-2"><School /></el-icon>
                  教育经历
                </h3>
                <el-button type="primary" size="small" @click="addEducation">
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </div>
              <div class="space-y-4" v-if="resumeData.education.length > 0">
                <div
                  v-for="(edu, index) in resumeData.education"
                  :key="edu.id"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-700">教育经历 {{ index + 1 }}</span>
                    <el-button type="danger" size="small" text @click="removeEducation(edu.id)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <el-input v-model="edu.school" placeholder="学校名称" size="small" />
                    <el-input v-model="edu.degree" placeholder="学历" size="small" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <el-input v-model="edu.major" placeholder="专业" size="small" />
                    <el-input v-model="edu.gpa" placeholder="GPA (可选)" size="small" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <DatePickerWithCurrent
                      v-model="edu.startDate"
                      placeholder="开始时间"
                      :show-current="false"
                    />
                    <DatePickerWithCurrent
                      v-model="edu.endDate"
                      v-model:current="edu.current"
                      placeholder="结束时间"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <el-icon class="text-2xl mb-2"><School /></el-icon>
                <p>暂无教育经历，点击添加按钮开始</p>
              </div>
            </div>

            <!-- 工作经验部分 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 pb-3 border-b-2 border-purple-500 flex-1"
                >
                  <el-icon class="mr-2"><Briefcase /></el-icon>
                  工作经验
                </h3>
                <el-button type="primary" size="small" @click="addWorkExperience">
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </div>
              <div class="space-y-4" v-if="resumeData.workExperience.length > 0">
                <div
                  v-for="(exp, index) in resumeData.workExperience"
                  :key="exp.id"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-700">工作经验 {{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      size="small"
                      text
                      @click="removeWorkExperience(exp.id)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <el-input v-model="exp.company" placeholder="公司名称" size="small" />
                    <el-input v-model="exp.position" placeholder="职位名称" size="small" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <DatePickerWithCurrent
                      v-model="exp.startDate"
                      placeholder="开始时间"
                      :show-current="false"
                    />
                    <DatePickerWithCurrent
                      v-model="exp.endDate"
                      v-model:current="exp.current"
                      placeholder="结束时间"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="text-sm text-gray-600 mb-1 block">工作描述和主要成就</label>
                    <v-md-editor
                      v-model="exp.description"
                      height="200px"
                      mode="edit"
                      placeholder="## 主要职责&#10;- 负责前端开发工作&#10;- 参与项目架构设计&#10;&#10;## 主要成就&#10;- 提升页面加载速度30%&#10;- 完成XX项目开发"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <el-icon class="text-2xl mb-2"><Briefcase /></el-icon>
                <p>暂无工作经验，点击添加按钮开始</p>
              </div>
            </div>

            

            <!-- 技能专长部分 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 pb-3 border-b-2 border-orange-500 flex-1"
                >
                  <el-icon class="mr-2"><Tools /></el-icon>
                  技能专长
                </h3>
                <el-button type="primary" size="small" @click="addSkill">
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </div>
              <div class="space-y-3" v-if="resumeData.skills.length > 0">
                <div
                  v-for="(skill, index) in resumeData.skills"
                  :key="skill.id"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <el-input
                    v-model="skill.name"
                    placeholder="技能名称"
                    size="small"
                    class="flex-1"
                  />
                  <el-rate v-model="skill.level" :max="5" size="small" />
                  <el-button type="danger" size="small" text @click="removeSkill(skill.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <el-icon class="text-2xl mb-2"><Tools /></el-icon>
                <p>暂无技能信息，点击添加按钮开始</p>
              </div>
            </div>

            <!-- 项目经历部分 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 pb-3 border-b-2 border-red-500 flex-1"
                >
                  <el-icon class="mr-2"><FolderOpened /></el-icon>
                  项目经历
                </h3>
                <el-button type="primary" size="small" @click="addProject">
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </div>
              <div class="space-y-4" v-if="resumeData.projects.length > 0">
                <div
                  v-for="(project, index) in resumeData.projects"
                  :key="project.id"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-700">项目经历 {{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      size="small"
                      text
                      @click="removeProject(project.id)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <el-input v-model="project.name" placeholder="项目名称" size="small" />
                    <el-input v-model="project.role" placeholder="担任角色" size="small" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <DatePickerWithCurrent
                      v-model="project.startDate"
                      placeholder="开始时间"
                      :show-current="false"
                    />
                    <DatePickerWithCurrent
                      v-model="project.endDate"
                      v-model:current="project.current"
                      placeholder="结束时间"
                    />
                  </div>
                  <el-input
                    v-model="project.technologies"
                    placeholder="技术栈（如：Vue.js, Node.js, MySQL）"
                    size="small"
                    class="mb-3"
                  />
                  <el-input
                    type="textarea"
                    v-model="project.description"
                    placeholder="项目描述和主要成就"
                    :rows="3"
                    size="small"
                  />
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <el-icon class="text-2xl mb-2"><FolderOpened /></el-icon>
                <p>暂无项目经历，点击添加按钮开始</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧预览面板 -->
      <div class="w-1/2 bg-gray-100 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <div class="mb-4">
              <h2 class="text-xl font-bold text-gray-900 mb-2">实时预览</h2>
              <p class="text-sm text-gray-600">技术专业简历模板</p>
            </div>

            <!-- PDF 预览区域 -->
            <div
              class="bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
              style="width: 595px; max-width: 100%"
            >
              <div
                class="resume-preview p-8"
                style="
                  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                <!-- 简历头部 -->
                <div class="resume-header text-center mb-6 pb-4 border-b-2 border-blue-600">
                  <h1 v-if="resumeData.personalInfo.name" class="text-2xl font-bold text-gray-900 mb-2">
                    {{ resumeData.personalInfo.name }}
                  </h1>
                  <p v-if="resumeData.personalInfo.title" class="text-lg text-blue-600 font-medium mb-3">
                    {{ resumeData.personalInfo.title }}
                  </p>
                  <div class="contact-info text-sm text-gray-600 space-y-1">
                    <div class="flex justify-center items-center gap-6 flex-wrap">
                      <span v-if="resumeData.personalInfo.phone">
                        📞 {{ resumeData.personalInfo.phone }}
                      </span>
                      <span v-if="resumeData.personalInfo.email">
                        ✉️ {{ resumeData.personalInfo.email }}
                      </span>
                      <span v-if="resumeData.personalInfo.address">
                        📍 {{ resumeData.personalInfo.address }}
                      </span>
                    </div>
                    <div class="flex justify-center items-center gap-4 flex-wrap mt-2 contact-github-blog">
                      <span v-if="resumeData.personalInfo.github">
                        🔗 GitHub: {{ resumeData.personalInfo.github }}
                      </span>
                      <span v-if="resumeData.personalInfo.blog">
                        📝 博客: {{ resumeData.personalInfo.blog }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 个人简介 -->
                <div v-if="resumeData.personalInfo.summary" class="mb-6">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    个人简介
                  </h3>
                  <div class="text-gray-700 leading-relaxed text-sm markdown-content">
                    <v-md-preview :text="resumeData.personalInfo.summary || ''" />
                  </div>
                </div>

                <!-- 教育经历 -->
                <div v-if="resumeData.education.length > 0" class="mb-6 resume-section">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    教育经历
                  </h3>
                  <div class="space-y-4 education-list">
                    <div
                      v-for="edu in resumeData.education"
                      :key="edu.id"
                      class="pb-4 border-b border-gray-200 last:border-b-0 education-item"
                    >
                      <div class="flex justify-between items-start mb-2 edu-header">
                        <div class="flex-1">
                          <h4 class="font-bold text-gray-900 text-base mb-1">
                            {{ edu.school || '学校名称' }}
                          </h4>
                          <p class="text-gray-700 font-medium">
                            {{ edu.degree || '学历' }} · {{ edu.major || '专业' }}
                          </p>
                        </div>
                        <div class="text-right ml-4">
                          <span class="text-sm text-gray-600 font-medium">
                            {{ formatDateRange(edu.startDate, edu.endDate, edu.current) || '开始时间 - 结束时间' }}
                          </span>
                        </div>
                      </div>
                      <p v-if="edu.gpa" class="text-sm text-gray-600 mt-1">GPA: {{ edu.gpa }}</p>
                    </div>
                  </div>
                </div>

                <!-- 工作经验 -->
                <div v-if="resumeData.workExperience.length > 0" class="mb-6 resume-section">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    工作经验
                  </h3>
                  <div class="space-y-6 experience-list">
                    <div
                      v-for="exp in resumeData.workExperience"
                      :key="exp.id"
                      class="pb-4 border-b border-gray-200 last:border-b-0 experience-item"
                    >
                      <div class="flex justify-between items-start mb-3 exp-header">
                        <div class="flex-1">
                          <h4 class="font-bold text-gray-900 text-base mb-1">
                            {{ exp.position || '职位名称' }}
                          </h4>
                          <p class="text-gray-700 font-medium">{{ exp.company || '公司名称' }}</p>
                        </div>
                        <div class="text-right ml-4">
                          <span class="text-sm text-gray-600 font-medium">
                            {{ formatDateRange(exp.startDate, exp.endDate, exp.current) || '开始时间 - 结束时间' }}
                          </span>
                        </div>
                      </div>
                      <div v-if="exp.description" class="text-gray-700 text-sm leading-relaxed markdown-content">
                        <v-md-preview :text="exp.description" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 项目经历 -->
                <div v-if="resumeData.projects.length > 0" class="mb-6 resume-section">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    项目经历
                  </h3>
                  <div class="space-y-6 projects-list">
                    <div
                      v-for="project in resumeData.projects"
                      :key="project.id"
                      class="pb-4 border-b border-gray-200 last:border-b-0 project-item"
                    >
                      <div class="flex justify-between items-start mb-3 project-header">
                        <div class="flex-1">
                          <h4 class="font-bold text-gray-900 text-base mb-1">
                            {{ project.name || '项目名称' }}
                          </h4>
                          <p class="text-gray-700 font-medium">
                            {{ project.role || '担任角色' }}
                          </p>
                        </div>
                        <div class="text-right ml-4">
                          <span class="text-sm text-gray-600 font-medium">
                            {{ formatDateRange(project.startDate, project.endDate, project.current) || '开始时间 - 结束时间' }}
                          </span>
                        </div>
                      </div>
                      <div v-if="project.technologies" class="text-sm text-gray-600 mb-2">
                        <strong>技术栈：</strong>{{ project.technologies }}
                      </div>
                      <div v-if="project.description" class="text-gray-700 text-sm leading-relaxed">
                        {{ project.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 技能专长 -->
                <div v-if="resumeData.skills.length > 0" class="mb-6 resume-section">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    技能专长
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      v-for="skill in resumeData.skills"
                      :key="skill.id"
                      class="flex justify-between items-center py-2"
                    >
                      <span class="text-gray-700 font-medium">{{ skill.name || '技能名称' }}</span>
                      <div class="flex">
                        <span v-for="i in 5" :key="i" class="text-sm text-gray-600">
                          {{ i <= (skill.level || 3) ? '●' : '○' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 项目经历 -->
                <div v-if="resumeData.projects.length > 0" class="mb-6 resume-section">
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-black"
                  >
                    项目经历
                  </h3>
                  <div class="space-y-6 projects-list">
                    <div
                      v-for="project in resumeData.projects"
                      :key="project.id"
                      class="pb-4 border-b border-gray-200 last:border-b-0 project-item"
                    >
                      <div class="flex justify-between items-start mb-3 project-header">
                        <div class="flex-1">
                          <h4 class="font-bold text-gray-900 text-base mb-1">
                            {{ project.name || '项目名称' }}
                          </h4>
                          <p class="text-gray-700 font-medium">
                            {{ project.role || '担任角色' }}
                          </p>
                        </div>
                        <div class="text-right ml-4">
                          <span class="text-sm text-gray-600 font-medium">
                            {{ formatDateRange(project.startDate, project.endDate, project.current) || '开始时间 - 结束时间' }}
                          </span>
                        </div>
                      </div>
                      <div v-if="project.technologies" class="text-sm text-gray-600 mb-2">
                        <strong>技术栈：</strong>{{ project.technologies }}
                      </div>
                      <div v-if="project.description" class="text-gray-700 text-sm leading-relaxed">
                        {{ project.description }}
                      </div>
                    </div>
                  </div>
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
  import DatePickerWithCurrent from '@/components/DatePickerWithCurrent.vue'
  import {
    ArrowLeft,
    Download,
    User,
    Briefcase,
    School,
    Tools,
    FolderOpened,
    Plus,
    Delete,
    ArrowDown,
    Document,
    Upload
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import ResumeExportImport from '@/utils/exportImport'

  const router = useRouter()
  const route = useRoute()
  const resumeStore = useResumeStore()

  // 计算属性
  const currentTemplate = computed(() => resumeStore.currentTemplate)
  const resumeData = computed(() => resumeStore.resumeData)

  // 时间格式化函数
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    
    // 如果已经是格式化的日期，直接返回
    if (dateStr.includes('年') || dateStr.includes('月')) return dateStr
    
    // 处理常见的日期格式
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`
    }
    
    // 处理 YYYY-MM 格式
    if (/^\d{4}-\d{1,2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-')
      return `${year}年${String(month).padStart(2, '0')}月`
    }
    
    // 处理 YYYY/MM 格式
    if (/^\d{4}\/\d{1,2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('/')
      return `${year}年${String(month).padStart(2, '0')}月`
    }
    
    // 处理纯数字年份
    if (/^\d{4}$/.test(dateStr)) {
      return `${dateStr}年`
    }
    
    // 其他情况直接返回原字符串
    return dateStr
  }

  // 日期范围格式化函数（支持"至今"）
  const formatDateRange = (startDate, endDate, current = false) => {
    if (!startDate) return ''
    
    const formatSingleDate = (dateStr) => {
      if (!dateStr) return ''
      if (dateStr.includes('年') || dateStr.includes('月')) return dateStr
      
      if (/^\d{4}-\d{1,2}$/.test(dateStr)) {
        const [year, month] = dateStr.split('-')
        return `${year}年${String(month).padStart(2, '0')}月`
      }
      return dateStr
    }

    const start = formatSingleDate(startDate)
    if (current) {
      return `${start} - 至今`
    }
    
    const end = formatSingleDate(endDate)
    if (!end) return start
    
    return `${start} - ${end}`
  }

  // 方法
  const goBack = () => {
    router.go(-1)
  }

  // 工作经验管理
  const addWorkExperience = () => {
    resumeStore.addWorkExperience()
  }

  const removeWorkExperience = id => {
    resumeStore.removeWorkExperience(id)
  }

  // 教育经历管理
  const addEducation = () => {
    resumeStore.addEducation()
  }

  const removeEducation = id => {
    resumeStore.removeEducation(id)
  }

  // 技能管理
  const addSkill = () => {
    resumeStore.addSkill()
  }

  const removeSkill = id => {
    resumeStore.removeSkill(id)
  }

  // 项目管理
  const addProject = () => {
    resumeStore.addProject()
  }

  const removeProject = id => {
    resumeStore.removeProject(id)
  }

  // 导出功能
  const handleExportCommand = async command => {
    const previewElement = document.querySelector('.resume-preview')
    if (!previewElement) {
      ElMessage.error('找不到预览区域，请稍后重试')
      return
    }

    const loading = ElMessage({
      message: '正在生成文件，请稍候...',
      type: 'info',
      duration: 0
    })

    try {
      let result
      const fileName = `${resumeData.value.personalInfo.name || 'resume'}`

      switch (command) {
        case 'pdf':
          result = await ResumeExportImport.exportToPDF(previewElement, `${fileName}.pdf`)
          break
        case 'json':
          result = ResumeExportImport.exportResumeData(resumeStore.exportResumeData(), `${fileName}-data.json`)
          break
        case 'all':
          result = await ResumeExportImport.exportAll(previewElement, resumeStore.exportResumeData(), fileName)
          break
        default:
          loading.close()
          return
      }

      loading.close()

      if (result.success) {
        ElMessage.success(result.message)
      } else {
        ElMessage.error(result.message)
      }
    } catch (error) {
      loading.close()
      ElMessage.error('导出失败: ' + error.message)
    }
  }

  // 导入功能
  const importResumeData = () => {
    ResumeExportImport.createFileSelector(async file => {
      const loading = ElMessage({
        message: '正在导入数据，请稍候...',
        type: 'info',
        duration: 0
      })

      try {
        const result = await ResumeExportImport.importResumeData(file)
        loading.close()

        if (result.success) {
          // 确认是否要覆盖当前数据
          const confirmResult = await ElMessageBox.confirm(
            '导入新数据将覆盖当前所有内容，是否继续？',
            '确认导入',
            {
              confirmButtonText: '确定导入',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )

          if (confirmResult === 'confirm') {
            // 导入数据到store
            resumeStore.importResumeData(result.data)
            ElMessage.success(result.message)
          }
        }
      } catch (error) {
        loading.close()
        ElMessage.error(error.message || '导入失败')
      }
    })
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

<style scoped>
  /* 主容器高度控制 */
  .min-h-screen {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .flex-1 {
    flex: 1;
    min-height: 0; /* 重要：让flex子元素可以正确收缩 */
  }

  /* 编辑区域高度控制 */
  .h-0 {
    height: calc(100vh - 60px); /* 减去头部高度 */
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* 左右面板样式 */
  .w-1\/2 {
    width: 50%;
    height: 100%;
  }

  /* 表单样式优化 */
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-form-item__label {
    font-weight: 500;
    color: #374151;
  }

  /* 预览区域样式 */
  .resume-preview {
    min-height: 842px; /* A4 纸张高度 */
  }

  /* 内容区域内边距优化 */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f8fafc;
  }

  /* 确保内容区域有足够的底部空间 */
  .p-6 {
    padding-bottom: 2rem;
  }

  /* 响应式调整 */
  @media (max-width: 1200px) {
    .w-1\/2 {
      width: 50%;
    }
  }

  @media (max-width: 768px) {
    .h-0 {
      height: auto;
      flex-direction: column;
    }

    .w-1\/2 {
      width: 100%;
      height: 50vh;
    }

    .flex {
      flex-direction: column;
    }
  }

  /* 同步滚动效果优化 */
  .edit-panel,
  .preview-panel {
    scroll-behavior: smooth;
  }

  /* 头部固定样式 */
  header {
    height: 60px;
    flex-shrink: 0;
  }

  /* Markdown 内容样式 */
  .markdown-content :deep(ul) {
    list-style-type: disc;
    margin-left: 1rem;
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .markdown-content :deep(ol) {
    list-style-type: decimal;
    margin-left: 1rem;
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .markdown-content :deep(li) {
    margin-bottom: 0.25rem;
    line-height: 1.6;
  }

  .markdown-content :deep(h1),
  .markdown-content :deep(h2),
  .markdown-content :deep(h3),
  .markdown-content :deep(h4),
  .markdown-content :deep(h5),
  .markdown-content :deep(h6) {
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  .markdown-content :deep(h1) {
    font-size: 1.5rem;
  }

  .markdown-content :deep(h2) {
    font-size: 1.25rem;
  }

  .markdown-content :deep(h3) {
    font-size: 1.125rem;
  }

  .markdown-content :deep(p) {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .markdown-content :deep(strong) {
    font-weight: 600;
  }

  .markdown-content :deep(em) {
    font-style: italic;
  }

  .markdown-content :deep(code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  .markdown-content :deep(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #6b7280;
    font-style: italic;
  }

  /* GitHub和博客换行间距控制 */
  .contact-github-blog {
    row-gap: 0.25rem;
  }
</style>
