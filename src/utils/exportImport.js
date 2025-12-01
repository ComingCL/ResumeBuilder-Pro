import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DEFAULT_BREAK_SELECTORS = [
  '.resume-section',
  '.experience-item',
  '.education-item',
  '.project-item',
  '.exp-header',
  '.edu-header',
  '.project-header',
  '.summary-text',
  '.skills-grid',
  '.resume-header',
  '.markdown-content',
  'h3',
  'h4',
  "[class*='border-b']",
  "div[class*='space-y-'] > div",
  "div[class*='pb-']"
]

const DEFAULT_BREAK_ATTRIBUTES = ['data-break-after', 'data-break-before', 'data-break-safe']

/**
 * PDF导出和数据导入导出工具类
 * 作者：clarenceLiu
 */
export class ResumeExportImport {
  /**
   * 导出简历为PDF（使用浏览器打印API，支持CSS分页控制）
   * @param {HTMLElement} element - 要导出的DOM元素
   * @param {string} filename - 文件名
   * @param {Object} options - 导出选项
   */
  static async exportToPDF(element, filename = 'resume.pdf', options = {}) {
    try {
      // 直接使用html2canvas导出PDF
      return await this.exportToPDFWithCanvas(element, filename, options)
    } catch (error) {
      console.error('PDF导出失败:', error)
      return {
        success: false,
        message: `PDF导出失败: ${error.message}`
      }
    }
  }

  /**
   * 使用浏览器打印API导出PDF（支持CSS分页控制）
   */
  static async exportToPDFWithPrint(element, filename) {
    return new Promise((resolve) => {
      // 创建一个新的窗口用于打印
      const printWindow = window.open('', '_blank')
      
      // 获取当前页面的所有样式
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n')
          } catch (e) {
            return ''
          }
        })
        .join('\n')

      // 构建打印页面HTML
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${filename}</title>
            <style>
              ${styles}
              
              /* 额外的分页控制 */
              @page {
                size: A4;
                margin: 20mm;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              
              .resume-section {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              .section-title {
                page-break-after: avoid !important;
                break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              .experience-item,
              .education-item,
              .project-item {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      // 等待内容加载完成后触发打印
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          resolve({
            success: true,
            message: '请在浏览器打印对话框中选择"保存为PDF"'
          })
        }, 500)
      }
    })
  }

  /**
   * 使用html2canvas导出PDF（智能分页版本）
   */
  static async exportToPDFWithCanvas(element, filename, options = {}) {
    try {
      // 先克隆元素，在克隆的元素上应用分页优化
      const clonedElement = element.cloneNode(true)
      document.body.appendChild(clonedElement)
      
      // 设置克隆元素的样式，确保与原元素一致
      clonedElement.style.position = 'absolute'
      clonedElement.style.left = '-9999px'
      clonedElement.style.top = '0'
      clonedElement.style.width = element.offsetWidth + 'px'
      clonedElement.style.backgroundColor = '#ffffff'
      
      // 应用分页优化样式
      this.applyPageBreakStyles(clonedElement)

      const defaultOptions = {
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
        ...options
      }

      const canvas = await html2canvas(clonedElement, defaultOptions)
      
      // 清理克隆的元素
      document.body.removeChild(clonedElement)

      // 计算PDF尺寸 (A4: 210mm x 297mm)
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const mmPerPx = imgWidth / canvas.width
      const pageHeightPx = Math.round(pageHeight * (canvas.width / imgWidth))

      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      const scaleFactor = canvas.width / clonedElement.offsetWidth

      const breakSelectors = options.breakSelectors || DEFAULT_BREAK_SELECTORS
      const breakAttributes = options.breakAttributes || DEFAULT_BREAK_ATTRIBUTES
      const breakMarginPx = options.breakMarginPx || 4

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        await this.addPagesWithSmartBreaks(
          pdf,
          canvas,
          imgWidth,
          pageHeight,
          pageHeightPx,
          clonedElement,
          mmPerPx,
          scaleFactor,
          breakSelectors,
          breakAttributes,
          breakMarginPx
        )
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
   * 应用分页优化样式
   */
  static applyPageBreakStyles(element) {
    // 添加分页控制CSS
    const style = document.createElement('style')
    style.textContent = `
      .resume-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 20px !important;
      }
      
      .section-title {
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 10px !important;
      }
      
      .experience-item,
      .education-item,
      .project-item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 15px !important;
      }
      
      .exp-header,
      .edu-header,
      .project-header {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    `
    element.appendChild(style)
    
    // 为关键元素添加分页控制类
    const sections = element.querySelectorAll('.resume-section')
    sections.forEach(section => {
      section.style.pageBreakInside = 'avoid'
      section.style.breakInside = 'avoid'
    })
    
    const titles = element.querySelectorAll('.section-title')
    titles.forEach(title => {
      title.style.pageBreakAfter = 'avoid'
      title.style.breakAfter = 'avoid'
      title.style.pageBreakInside = 'avoid'
      title.style.breakInside = 'avoid'
    })
    
    const items = element.querySelectorAll('.experience-item, .education-item, .project-item')
    items.forEach(item => {
      item.style.pageBreakInside = 'avoid'
      item.style.breakInside = 'avoid'
    })
  }

  /**
   * 智能分页添加
   */
  static async addPagesWithSmartBreaks(pdf, canvas, imgWidth, pageHeightMm, pageHeightPx, element, mmPerPx, scaleFactor, selectors, attributes, marginPx) {
    const safeBreaks = this.getSafeBreakPoints(element, canvas.height, scaleFactor, selectors, attributes)
    let start = 0
    const slices = []
    while (start < canvas.height) {
      const candidates = safeBreaks.filter(b => b > start && (b - start) <= pageHeightPx - (marginPx || 0))
      let end
      if (candidates.length > 0) {
        end = Math.max(...candidates)
      } else {
        end = Math.min(start + pageHeightPx, canvas.height)
      }
      slices.push({ top: start, height: end - start })
      start = end
    }

    for (let i = 0; i < slices.length; i++) {
      const { top, height } = slices[i]
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = height
      const ctx = sliceCanvas.getContext('2d')
      ctx.drawImage(canvas, 0, top, canvas.width, height, 0, 0, canvas.width, height)
      const sliceData = sliceCanvas.toDataURL('image/png')
      const sliceHeightMm = height * mmPerPx
      if (i > 0) pdf.addPage()
      pdf.addImage(sliceData, 'PNG', 0, 0, imgWidth, sliceHeightMm)
    }
  }

  static getSafeBreakPoints(element, canvasHeight, scale, selectors = DEFAULT_BREAK_SELECTORS, attributes = DEFAULT_BREAK_ATTRIBUTES) {
    const containerRect = element.getBoundingClientRect()
    const points = [0]
    selectors.forEach(sel => {
      const nodes = element.querySelectorAll(sel)
      nodes.forEach(node => {
        const rect = node.getBoundingClientRect()
        const bottom = Math.round((rect.bottom - containerRect.top) * (scale || 1))
        if (bottom > 0 && bottom < canvasHeight) points.push(bottom)
      })
    })

    if (attributes && attributes.length) {
      if (attributes.includes('data-break-after')) {
        const nodes = element.querySelectorAll('[data-break-after]')
        nodes.forEach(node => {
          const rect = node.getBoundingClientRect()
          const bottom = Math.round((rect.bottom - containerRect.top) * (scale || 1))
          if (bottom > 0 && bottom < canvasHeight) points.push(bottom)
        })
      }
      if (attributes.includes('data-break-before')) {
        const nodes = element.querySelectorAll('[data-break-before]')
        nodes.forEach(node => {
          const rect = node.getBoundingClientRect()
          const top = Math.round((rect.top - containerRect.top) * (scale || 1))
          if (top > 0 && top < canvasHeight) points.push(top)
        })
      }
      if (attributes.includes('data-break-safe')) {
        const nodes = element.querySelectorAll('[data-break-safe]')
        nodes.forEach(node => {
          const rect = node.getBoundingClientRect()
          const top = Math.round((rect.top - containerRect.top) * (scale || 1))
          const bottom = Math.round((rect.bottom - containerRect.top) * (scale || 1))
          if (top > 0 && top < canvasHeight) points.push(top)
          if (bottom > 0 && bottom < canvasHeight) points.push(bottom)
        })
      }
    }
    points.push(canvasHeight)
    const sorted = Array.from(new Set(points)).sort((a, b) => a - b)
    return sorted
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
      // 检查是否是导出的完整数据格式
      let resumeData = data
      if (data.resumeData) {
        resumeData = data.resumeData
      }

      // 检查必要的字段结构
      const requiredFields = ['personalInfo', 'workExperience', 'education', 'skills', 'projects']

      for (const field of requiredFields) {
        if (!(field in resumeData)) {
          return false
        }
      }

      // 检查personalInfo的基本结构
      if (typeof resumeData.personalInfo !== 'object') {
        return false
      }

      // 检查数组字段
      const arrayFields = ['workExperience', 'education', 'skills', 'projects']
      for (const field of arrayFields) {
        if (!Array.isArray(resumeData[field])) {
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
