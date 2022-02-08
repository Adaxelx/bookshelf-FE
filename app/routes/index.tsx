import { Button, Container } from 'react-bootstrap';
import { Link } from 'remix';

export default function Index() {
  return (
    <Container className="w-100 vh-100 flex-column d-flex align-items-center justify-content-center">
      <h1 className="text-4xl">Bookshelf</h1>
      <div>
        <Button as={Link} to="login" className="me-1">
          Logowanie
        </Button>
        <Button as={Link} to="register">
          Rejestracja
        </Button>
      </div>
    </Container>
  );
}
