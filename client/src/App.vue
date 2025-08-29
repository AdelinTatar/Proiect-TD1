<template>
  <div>
    <header>
      <h1>Market Shop</h1>
      <nav>
        <router-link to="/">Acasă</router-link>
        <router-link to="/new" class="btn-new">+ Produs nou</router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

nav a {
  margin-left: 1rem;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>
