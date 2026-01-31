// components/componentPage/ComponentPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ComponentLayout from './../../components/component/ComponentLayout'; // імпорт лейаута
import { componentsMock } from '../../mock/componentsMock';

const ComponentPage = () => {
  const { id } = useParams();           // id з роуту, тип string
  const componentId = Number(id);       // приводимо до числа

  // шукаємо компонент по id
  const component = componentsMock.find(c => c.id === componentId);

  if (!component) {
    return <div>Компонент не знайдено</div>;
  }

  // передаємо усі необхідні дані в ComponentLayout
  return (
    <ComponentLayout
      name={component.name}
      image={component.image}
      description={component.description}
      price={component.price}
      quantity={component.quantity}
      burntQuantity={component.burntQuantity}
      category={component.category}
      tags={component.tags}
    />
  );
};

export default ComponentPage;
