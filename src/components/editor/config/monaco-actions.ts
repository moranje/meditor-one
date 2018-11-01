import * as mathjs from 'mathjs';

import { history, medication, medicationHix } from '../utils/text-format';

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
      id: 'copy-selected',
      label: 'Copy',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C // eslint-disable-line
      ],
      run: editor => {
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        // Strip zero-line characters from text when copying
        let stripped = selected.replace(`\u200B`, '');

        editor.executeEdits('', [{ range, text: stripped }]);
        self.editor.trigger('Copy', 'editor.action.clipboardCopyAction');
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
      run: editor => {
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        let meds = medication(selected);

        editor.executeEdits('', [{ range, text: meds }]);
      }
    },
    {
      id: 'format-medication-hix',
      label: 'Medicatie opschonen (HIX)',
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_H
        )
      ],
      run: editor => {
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);
        let meds = medicationHix(selected);

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
      run: editor => {
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
      run: editor => {
        let range = editor.getSelection();
        let selected = editor.getModel().getValueInRange(range);

        let outcome = mathjs.eval(selected);

        if (!Number.isNaN(outcome)) {
          editor.executeEdits('', [{ range, text: `${outcome}` }]);
        }
      }
    }
  ];

  addActions(self.editor, ACTIONS);
}
