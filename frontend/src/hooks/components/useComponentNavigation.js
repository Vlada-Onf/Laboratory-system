import { useNavigate } from 'react-router-dom';

export const useComponentNavigation = () => {
  const navigate = useNavigate();

  const goToComponentPage = (id) => {
    navigate(`/components/${id}`);
  };

  return { goToComponentPage };
};
