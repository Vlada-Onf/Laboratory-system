// components/componentPage/ComponentPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ComponentLayout from './../../components/component/ComponentLayout';
import { componentsMock } from '../../mock/componentsMock';
import PageWrapper from '../../components/layout/PaperWrapper';

const ComponentPage = () => {
  const { id } = useParams();
  const componentId = Number(id);

  const component = componentsMock.find(c => c.id === componentId);

  if (!component) {
    return <div>Компонент не знайдено</div>;
  }

  return (
    <PageWrapper>
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
    </PageWrapper>

  );
};

export default ComponentPage;
