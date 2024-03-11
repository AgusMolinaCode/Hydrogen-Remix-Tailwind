// SortHome.js
import React from 'react';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';

import FilterContext from '../context/FilterContext';

type Props = {
  filters: Filter[];
  children: React.ReactNode;
};

const SortHome: React.FC<Props> = ({filters, children}) => {
  // Ahora puedes usar los filtros aquí

  return (
    <FilterContext.Provider value={filters}>
      {/* Los componentes hijos pueden acceder a los filtros a través del Contexto */}
      {children}
    </FilterContext.Provider>
  );
};

export default SortHome;
