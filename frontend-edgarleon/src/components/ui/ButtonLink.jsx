const VARIANTS = {
  primary: 'bg-accent font-medium text-on-accent transition-opacity hover:opacity-90',
  outline: 'border border-line2 text-fg transition-colors hover:border-accent hover:text-accent',
  subtle: 'border border-line2 text-muted transition-colors hover:border-accent hover:text-accent',
  accent:
    'border border-accent/50 font-medium text-accent transition-colors hover:bg-accent hover:text-on-accent',
}

export default function ButtonLink({ href, variant = 'outline', external = false, children }) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-md px-[18px] py-3 text-sm duration-200 ${VARIANTS[variant]}`}
      {...externalProps}
    >
      {children}
    </a>
  )
}
