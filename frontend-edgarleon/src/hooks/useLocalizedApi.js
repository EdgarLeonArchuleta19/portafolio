import { useCallback } from 'react'
import { useApi } from './useApi'
import { useI18n } from '../i18n'

export function useLocalizedApi(fetcher, param) {
  const { locale } = useI18n()
  const loader = useCallback(() => fetcher(locale, param), [fetcher, locale, param])
  return useApi(loader)
}
