import React from 'react';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';

const FilterContext = React.createContext<Filter[] | undefined>(undefined);

export default FilterContext;
