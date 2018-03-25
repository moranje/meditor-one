export function find(records = [], key, value) {
  return records.find(record => record[key] === value);
}

export function findMany(records = [], relationships = {}) {
  const ids = Object.keys(relationships);
  return records.filter(record => ids.indexOf(record['.key']) !== -1);
}

export function findAll(records = []) {
  return records;
}
