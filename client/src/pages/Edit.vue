<template>
  <div v-if="form" class="edit-container">
    <h2>Editează produsul</h2>
    <div class="product-edit">
      <div class="image-section">
        <div v-if="form.image">
          <p>Imagine curentă:</p>
          <img v-if="form.image" :src="`http://localhost:4000${form.image}`" alt="Imagine produs" class="product-img" />
        </div>
        <div>
          <label for="image">Schimbă imaginea:</label>
          <input id="image" type="file" @change="onFileChange" accept="image/*" />
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="form-section" enctype="multipart/form-data">
        <div class="form-group">
          <label for="name">Nume:</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="price">Preț:</label>
          <input id="price" v-model.number="form.price" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label for="brand">Brand:</label>
          <input id="brand" v-model="form.brand" type="text" />
        </div>

        <div class="form-group">
          <label for="category">Categorie:</label>
          <input id="category" v-model="form.category" type="text" />
        </div>

        <div class="form-group">
          <label for="stock">Stoc:</label>
          <input id="stock" v-model.number="form.stock" type="number" min="0" />
        </div>

        <div class="form-group">
          <label for="rating">Rating:</label>
          <input id="rating" v-model.number="form.rating" type="number" step="0.1" min="0" max="5" />
        </div>

        <div class="form-group">
          <label for="description">Descriere:</label>
          <textarea id="description" v-model="form.description"></textarea>
        </div>

        <div class="form-group">
          <label for="feature1">Caracteristică 1:</label>
          <input id="feature1" v-model="form.feature1" type="text" />
        </div>

        <div class="form-group">
          <label for="feature2">Caracteristică 2:</label>
          <input id="feature2" v-model="form.feature2" type="text" />
        </div>

        <button type="submit">Salvează modificările</button>
        <router-link :to="`/products/${route.params.id}`">
          <button type="button" class="back-btn">Înapoi la detalii</button>
        </router-link>
      </form>
    </div>
  </div>
  <p v-else>Se încarcă produsul...</p>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const form = reactive({
  name: '',
  price: null,
  brand: '',
  category: '',
  stock: 0,
  rating: 0,
  description: '',
  feature1: '',
  feature2: '',
  image: ''
});

const selectedFile = ref(null);

function onFileChange(event) {
  selectedFile.value = event.target.files[0];
}

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:4000/products/${route.params.id}`);
    Object.assign(form, res.data);
  } catch (error) {
    console.error(error);
    alert("Nu s-au putut încărca datele produsului.");
  }
});

async function onSubmit() {
  if (!form.name || form.price === null || form.price < 0) {
    alert("Completează toate câmpurile corect!");
    return;
  }

  try {
    const formData = new FormData();
    for (const key in form) {
      if (key !== 'image') formData.append(key, form[key]);
    }
    if (selectedFile.value) formData.append('image', selectedFile.value);

    await axios.put(`http://localhost:4000/products/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push(`/products/${route.params.id}`);
  } catch (error) {
    console.error(error);
    alert("Nu s-au putut salva modificările. Vezi consola pentru detalii.");
  }
}
</script>

<style scoped>
.edit-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 10px;
}

.product-edit {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.image-section {
  flex: 1;
  min-width: 200px;
}

.product-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.form-section {
  flex: 2;
  min-width: 300px;
}

.form-group {
  margin-bottom: 12px;
}

input,
textarea {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 6px 12px;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
  border: none;
  background-color: #3b82f6;
  color: white;
}

button.back-btn {
  background-color: #6b7280;
}
</style>
