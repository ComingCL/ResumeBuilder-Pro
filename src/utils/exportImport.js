import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * PDF导出和数据导入导出工具类
 * 作者：clarenceLiu
 */
export class ResumeExportImport {
  /**
   * 导出简历为PDF
   * @param {HTMLElement} element - 要导出的DOM元素
   * @param {string} filename - 文件名
   * @param {Object} options - 导出选项
   */
  static async exportToPDF(element, filename = 'resume.pdf', options = {}) {
    try {
      const defaultOptions = {
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        ...options
      }

      // 生成canvas
      const canvas = await html2canvas(element, defaultOptions)

      // 计算PDF尺寸 (A4: 210mm x 297mm)
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      // 如果内容高度超过一页，需要分页
      let heightLeft = imgHeight
      let position = 0

      // 添加第一页
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297 // A4页面高度

      // 添加额外页面
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }

      // 下载PDF
      pdf.save(filename)

      return {
        success: true,
        message: 'PDF导出成功'
      }
    } catch (error) {
      console.error('PDF导出失败:', error)
      return {
        success: false,
        message: 'PDF导出失败: ' + error.message
      }
    }
  }

  /**
   * 导出简历数据为JSON文件
   * @param {Object} resumeData - 简历数据
   * @param {string} filename - 文件名
   */
  static exportResumeData(resumeData, filename = 'resume-data.json') {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 清理URL对象
      URL.revokeObjectURL(link.href)

      return {
        success: true,
        message: '简历数据导出成功'
      }
    } catch (error) {
      console.error('数据导出失败:', error)
      return {
        success: false,
        message: '数据导出失败: ' + error.message
      }
    }
  }

  /**
   * 从JSON文件导入简历数据
   * @param {File} file - 上传的文件
   * @returns {Promise} 返回解析后的数据
   */
  static importResumeData(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('请选择要导入的文件'))
        return
      }

      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        reject(new Error('请选择JSON格式的文件'))
        return
      }

      const reader = new FileReader()

      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result)

          // 验证数据格式
          if (!this.validateResumeData(data)) {
            reject(new Error('文件格式不正确，请确保是有效的简历数据文件'))
            return
          }

          resolve({
            success: true,
            data: data,
            message: '简历数据导入成功'
          })
        } catch (error) {
          reject(new Error('文件解析失败，请确保文件格式正确'))
        }
      }

      reader.onerror = () => {
        reject(new Error('文件读取失败'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * 验证简历数据格式
   * @param {Object} data - 要验证的数据
   * @returns {boolean} 验证结果
   */
  static validateResumeData(data) {
    try {
      // 检查必要的字段结构
      const requiredFields = ['personalInfo', 'workExperience', 'education', 'skills', 'projects']

      for (const field of requiredFields) {
        if (!(field in data)) {
          return false
        }
      }

      // 检查personalInfo的基本结构
      if (typeof data.personalInfo !== 'object') {
        return false
      }

      // 检查数组字段
      const arrayFields = ['workExperience', 'education', 'skills', 'projects']
      for (const field of arrayFields) {
        if (!Array.isArray(data[field])) {
          return false
        }
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 创建文件选择器
   * @param {Function} callback - 文件选择后的回调函数
   * @param {string} accept - 接受的文件类型
   */
  static createFileSelector(callback, accept = '.json') {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'

    input.addEventListener('change', e => {
      const file = e.target.files[0]
      if (file && callback) {
        callback(file)
      }
      // 清理DOM
      document.body.removeChild(input)
    })

    document.body.appendChild(input)
    input.click()
  }

  /**
   * 批量导出功能
   * @param {HTMLElement} pdfElement - PDF导出的DOM元素
   * @param {Object} resumeData - 简历数据
   * @param {string} baseName - 基础文件名
   */
  static async exportAll(pdfElement, resumeData, baseName = 'resume') {
    try {
      const results = []

      // 导出PDF
      const pdfResult = await this.exportToPDF(pdfElement, `${baseName}.pdf`)
      results.push({ type: 'PDF', ...pdfResult })

      // 导出数据
      const dataResult = this.exportResumeData(resumeData, `${baseName}-data.json`)
      results.push({ type: 'JSON', ...dataResult })

      const successCount = results.filter(r => r.success).length

      return {
        success: successCount === results.length,
        message: `成功导出 ${successCount}/${results.length} 个文件`,
        results: results
      }
    } catch (error) {
      return {
        success: false,
        message: '批量导出失败: ' + error.message
      }
    }
  }

  /**
   * 生成简历预览图片
   * @param {HTMLElement} element - 要截图的DOM元素
   * @param {string} format - 图片格式 (png/jpeg)
   * @param {number} quality - 图片质量 (0-1)
   */
  static async generatePreviewImage(element, format = 'png', quality = 0.9) {
    try {
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const dataURL = canvas.toDataURL(`image/${format}`, quality)

      return {
        success: true,
        dataURL: dataURL,
        width: canvas.width,
        height: canvas.height
      }
    } catch (error) {
      console.error('预览图片生成失败:', error)
      return {
        success: false,
        message: '预览图片生成失败: ' + error.message
      }
    }
  }

  /**
   * 获取支持的导出格式
   */
  static getSupportedFormats() {
    return {
      pdf: {
        name: 'PDF文档',
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: '适合打印和分享的PDF格式'
      },
      json: {
        name: 'JSON数据',
        extension: '.json',
        mimeType: 'application/json',
        description: '可重新导入编辑的数据格式'
      },
      png: {
        name: 'PNG图片',
        extension: '.png',
        mimeType: 'image/png',
        description: '高质量图片格式'
      }
    }
  }
}

// 默认导出
export default ResumeExportImport
