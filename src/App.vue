<template>
  <Painting @onSave="handleSave"></Painting>
</template>
<script setup lang="ts">
  const handleSave = (value: any) => {
    console.log('value', value);
    console.log('git commit');
  }
</script>
<style scoped>

</style>
