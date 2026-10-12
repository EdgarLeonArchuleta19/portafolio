export default function SkillTags({ skills }) {
  if (!skills?.length) return null

  return (
    <ul className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <li
          key={skill.documentId ?? skill.id}
          className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted"
        >
          {skill.name}
        </li>
      ))}
    </ul>
  )
}
