<script setup>
defineProps({
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
  },
})
</script>

<template>
    <div class="movie card">
      <button>Edit</button>
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
    </div>
</template>

<style scoped>
.card {
  width: 15%;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
