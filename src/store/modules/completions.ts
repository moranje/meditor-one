import { dbCompletionsRef } from '../../firebase-config';
import { create, remove, update } from './helpers/action';
import { find, query } from './helpers/getter';

type Completion = {
  label: string;
  kind: any;
  scope: string[];
  insertText?: string | { value: string };
};

const $state: { completions: Completion[] } = {
  completions: []
};

const getters = {
  // Convenience, use mapState instead?
  completions: ({ completions }: { completions: Completion[] }) => completions,

  findCompletion: ({ completions }: { completions: Completion[] }) => (
    key,
    value
  ) => {
    if (!completions) return null;

    return find(completions, key, value);
  },

  queryCompletions: ({ completions }: { completions: Completion[] }) => (
    predicate,
    mapper?
  ) => {
    if (!completions) return [];

    return query(completions, predicate, mapper);
  }
};

const mutations = {};

const actions = {
  createCompletion: (
    { completions }: { completions: Completion[] },
    completion: Completion
  ) => {},

  updateCompletion: (
    { completions }: { completions: Completion[] },
    { id: number, completion: Completion }
  ) => {},

  removeCompletion: (
    { completions }: { completions: Completion[] },
    id: number
  ) => {}
};

export default {
  state: $state,
  getters,
  mutations,
  actions
};
