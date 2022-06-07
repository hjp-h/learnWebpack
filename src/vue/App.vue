<template>
  <div>
    <h2>我是vue渲染出来的 --- {{title}}</h2>
    <child></child>
  </div>
</template>

<script>
import Child from './Child.vue'
export default {
  components: {
    Child
  },
  data() {
    return {
      title:'hello vue'
    }
  }
}
</script>

<style scoped>
h2{
  color:red
}
</style>
