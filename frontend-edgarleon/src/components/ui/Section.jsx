import Container from './Container'

export default function Section({ id, children }) {
  return (
    <section id={id} className="border-t border-line py-20 md:py-24">
      <Container>{children}</Container>
    </section>
  )
}
