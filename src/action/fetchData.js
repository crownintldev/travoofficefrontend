import toast from 'react-hot-toast'

export const fetchActionData = async (apiFunc, setState, toastify) => {
  try {
    const res = await apiFunc()
    setState(res.data.data)
    if (toastify) {
      toast.success(res.data.message)
    }
  } catch (err) {
    console.log('===========', err)

    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'An unexpected error occurred'
    if (toastify) {
      toast.error(errorMessage)
    }
    // setState([]); // Reset state in case of error
  }
}
