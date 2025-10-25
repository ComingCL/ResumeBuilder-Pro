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
          <!-- 个人信息 -->
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
            <div class="contact-row" v-if="resumeData.personalInfo.github || resumeData.personalInfo.blog">
              <span v-if="resumeData.personalInfo.github">🔗 {{ resumeData.personalInfo.github }}</span>
              <span v-if="resumeData.personalInfo.blog">📝 {{ resumeData.personalInfo.blog }}</span>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="resume-section" v-if="resumeData.personalInfo.summary">
            <h2 class="section-title">
              <span class="title-text">个人简介</span>
              <div class="title-line"></div>
            </h2>
            <p class="summary-text">{{ resumeData.personalInfo.summary }}</p>
          </div>

          <!-- 工作经验 -->
          <div class="resume-section" v-if="resumeData.workExperience.length > 0">
            <h2 class="section-title">
              <span class="title-text">工作经验</span>
              <div class="title-line work-line"></div>
            </h2>
            <div class="experience-list">
              <div v-for="exp in resumeData.workExperience" :key="exp.id" class="experience-item">
                <div class="exp-header">
                  <h3 class="exp-title">{{ exp.position }} - {{ exp.company }}</h3>
                  <span class="exp-date">{{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}</span>
                </div>
                <div class="exp-description markdown-content">
                  <v-md-preview :text="exp.description || ''" />
                </div>
              </div>
            </div>
          </div>

          <!-- 教育经历 -->
          <div class="resume-section" v-if="resumeData.education.length > 0">
            <h2 class="section-title">
              <span class="title-text">教育经历</span>
              <div class="title-line education-line"></div>
            </h2>
            <div class="education-list">
              <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
                <div class="edu-header">
                  <h3 class="edu-title">{{ edu.school }} - {{ edu.degree }}</h3>
                  <span class="edu-date">{{ formatDateRange(edu.startDate, edu.endDate) }}</span>
                </div>
                <p class="edu-major" v-if="edu.major">专业：{{ edu.major }}</p>
                <p class="edu-gpa" v-if="edu.gpa">GPA：{{ edu.gpa }}</p>
              </div>
            </div>
          </div>

          <!-- 技能专长 -->
          <div class="resume-section" v-if="resumeData.skills.length > 0">
            <h2 class="section-title">
              <span class="title-text">技能专长</span>
              <div class="title-line skills-line"></div>
            </h2>
            <div class="skills-grid">
              <div v-for="skill in resumeData.skills" :key="skill.id" class="skill-item">
                <span class="skill-name">{{ skill.name }}</span>
                <div class="skill-level">
                  <div class="skill-dots">
                    <span 
                      v-for="i in 5" 
                      :key="i" 
                      class="skill-dot"
                      :class="{ active: i <= skill.level }"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 项目经历 -->
          <div class="resume-section" v-if="resumeData.projects.length > 0">
            <h2 class="section-title">
              <span class="title-text">项目经历</span>
              <div class="title-line projects-line"></div>
            </h2>
            <div class="projects-list">
              <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
                <div class="project-header">
                  <h3 class="project-title">{{ project.name }}</h3>
                  <span class="project-date">{{ formatDateRange(project.startDate, project.endDate) }}</span>
                </div>
                <p class="project-role" v-if="project.role">角色：{{ project.role }}</p>
                <p class="project-tech" v-if="project.technologies">技术栈：{{ project.technologies }}</p>
                <p class="project-desc" v-if="project.description">{{ project.description }}</p>
              </div>
            </div>
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

  // 日期格式化函数
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

<style scoped>
  .preview-page {
    min-height: 100vh;
    background: #f5f7fa;
  }

  .preview-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-info h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .header-info p {
    margin: 0.25rem 0 0 0;
    color: #6b7280;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .preview-content {
    padding: 2rem 0;
  }

  .resume-wrapper {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .resume-page {
    padding: 2rem;
    line-height: 1.6;
  }

  .resume-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .resume-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
  }

  .title {
    margin: 0;
    font-size: 1.2rem;
    color: #6b7280;
    font-weight: 500;
  }

  .resume-contact {
    margin-bottom: 2rem;
  }

  .contact-row {
    display: flex;
    justify-content: center;
    gap: 1rem 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    row-gap: 0.25rem;
  }

  .contact-row span {
    color: #4b5563;
    font-size: 0.9rem;
  }

  .resume-section {
    margin-bottom: 2rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .title-text {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
  }

  .title-line {
    flex: 1;
    height: 3px;
    background: #3b82f6;
    border-radius: 2px;
  }

  .work-line {
    background: #8b5cf6;
  }

  .education-line {
    background: #10b981;
  }

  .skills-line {
    background: #f59e0b;
  }

  .projects-line {
    background: #ef4444;
  }

  .summary-text {
    color: #4b5563;
    margin: 0;
    text-align: justify;
  }

  .experience-item,
  .education-item,
  .project-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .experience-item:last-child,
  .education-item:last-child,
  .project-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .exp-header,
  .edu-header,
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .exp-title,
  .edu-title,
  .project-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    flex: 1;
  }

  .exp-date,
  .edu-date,
  .project-date {
    color: #6b7280;
    font-size: 0.9rem;
    white-space: nowrap;
    margin-left: 1rem;
  }

  .exp-description {
    color: #4b5563;
    margin-top: 0.5rem;
  }

  .edu-major,
  .edu-gpa,
  .project-role,
  .project-tech,
  .project-desc {
    margin: 0.25rem 0;
    color: #4b5563;
    font-size: 0.95rem;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .skill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 6px;
  }

  .skill-name {
    font-weight: 500;
    color: #1f2937;
  }

  .skill-dots {
    display: flex;
    gap: 0.25rem;
  }

  .skill-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
  }

  .skill-dot.active {
    background: #f59e0b;
  }

  /* 打印样式 */
  @media print {
    .preview-header {
      display: none;
    }
    
    .preview-content {
      padding: 0;
    }
    
    .resume-wrapper {
      box-shadow: none;
      border-radius: 0;
    }
    
    .resume-page {
      padding: 1rem;
    }
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

  /* 响应式设计 */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .contact-row {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .exp-header,
    .edu-header,
    .project-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .exp-date,
    .edu-date,
    .project-date {
      margin-left: 0;
      margin-top: 0.25rem;
    }
    
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
</style>