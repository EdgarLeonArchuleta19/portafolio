export default function SectionHeading({ index, title, hint }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="text-[13px] font-medium text-muted">{index}</span>
      <h2 className="font-display text-[clamp(26px,4vw,36px)] font-medium tracking-[-0.02em] text-fg">
        {title}
      </h2>
      <span className="h-px flex-1 bg-line" />
      {hint && (
        <span className="hidden whitespace-nowrap text-[13px] text-muted sm:inline">
          {hint}
        </span>
      )}
    </div>
  )
}