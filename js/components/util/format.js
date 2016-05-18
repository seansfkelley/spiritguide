import _ from 'lodash';

const ASCII_TO_ENTITY = {
  '1/4' : '\u00bc',
  '1/2' : '\u00bd',
  '3/4' : '\u00be',
  '1/8' : '\u215b',
  '3/8' : '\u215c',
  '5/8' : '\u215d',
  '7/8' : '\u215e',
  '1/3' : '\u2153',
  '2/3' : '\u2154'
}
const ENTITY_TO_ASCII = _.invert(ASCII_TO_ENTITY);

const ASCII_FRACTION_REGEX  = new RegExp(_.keys(ASCII_TO_ENTITY).join('|'), 'g');
const ENTITY_FRACTION_REGEX = new RegExp(_.keys(ENTITY_TO_ASCII).join('|'), 'g');

export function fractionify(s) {
  return s ? s.replace(ASCII_FRACTION_REGEX, match => ASCII_TO_ENTITY[match]) : null;
}

export function defractionify(s) {
  return s ? s.replace(ENTITY_FRACTION_REGEX, match => ENTITY_TO_ASCII[match]) : null;
}
