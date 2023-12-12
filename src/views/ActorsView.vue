<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Actors from "@/components/Actors.vue";


let response = ref('')
let actors = ref('')
let ListComplete = ref('')
let data = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/actors');
  actors.value = response.data['hydra:member'];
  ListComplete.value = response.data['hydra:member'];
});

var recherche = ref('')
function filter(){
  actors.value = ListComplete.value
  actors.value = actors.value.filter(actor => actor.lastName.includes(recherche.value))
}
</script>

<template>
  <h1>ActorsPage</h1>
  <div class="wrapper">
    <div class="search>">
      <input v-model.trim="recherche" placeholder="Search actor" @keyup="filter">
    </div>
    <div class="actors">
      <div class="list">
        <Actors v-for="actor in actors"
                :key="actor.id"
                :id="actor.id"
                :firstName="actor.firstName"
                :lastName="actor.lastName"
                :nationality="actor.nationality.nationality"
                :movies="actor.movies"
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
