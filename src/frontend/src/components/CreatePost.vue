<template>
   <div >
       <!-- @{{ user.name }} -->
   </div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			formdata :{
				grant_type: 'authorization_code',
				client_id: 'u-s4t2ud-39cfad1d6f73c8c527bed1273cb6689ff7a806f4fae38fc551c6c2f3aa6cfa44',
				client_secret: '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',
				code: this.$route.query.code
				// redirect_uri: 'http://localhost:8080'
			},
		}
	},
	created() {
		console.log(this.$route.query.code),
		console.log( JSON.stringify(this.formdata)),
		axios.post('https://api.intra.42.fr/oauth/token', JSON.stringify(this.formdata))
			.then(response => console.log(response))
			.catch(error => console.log(error))
	}
}
</script>
<style lang="">
	
</style>