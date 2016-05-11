import React from 'react';
import { BASE_LIQUORS, UNASSIGNED_BASE_LIQUOR } from '../definitions';

const LEGAL_BASE_LIQUORS = BASE_LIQUORS.concat([ UNASSIGNED_BASE_LIQUOR ]);

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
  canonicalName: string.isRequired,
  sortName: string.isRequired,
  base: oneOfType([
    oneOf(LEGAL_BASE_LIQUORS),
    arrayOf(oneOf(LEGAL_BASE_LIQUORS))
  ]).isRequired,
  ingredients: arrayOf(measuredIngredient).isRequired,
  instructions: string.isRequired,
  notes: string,
  source: string,
  url: string // May want to do validation on the syntax here?
});
