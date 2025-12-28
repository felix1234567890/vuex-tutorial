<template>
  <div class="empty-state">
    <p><slot>No products available at the moment.</slot></p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  color: #666;
}
</style>
