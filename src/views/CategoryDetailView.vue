<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router"

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const route = useRoute()
const id = route.params.id

let category = ref('')

onMounted(async () => {
  const responseCategories = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/categories/'+ id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  category.value = responseCategories.data
})
</script>

<template>
  <div>
    <div v-if="category">
      <h2>{{category.name}}</h2>
      <p>Movies :</p>
      <ul>
        <li v-for="movie in category.movies">{{movie.title}}</li>
      </ul>
    </div>
  </div>
</template>

