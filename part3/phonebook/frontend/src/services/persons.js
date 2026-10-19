import axios from 'axios'
const baseUrl = '/api/contacts'

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  const response = await request
    return response.data
}

const update = async (id, newObject) => {
  const request = axios.patch(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = async (id, newObject) => {
  const request = axios.delete(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll, 
  create, 
  update,
  remove
}