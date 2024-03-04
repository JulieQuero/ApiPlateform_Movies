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

let actor = ref('')

onMounted(async () => {
  const responseActors = await axios.get(
      'http://localhost:8080/symfonyS5/public/index.php/api/actors/'+ id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
  )
  actor.value = responseActors.data
})
</script>

<template>
  <div>
    <div v-if="actor">
      <h2>{{actor.firstName}} {{actor.lastName}}</h2>
      <p>Nationality : {{actor.nationality.nationality}}</p>
      <p>Birth Date : <!--{{actor.birthDate}}--></p> <!-- TODO : fix date -->
      <p>Movies :</p>
      <ul>
        <li v-for="movie in actor.movies">{{movie.title}}</li>
      </ul>
    </div>
  </div>
</template>

