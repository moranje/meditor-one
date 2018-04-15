function addActions(editor, actions = []) {
  actions.forEach(action => {
    editor.addAction(action);
  });
}

export default function initActions(monaco, self) {
  const ACTIONS = [
    {
      id: 'save-document',
      label: 'Opslaan',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S // eslint-disable-line
      ],
      run: (...args) => self.emitBeforeLeave(args)
    },
    {
      id: 'format-medication',
      label: 'Medicatie opschonen',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M
        )
      ],
      run: editor => {
        // Format logic
        return null;
      }
    },
    {
      id: 'format-history',
      label: 'Voorgeschiedenis opschonen',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_H
        )
      ],
      run: editor => {
        // Format logic
        return null;
      }
    },
    {
      id: 'calculate',
      label: 'Bereken',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B
        )
      ],
      run: editor => {
        // Format logic
        return null;
      }
    }
  ];

  addActions(self.editor, ACTIONS);
}
