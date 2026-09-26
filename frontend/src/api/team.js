import client from './client'

export const getTeamMembers = () => client.get('/team/')