// import axios from 'axios'
//
// async function getAuthService() {
//     const response = await axios.get('/auth')
//     return response.data
// }
//
// const authService = getAuthService()
//
// export async function requireAuth(to, from, next) {
//     const token = localStorage.getItem('token')
//     if (!token) {
//         next({
//             name: 'TmpLogin'
//         })
//     } else {
//         try {
//             const { username } = await authService.verifyToken(token)
//             if (!username) {
//                 throw new Error('Invalid token')
//             }
//             next()
//         } catch (error) {
//             console.error(error)
//             next({
//                 name: 'TmpLogin'
//             })
//         }
//     }
// }
