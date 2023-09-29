<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Actors from "@/components/Actors.vue";


let response = ref('')
let actors = ref('')
onMounted(async () => {
  const response = await axios.get('http://localhost:8080/symfonyS5/public/index.php/api/actors');
  actors.value = response.data['hydra:member'];
});

</script>

<template>
  <h1>ActorsPage</h1>
  <div class="wrapper">
    <div class="actors">
      <div class="list">
        <Actors v-for="actor in actors"
                :key="actor.id"
                :firstName="actor.firstName"
                :lastName="actor.lastName"
                :nationality="actor.nationality.nationality"
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
