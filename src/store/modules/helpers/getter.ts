import _ from 'lodash';

export function find(records = [], key, value) {
  return records.find(record => record[key] === value);
}

export function findRecord(records = [], predicate) {
  return _.find(records, predicate);
}

export function findMany(records = [], relationships = {}) {
  const ids = Object.keys(relationships);

  return records.filter(record => ids.indexOf(record['.key']) !== -1);
}

export function findAll(records = []) {
  return records;
}

export function query(
  records = [],
  predicate,
  mapper?: (value: {}, index: number, array: {}[]) => {}
) {
  if (typeof mapper === 'function') {
    return _.filter(records, predicate).map(mapper);
  }

  return _.filter(records, predicate);
}
