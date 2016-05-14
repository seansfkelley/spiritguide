import _ from 'lodash';
import util from 'util';
import revalidator from 'revalidator';

_.extend(revalidator.validate.defaults, {
  validateFormats: true,
  validateFormatsStrict: true,
  validateFormatExtensions: true,
  additionalProperties: false,
  cast: false
});


export const REQUIRED_STRING = {
  type: 'string',
  required: true
};

export const OPTIONAL_STRING = {
  type: 'string',
  required: false
};

export function validateOrThrow(object, schema) {
  const validation = revalidator.validate(object, schema);
  if (!validation.valid) {
    throw new Error('validation failed: \n' + util.inspect(validation.errors));
  }
}
