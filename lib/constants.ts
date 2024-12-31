export const isDevelopment = process.env.NODE_ENV === 'development'
export const SITE_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://resumecreator.connorbernard.com' 

export const BASE_URL = isDevelopment
  ? 'http://localhost:5001'
  : 'https://connorsresumebuilder.com' 