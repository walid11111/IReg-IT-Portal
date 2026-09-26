import client from './client'

export const getTechnologies = () => client.get('/technologies/')