<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Categories from "@/components/Categories.vue";
import {useRouter} from "vue-router";

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
const apiUrl = import.meta.env.VITE_API_URL;
const router = useRouter();


let response = ref('')
let name = ref('')
let categories = ref('')
let movies = ref('')
let movie = ref('')
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

    const responseMovies = await axios.get(apiUrl +'/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    movies.value = responseMovies.data;
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

const AddCategory = async () => {
  try {
    console.log('addCategory');
    const token = localStorage.getItem('user-token');
    if (!token) {
      // Rediriger l'utilisateur vers la page de connexion
      router.push('/login');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ld+json',
    };

    console.log(name.value);
    console.log(movie.value);

    const addCategory = {
      name: name.value,
      movie: movie.value,
    };

    await axios.post(apiUrl + `/categories`, addCategory, {headers});

    getCategories();
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
  }
};

var recherche = ref('')
function filter(){
  categories.value = ListComplete.value
  categories.value = categories.value.filter(category => category.name.includes(recherche.value))
}
</script>

<template>
  <h1>CategoriesPage</h1>
  <div class="wrapper">
    <div class="search d-flex">
      <input class="form-control me-2" v-model.trim="recherche" placeholder="Search category" @keyup="filter">
    </div>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Add Category
    </button>
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
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Category</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="AddCategory">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name : </label>
                <input v-model="name" class="input-group-text" type="text" id="name" required>
              </div>
              <div class="form-group">
                <label for="movies">Movies : </label>
                <select v-model="movie" required>
                  <option v-for="movie in movies" id="movie" :key="movie.id" :value="movie.id">{{ movie.title }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
            </div>
          </form>
        </div>
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