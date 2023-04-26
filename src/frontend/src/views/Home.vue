<script lang="ts">
import Nav from '../components/Nav.vue'
import {useUserStore} from "@/store/user.store";

export default {
  components: {
    Nav
  },
  setup() {
      const user = useUserStore()
      return { user }
    }
}
</script>

<template>
    <div>
        <Nav />
        <header></header>
        <main>
            <div>
                <h1>Welcome, {{ user.name }}</h1>
                <h1>id: {{ user.id }}</h1>
                <p>Email: {{ user.email }}</p>
            </div>
        </main>
    </div>
</template>

<style scoped></style>
