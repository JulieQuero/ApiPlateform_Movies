<script setup>
defineProps({
  id: {
    type: Number,
  },
  firstName: {
    type: String,
    default: 'firstName'
  },
  lastName: {
    type: String,
    default: 'lastName'
  },
  nationality: {
    type: String,
    default: 'nationality'
  },
  movies: {
    type: Array,
    default: 'nationality'
  },

})
</script>

<template>
    <div class="actor card">
      <routerLink :to="'/actor-detail/'+id">
      <h2>{{ firstName }} {{ lastName }}</h2>
      <p>{{nationality}}</p>
      <p>Movies :</p>
      <ul>
        <li v-for="movie in movies" :key="movie.id">
          {{ movie.title }}
        </li>
      </ul>
      </routerLink>
    </div>
</template>

<style scoped>
.actor {
  width: 300px;
  height: 500px;
  margin: 1rem;
}
.actor a {
  width: 100%;
  height: 100%;
  padding: 1rem;
}
</style>
