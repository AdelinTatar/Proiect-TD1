<template>
  <div class="new-product">
    <h2>Adaugă produs nou</h2>
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div>
        <label for="name">Nume:</label>
        <input id="name" v-model="form.name" type="text" placeholder="Nume" required />
      </div>

      <div>
        <label for="price">Preț:</label>
        <input id="price" v-model.number="form.price" type="number" min="0" placeholder="Preț" required />
      </div>

      <div>
        <label for="brand">Brand:</label>
        <input id="brand" v-model="form.brand" type="text" placeholder="Brand" />
      </div>

      <div>
        <label for="category">Categorie:</label>
        <input id="category" v-model="form.category" type="text" placeholder="Categorie" />
      </div>

      <div>
        <label for="stock">Stoc:</label>
        <input id="stock" v-model.number="form.stock" type="number" min="0" placeholder="Stoc" />
      </div>

      <div>
        <label for="rating">Rating:</label>
        <input id="rating" v-model.number="form.rating" type="number" step="0.1" min="0" max="5" placeholder="Rating" />
      </div>

      <div>
        <label for="description">Descriere:</label>
        <textarea id="description" v-model="form.description" placeholder="Descriere"></textarea>
      </div>

      <div>
        <label for="feature1">Caracteristică suplimentară 1:</label>
        <input id="feature1" v-model="form.feature1" type="text" placeholder="Caracteristică 1" />
      </div>

      <div>
        <label for="feature2">Caracteristică suplimentară 2:</label>
        <input id="feature2" v-model="form.feature2" type="text" placeholder="Caracteristică 2" />
      </div>

      <div>
        <label for="image">Imagine produs:</label>
        <input id="image" type="file" @change="onFileChange" accept="image/*" />
      </div>

      <button type="submit">Adaugă produs</button>
    </form>

    <router-link to="/">Înapoi la listă</router-link>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

    await axios.post('http://localhost:4000/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push('/');
  } catch (error) {
    console.error("Eroare la adăugarea produsului:", error);
    alert("Nu s-a putut adăuga produsul. Vezi consola pentru detalii.");
  }
}
</script>

<style scoped>
.new-product {
  max-width: 400px;
  margin: 20px auto;
}

.new-product form div {
  margin-bottom: 10px;
}

.new-product input,
.new-product textarea {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
