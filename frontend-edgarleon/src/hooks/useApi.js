import { useEffect, useState } from 'react'

export function useApi(loader) {
  const [result, setResult] = useState({ loader: null, data: null, error: null })

  useEffect(() => {
    let active = true

    loader().then(
      (data) => active && setResult({ loader, data, error: null }),
      (error) => active && setResult({ loader, data: null, error }),
    )

    return () => {
      active = false
    }
  }, [loader])

  const isResultFromCurrentLoader = result.loader === loader

  return {
    data: isResultFromCurrentLoader ? result.data : null,
    error: isResultFromCurrentLoader ? result.error : null,
    loading: !isResultFromCurrentLoader,
  }
}
