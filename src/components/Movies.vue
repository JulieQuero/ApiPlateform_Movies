<script setup>
defineProps({
  id: {
    type: Number,
  },
  title: {
    type: String,
    default: 'Title'
  },
  description: {
    type: String,
    default: 'Description'
  },
  releaseDate: {
    type: String,
    default: 'releaseDate'
  },
  duration: {
    type: String,
    default: 'Duration'
  },
  category: {
    type: String,
    default: 'Category'
  },
  actors: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
    <div class="movie card">
      <routerLink :to="'/movie-detail/'+id">
      <h2>{{ title }}</h2>
      <p>Description : {{ description }}</p>
      <p>Release Date : {{ releaseDate }}</p>
      <p>Duration : {{ duration }}</p>
      <p>Category : {{ category }}</p>
      <p>Actors :</p>
      <ul>
        <li v-for="actor in actors" :key="actor.id">
          {{ actor.firstName }} {{ actor.lastName }}
        </li>
      </ul>
      </routerLink>
    </div>
</template>

<style scoped>
.movie {
  width: 300px;
  height: 500px;
  margin: 1rem;
}
.movie a {
  width: 100%;
  height: 100%;
  padding: 1rem;
}
</style>
