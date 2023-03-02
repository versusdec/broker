export const getToken = () => {
  let cookies = {};
  if (document.cookie.split(';')[0] !== "") {
    document.cookie.split(';').forEach(item => {
      cookies[item.split('=')[0].trim()] = item.split('=')[1].trim()
    })
  }
  
  let token = cookies['__token'];
  
  return token
}