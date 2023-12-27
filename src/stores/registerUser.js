import { defineStore } from 'pinia'
import axios from 'axios'
export const useRegisterUserStore = defineStore('registerUserStore', {
    state: () => {
        return {
            // PAGE INFO
            pageInfo: {
                STORE_URL: 'http://localhost:8080/api/register'
            },
        }
    },
    actions: {
        async store (data) {
            try {
                const response = await axios.post(this.pageInfo.STORE_URL, data)
                // RETURN REQUEST
                return response.data
            } catch (error) {
                console.log('my eerorr', error)
                throw error.response.data
            }
        }
    },
    getters: {
    }
})
