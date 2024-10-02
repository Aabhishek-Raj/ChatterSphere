import axios from "axios"

const apiService = {
  get: async function (url: string): Promise<any> {
    
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.NODE_SERVER}${url}`)
    })
    
    
  }
}

export default apiService
