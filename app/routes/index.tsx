import { Link } from 'remix';

export default function Index() {
  return (
    <div>
      <h1>Bookshelf</h1>
      <Link to="login">Login</Link>
    </div>
  );
}
