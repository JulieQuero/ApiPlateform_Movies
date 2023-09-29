<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Categories from "@/components/Categories.vue";

let response = ref('')
let categories = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/categories');
  categories.value = response.data['hydra:member'];
});

</script>

<template>
  <h1>CategoriesPage</h1>
  <div class="wrapper">
    <div class="categories">
      <div class="list">
          <Categories v-for="category in categories" :key="category.id" :category="category.name" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
</style>