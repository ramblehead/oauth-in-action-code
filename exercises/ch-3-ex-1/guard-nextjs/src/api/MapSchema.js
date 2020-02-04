// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable no-underscore-dangle */

import { mixed, string } from 'yup';
import { inherits } from 'util';
import runValidations from 'yup/lib/util/runValidations';

const MixedSchema = mixed;

/**
 * @typedef { import("yup").Ref } Ref
 */

/**
 * @template T
 * @typedef { import("yup").Schema<T> } Schema
 */

/**
 * @template T
 * @typedef { import("yup").InferType<T> } InferType
 */

/**
 * @template V
 * @typedef { { [ key : string ]: V } } Map
 */

/**
 * @template V
 * @typedef { Schema<Map<V>> | Ref } Result
 */

/**
 * @template V
 * @param {any} keySchema
 * @param {V} valueSchema
 * @return {Result<InferType<V>>}
 */
export default function MapSchema(keySchema, valueSchema) {
  if(!(this instanceof MapSchema)) return new MapSchema(keySchema, valueSchema);

  MixedSchema.call(this, { type: 'map' });

  this.key = keySchema || string();
  this.value = valueSchema || mixed();
}

inherits(MapSchema, MixedSchema);

Object.assign(MapSchema.prototype, {
  _typeCheck(value) {
    return value && typeof value === 'object';
  },

  _cast(_value, options) {
    const value = MixedSchema.prototype._cast.call(this, _value, options);

    const result = {};
    Object.entries(value).forEach(([key, aValue]) => {
      result[this.key.cast(key)] = this.value.cast(aValue);
    });

    return result;
  },

  _validate(_value, options = {}) {
    const errors = [];
    const { abortEarly, sync, path = '' } = options;

    let originalValue =
      options.originalValue != null ? options.originalValue : _value;

    let promise = MixedSchema.prototype._validate
      .call(this, _value, options);

    if(!abortEarly) {
      promise = promise.catch((err) => {
        errors.push(err);
        return err.value;
      });
    }

    return promise.then((value) => {
      if(!this._typeCheck(value)) {
        if(errors.length) throw errors[0];
        return value;
      }

      originalValue = originalValue || value;

      const validations = [];
      Object.entries(value).forEach(([field, fieldValue]) => {
        const innerOptions = {
          ...options,
          strict: true,
          parent: value,
          path: path ? `${path}.${field}` : field,
          originalValue: originalValue[field],
        };

        validations.push(
          this.key.validate(field, innerOptions),
          this.value.validate(fieldValue, innerOptions),
        );
      });

      return runValidations({
        sync,
        path,
        value,
        errors,
        validations,
        endEarly: abortEarly,
      });
    });
  },
});
