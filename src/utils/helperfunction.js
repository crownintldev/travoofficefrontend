export const capitalizeCamelSpace = name => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
  return capitalized.replace(/([A-Z])/g, ' $1').trim()
}

export const axiosErrorMessage = err =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : 'An unexpected error occurred'

export const isAllSameinArray = (dataArray, name) => {
  if (dataArray.length === 0) return false // or true, based on how you want to treat an empty array

  const firstElementName = dataArray[0][name]
  return dataArray.every(item => item[name] === firstElementName)
}
