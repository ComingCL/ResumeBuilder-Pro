<template>
  <div id="app" class="min-h-screen font-sans text-gray-700 antialiased">
    <router-view />
  </div>
</template>

<script setup>
// 主应用组件，使用 router-view 来渲染路由组件
</script>

<style>
/* 保留一些必要的全局样式 */
html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  background-color: #f5f7fa;
}
</style>