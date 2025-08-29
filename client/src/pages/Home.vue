<template>
  <div class="home-container">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Caută produse..."
      class="search-input"
    />

    <select v-model="sortOption" class="sort-select">
      <option value="">Sortează...</option>
      <option value="price-asc">Preț crescător</option>
      <option value="price-desc">Preț descrescător</option>
      <option value="stock-asc">Stoc crescător</option>
      <option value="stock-desc">Stoc descrescător</option>
    </select>

    <div class="gallery">
      <div
        v-for="product in sortedProducts"
        :key="product.id"
        class="product-card"
      >
        <img
          v-if="product.image"
          :src="`http://localhost:4000${product.image}`"
          alt="Product"
          class="product-img"
        />

        <h3 @click="$router.push(`/products/${product.id}`)" class="clickable">
          {{ product.name }}
        </h3>

        <p><strong>Preț:</strong> {{ product.price }} lei</p>
        <p><strong>Stoc:</strong> {{ product.stock }}</p>

        <div class="buttons">
          <router-link :to="`/products/${product.id}/edit`">
            <button>Edit</button>
          </router-link>
          <button @click="deleteProduct(product.id)" class="delete-btn">
            Șterge
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const products = ref([]);
const searchQuery = ref("");
const sortOption = ref("");

onMounted(async () => {
  const res = await axios.get("http://localhost:4000/products");
  products.value = res.data;
});

const filteredProducts = computed(() => {
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const sortedProducts = computed(() => {
  let sorted = [...filteredProducts.value];
  switch (sortOption.value) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "stock-asc":
      sorted.sort((a, b) => a.stock - b.stock);
      break;
    case "stock-desc":
      sorted.sort((a, b) => b.stock - a.stock);
      break;
  }
  return sorted;
});

async function deleteProduct(id) {
  if (!confirm("Sigur vrei să ștergi acest produs?")) return;
  await axios.delete(`http://localhost:4000/products/${id}`);
  products.value = products.value.filter((p) => p.id !== id);
}
</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 10px;
  text-align: center;
}

.search-input,
.sort-select {
  padding: 6px 10px;
  margin: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.product-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
  color: #2563eb;
}

.buttons {
  margin-top: 10px;
}

button {
  padding: 6px 12px;
  margin: 5px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
}

button.delete-btn {
  background-color: #dc2626;
}
</style>
