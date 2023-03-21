<template>
  <div >
    <a class="text-3xl " href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-39cfad1d6f73c8c527bed1273cb6689ff7a806f4fae38fc551c6c2f3aa6cfa44&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&response_type=code">Login</a>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
	data() {
		return {
			formdata :{
				grant_type: 'authorization_code',
				client_id: 'u-s4t2ud-39cfad1d6f73c8c527bed1273cb6689ff7a806f4fae38fc551c6c2f3aa6cfa44',
				client_secret: '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',
				code: this.$route.query.code,
				redirect_uri: 'http://localhost:8080/'
			},
		}
	},
	created() {
		axios.post('https://api.intra.42.fr/oauth/token', this.formdata)
			.then((response) => {
				localStorage.setItem('token', response.data.access_token);
				})
			.catch(error => console.log(error))
	}
}
</script>