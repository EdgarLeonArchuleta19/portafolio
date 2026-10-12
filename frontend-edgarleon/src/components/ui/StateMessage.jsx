import { useI18n } from '../../i18n'

const STATUS_CLASSES = {
  info: 'text-muted',
  loading: 'text-muted animate-pulse',
  error: 'text-error',
}

export default function StateMessage({ status = 'info', message }) {
  const { t } = useI18n()
  const text = status === 'loading' ? t('states.loading') : (message ?? t('states.empty'))

  return <p className={`py-6 text-sm ${STATUS_CLASSES[status]}`}>{text}</p>
}