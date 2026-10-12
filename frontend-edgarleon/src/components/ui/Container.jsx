const WIDTHS = {
  wide: 'max-w-[1080px]',
  narrow: 'max-w-[760px]',
}

export default function Container({ width = 'wide', className = '', children }) {
  return <div className={`mx-auto w-full px-6 ${WIDTHS[width]} ${className}`}>{children}</div>
}
