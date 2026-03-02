import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded){
    return <header>Завантажуємо...</header>;
  }

  return (
    <header style={{ padding: '1rem', background: '#f0f0f0' }}>
      {user ? (
        <>
          <span>{user.firstName}</span>
          <UserButton />
        </>
      ) : (
        <button onClick={() => navigate('/sign-in')}>Вхід</button>
      )}
    </header>
  );
}
