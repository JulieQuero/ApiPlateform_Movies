<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Categories from "@/components/Categories.vue";

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
const apiUrl = import.meta.env.VITE_API_URL;

let response = ref('')
let categories = ref('')
let ListComplete = ref('')

const getCategories = async () => {
  try {
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }
    const response = await axios.get(apiUrl +'/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    categories.value = response.data;
    ListComplete.value = response.data;
  } catch (error) {
    console.error('Error', error);
    console.log(error.response?.data?.code);
    if (error.response?.data?.code === 401) {
      // Détruire le token
      localStorage.removeItem('token');
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
    }
  }
};

onMounted(() => {
  getCategories();
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