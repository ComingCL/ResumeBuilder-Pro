import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    // 当前简历数据
    resumeData: {
      personalInfo: {
        name: '',
        title: '',
        phone: '',
        email: '',
        address: '',
        avatar: '',
        summary: '',
        github: '',
        blog: '',
        linkedin: '',
        website: ''
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      awards: [],
      languages: []
    },

    // 当前选择的模板ID
    selectedTemplateId: 'template1',

    // 可用的模板列表
    templates: [
      {
        id: 'template1',
        name: '经典商务',
        description: '适合商务和管理岗位的经典模板',
        preview: '/templates/template1-preview.jpg',
        category: 'business'
      },
      {
        id: 'template2',
        name: '现代简约',
        description: '简约现代风格，适合设计和创意岗位',
        preview: '/templates/template2-preview.jpg',
        category: 'creative'
      },
      {
        id: 'template3',
        name: '技术专业',
        description: '专为技术岗位设计的专业模板',
        preview: '/templates/template3-preview.jpg',
        category: 'technical'
      },
      {
        id: 'template4',
        name: '清新文艺',
        description: '清新文艺风格，适合教育和文化岗位',
        preview: '/templates/template4-preview.jpg',
        category: 'education'
      },
      {
        id: 'template5',
        name: '国际通用',
        description: '符合国际标准的通用简历模板',
        preview: '/templates/template5-preview.jpg',
        category: 'international'
      }
    ]
  }),

  getters: {
    // 获取当前模板信息
    currentTemplate: state => {
      return state.templates.find(t => t.id === state.selectedTemplateId)
    },

    // 检查简历是否完整
    isResumeComplete: state => {
      const { personalInfo } = state.resumeData
      return !!(personalInfo.name && personalInfo.email && personalInfo.phone)
    },

    // 获取简历完成度百分比
    resumeCompleteness: state => {
      const fields = [
        state.resumeData.personalInfo.name,
        state.resumeData.personalInfo.email,
        state.resumeData.personalInfo.phone,
        state.resumeData.personalInfo.summary,
        state.resumeData.workExperience.length > 0,
        state.resumeData.education.length > 0,
        state.resumeData.skills.length > 0
      ]
      const completedFields = fields.filter(field => !!field).length
      return Math.round((completedFields / fields.length) * 100)
    }
  },

  actions: {
    // 更新个人信息
    updatePersonalInfo(info) {
      this.resumeData.personalInfo = { ...this.resumeData.personalInfo, ...info }
      this.saveToLocalStorage()
    },

    // 添加工作经验
    addWorkExperience(experience) {
      this.resumeData.workExperience.push({
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        ...experience
      })
      this.saveToLocalStorage()
    },

    // 更新工作经验
    updateWorkExperience(id, experience) {
      const index = this.resumeData.workExperience.findIndex(exp => exp.id === id)
      if (index !== -1) {
        this.resumeData.workExperience[index] = {
          ...this.resumeData.workExperience[index],
          ...experience
        }
        this.saveToLocalStorage()
      }
    },

    // 删除工作经验
    removeWorkExperience(id) {
      this.resumeData.workExperience = this.resumeData.workExperience.filter(exp => exp.id !== id)
      this.saveToLocalStorage()
    },

    // 添加教育经历
    addEducation(education) {
      this.resumeData.education.push({
        id: Date.now(),
        school: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        ...education
      })
      this.saveToLocalStorage()
    },

    // 更新教育经历
    updateEducation(id, education) {
      const index = this.resumeData.education.findIndex(edu => edu.id === id)
      if (index !== -1) {
        this.resumeData.education[index] = { ...this.resumeData.education[index], ...education }
        this.saveToLocalStorage()
      }
    },

    // 删除教育经历
    removeEducation(id) {
      this.resumeData.education = this.resumeData.education.filter(edu => edu.id !== id)
      this.saveToLocalStorage()
    },

    // 添加技能
    addSkill(skill) {
      this.resumeData.skills.push({
        id: Date.now(),
        name: '',
        level: 3,
        ...skill
      })
      this.saveToLocalStorage()
    },

    // 更新技能
    updateSkill(id, skill) {
      const index = this.resumeData.skills.findIndex(s => s.id === id)
      if (index !== -1) {
        this.resumeData.skills[index] = { ...this.resumeData.skills[index], ...skill }
        this.saveToLocalStorage()
      }
    },

    // 删除技能
    removeSkill(id) {
      this.resumeData.skills = this.resumeData.skills.filter(s => s.id !== id)
      this.saveToLocalStorage()
    },

    // 添加项目
    addProject(project) {
      this.resumeData.projects.push({
        id: Date.now(),
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        current: false,
        technologies: '',
        description: '',
        ...project
      })
      this.saveToLocalStorage()
    },

    // 更新项目
    updateProject(id, project) {
      const index = this.resumeData.projects.findIndex(p => p.id === id)
      if (index !== -1) {
        this.resumeData.projects[index] = { ...this.resumeData.projects[index], ...project }
        this.saveToLocalStorage()
      }
    },

    // 删除项目
    removeProject(id) {
      this.resumeData.projects = this.resumeData.projects.filter(p => p.id !== id)
      this.saveToLocalStorage()
    },

    // 选择模板
    selectTemplate(templateId) {
      this.selectedTemplateId = templateId
      this.saveToLocalStorage()
    },

    // 重置简历数据
    resetResumeData() {
      this.resumeData = {
        personalInfo: {
          name: '',
          title: '',
          phone: '',
          email: '',
          address: '',
          avatar: '',
          summary: '',
          github: '',
          blog: '',
          linkedin: '',
          website: ''
        },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        awards: [],
        languages: []
      }
      this.saveToLocalStorage()
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem(
          'resumeBuilderData',
          JSON.stringify({
            resumeData: this.resumeData,
            selectedTemplateId: this.selectedTemplateId
          })
        )
      } catch (error) {
        console.error('保存到本地存储失败:', error)
      }
    },

    // 从本地存储加载数据
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('resumeBuilderData')
        if (saved) {
          const data = JSON.parse(saved)
          this.resumeData = { ...this.resumeData, ...data.resumeData }
          this.selectedTemplateId = data.selectedTemplateId || 'template1'
        }
      } catch (error) {
        console.error('从本地存储加载失败:', error)
      }
    },

    // 导出简历数据
    exportResumeData() {
      return {
        resumeData: this.resumeData,
        selectedTemplateId: this.selectedTemplateId,
        exportTime: new Date().toISOString()
      }
    },

    // 导入简历数据
    importResumeData(data) {
      if (data.resumeData) {
        this.resumeData = data.resumeData
      }
      if (data.selectedTemplateId) {
        this.selectedTemplateId = data.selectedTemplateId
      }
      this.saveToLocalStorage()
    }
  }
})
