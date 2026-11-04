import axios from 'axios'
const baseUrl = '/api/login'

const login = async (request) => {
    const response = await axios.post(baseUrl, request)
    return response.data
}

export default { login }