<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Categories from "@/components/Categories.vue";

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

let response = ref('')
let categories = ref('')
let ListComplete = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/categories');
  categories.value = response.data['hydra:member'];
  ListComplete.value = response.data['hydra:member'];
});

var recherche = ref('')
function filter(){
  categories.value = ListComplete.value
  categories.value = categories.value.filter(category => category.name.includes(recherche.value))
}
</script>

<template>
  <h1>CategoriesPage</h1>
  <div class="wrapper">
    <div class="search>">
      <input v-model.trim="recherche" placeholder="Search category" @keyup="filter">
    </div>
    <div class="categories">
      <div class="list">
          <Categories v-for="category in categories"
                      :key="category.id"
                      :id="category.id"
                      :category="category.name"
                      :movies="category.movies"
          />
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