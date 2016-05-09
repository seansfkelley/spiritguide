import React from 'react';
import { BASE_LIQUORS } from './definitions';

const {
  arrayOf,
  oneOf,
  oneOfType,
  shape,
  string
} = React.PropTypes;

export const measuredIngredient = shape({
  displayIngredient: string.isRequired,
  displayUnit: string,
  displayAmount: string,
  tag: string
});

export const recipe = shape({
  name: string.isRequired,
  base: oneOfType([
    oneOf(BASE_LIQUORS),
    arrayOf(oneOf(BASE_LIQUORS))
  ]).isRequired,
  ingredients: arrayOf(measuredIngredient).isRequired,
  instructions: string.isRequired,
  notes: string,
  source: string,
  url: string // May want to do validation on the syntax here?
});
