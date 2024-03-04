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
      <button>Edit</button>
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
.card {
  width: 15%;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
