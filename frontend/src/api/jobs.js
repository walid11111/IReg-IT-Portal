import client from './client'

export const getJobs = () => client.get('/jobs/')