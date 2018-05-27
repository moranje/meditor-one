import store from '@/store';

export class Language {
  monaco: any;
  type: string;
  private completionProviders: any;
  private $store: any;
  constructor(type, monaco) {
    this.type = type;
    this.monaco = monaco;

    monaco.languages.register({ id: type });
    // { scope: ['status', 'snippet'] }
    this.refreshCompletions(item => item.scope.indexOf(this.type) !== -1, {
      name: 'default'
    });
  }

  set theme(theme) {
    this.monaco.editor.defineTheme(this.type, theme);
  }

  set syntax(syntax) {
    this.monaco.languages.setMonarchTokensProvider(this.type, syntax);
  }

  refreshCompletions(
    predicate,
    { mapper, name }: { mapper?: Function; name: string }
  ) {
    if (!name) name = 'default';

    if (this.completionProviders[name]) {
      this.completionProviders[name].dispose();
      this.completionProviders[name] = null;
    }

    this.completionProviders[
      name
    ] = this.monaco.languages.registerCompletionItemProvider(this.type, {
      provideCompletionItems: () => {
        return store.getters.queryCompletions(predicate, mapper);
      }
    });
  }
}
