import Container from '../ui/Container'

export default function Footer({ ownerName }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line py-8">
      <Container className="text-center text-[13px] text-muted md:text-left">
        © {year} {ownerName || 'Portafolio'}
      </Container>
    </footer>
  )
}
