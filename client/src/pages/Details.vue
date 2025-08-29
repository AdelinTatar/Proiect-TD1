<template>
  <div v-if="product" class="product-details">
    <div class="card">
      <div class="image-section" v-if="product.image">
        <img :src="`http://localhost:4000${product.image}`" alt="Product Image" />
      </div>

      <div class="info-section">
        <h2>{{ product.name }}</h2>

        <p><strong>Preț:</strong> {{ product.price }} lei</p>
        <p><strong>Brand:</strong> {{ product.brand }}</p>
        <p><strong>Categorie:</strong> {{ product.category }}</p>
        <p><strong>Stoc:</strong> {{ product.stock }}</p>
        <p><strong>Rating:</strong> {{ product.rating }}</p>
        <p><strong>Descriere:</strong> {{ product.description }}</p>
        <p v-if="product.feature1"><strong>Caracteristică 1:</strong> {{ product.feature1 }}</p>
        <p v-if="product.feature2"><strong>Caracteristică 2:</strong> {{ product.feature2 }}</p>

        <div class="buttons">
          <button
            class="buy-btn"
            :disabled="product.stock <= 0"
            @click="buyProduct"
          >
            {{ product.stock > 0 ? "Cumpără" : "Nu poți achiziționa momentan" }}
          </button>

          <router-link :to="`/products/${product.id}/edit`">
            <button class="edit-btn">Edit</button>
          </router-link>
          <router-link to="/">
            <button class="back-btn">Înapoi</button>
          </router-link>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </div>

  <p v-else-if="loading">Se încarcă produsul...</p>
  <p v-else>Produsul nu a fost găsit.</p>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const message = ref("");

onMounted(async () => {
  await fetchProduct();
});

async function fetchProduct() {
  try {
    const res = await axios.get(`http://localhost:4000/products/${route.params.id}`);
    product.value = res.data;
  } catch (error) {
    console.error("Eroare la încărcarea produsului:", error);
  } finally {
    loading.value = false;
  }
}

async function buyProduct() {
  if (!product.value || product.value.stock <= 0) {
    message.value = "Nu poți achiziționa momentan.";
    return;
  }

  try {
    const updatedProduct = { ...product.value, stock: product.value.stock - 1 };
    await axios.put(`http://localhost:4000/products/${route.params.id}`, updatedProduct);

    product.value.stock -= 1;
    message.value = "Ai cumpărat produsul!";
  } catch (error) {
    console.error("Eroare la cumpărare:", error);
    message.value = "A apărut o problemă la achiziționare.";
  }
}
</script>

<style scoped>
.product-details {
  max-width: 800px;
  margin: 30px auto;
  padding: 10px;
}

.card {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-section {
  flex: 1 1 300px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.image-section img {
  max-width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.info-section {
  flex: 1 1 400px;
  padding: 20px;
}

.info-section h2 {
  margin-bottom: 15px;
  font-size: 1.8rem;
  color: #333;
}

.info-section p {
  margin: 5px 0;
  color: #555;
  font-size: 1rem;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 7px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.buy-btn {
  background-color: #ff9800;
  color: white;
}

.buy-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
}

.edit-btn:hover {
  background-color: #45a049;
}

.back-btn {
  background-color: #2196F3;
  color: white;
}

.back-btn:hover {
  background-color: #1976d2;
}

.message {
  margin-top: 15px;
  font-weight: bold;
  color: #333;
}
</style>