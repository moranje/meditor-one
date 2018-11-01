import * as mathjs from 'mathjs';

import { history, medication } from '../../utils/text-format';

export function initActions(monaco, editor) {
  return [
    {
      id: 'save-document',
      label: 'Opslaan',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S // eslint-disable-line
      ],
      run: (...args) => editor.emitBeforeLeave(args)
    },

    {
      id: 'copy-selected',
      label: 'Copy',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C // eslint-disable-line
      ],
      run: () => {
        // editor?
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        // Strip zero-line characters from text when copying
        let stripped = selected.replace(`\u200B`, '');

        editor.executeEdits('', [{ range, text: stripped }]);
        editor.trigger('Copy', 'editor.action.clipboardCopyAction');
      }
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
      run: () => {
        // editor?
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        let meds = medication(selected);

        editor.executeEdits('', [{ range, text: meds }]);
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
      run: () => {
        // editor?
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        let meds = history(selected);

        editor.executeEdits('', [{ range, text: meds }]);
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
      run: () => {
        // editor?
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);

        let outcome = mathjs.eval(selected);

        if (!Number.isNaN(outcome)) {
          editor.executeEdits('', [{ range, text: `${outcome}` }]);
        }
      }
    }
  ];
}

export function initCommands(monaco, editor) {
  return [
    {
      keys: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_P, // eslint-disable-line
      action: (...args) =>
        this.editor.trigger('Command palette', 'editor.action.quickCommand')
    }
  ];
}
