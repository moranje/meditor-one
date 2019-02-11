const emphasized = /^[A-Z][a-zA-Z-/]*?[:/]/;

export default {
  defaultToken: 'text',

  tokenizer: {
    root: [
      [
        /^(?:Reden van komst|consult)[/:]?$/i,
        { token: 'heading', switchTo: '@reasonVisit' }
      ],
      [
        /(?:^Ambulance|Ambu)[/:]?$/i,
        { token: 'heading', switchTo: '@ambulance' }
      ],
      [
        /^(?:(?:Eerste opvang)|(?:Primary survey))(?: volgens ATLS)?[/:]?$/i,
        { token: 'heading', switchTo: '@primarySurvey' }
      ],
      [
        /^(?:Voorgeschiedenis|VG)[/:]?$/i,
        { token: 'heading', switchTo: '@history' }
      ],
      [
        /^(?:Medicatie|Med|Meds)[/:]?$/i,
        { token: 'heading', switchTo: '@medication' }
      ],
      [
        /^(?:Allergie(?:ë|e)n)[/:]?$/i,
        { token: 'heading', switchTo: '@allergies' }
      ],
      [
        /^(?:Intoxicaties|Intox)[/:]?$/i,
        { token: 'heading', switchTo: '@intoxications' }
      ],
      [/^(?:Anamnese|A)[/:]?$/i, { token: 'heading', switchTo: '@anamnesis' }],
      [
        /^(?:Heteroanamnese|HA)[/:]?$/i,
        { token: 'heading', switchTo: '@heteroAnamnesis' }
      ],
      [
        /^(?:(?:Neurologisch onderzoek)|NO)[/:]?$/i,
        { token: 'heading', switchTo: '@neurologicalExam' }
      ],
      [
        /^(?:(?:Lichamelijk onderzoek)|LO)[[/:]?$/i,
        { token: 'heading', switchTo: '@physicalExam' }
      ],
      [
        /^Secondary survey[/:]?$/i,
        { token: 'heading', switchTo: '@secondarySurvey' }
      ],
      [
        /^(?:(?:Aanvullend onderzoek)|AO)[/:]?$/i,
        { token: 'heading', switchTo: '@diagnostics' }
      ],
      [
        /^(?:(?:Conclusie)|C)[/:]?$/i,
        { token: 'heading', switchTo: '@conclusion' }
      ],
      [
        /^(?:(?:(?:Beleid|Behandeling)[^\\n]*)|B)[/:]?$/i,
        { token: 'heading', switchTo: '@treatment' }
      ],
      [/^(?:Decursus|Dec)[/:]?$/i, { token: 'heading', switchTo: '@course' }]
    ],

    reasonVisit: [{ include: '@root' }],
    ambulance: [{ include: '@root' }, [emphasized, 'emphasized']],
    primarySurvey: [{ include: '@root' }, [emphasized, 'emphasized']],
    history: [{ include: '@root' }],
    medication: [
      { include: '@root' },
      [
        /(\d+)(\s*)((?:k|d|c|m|µ|u|n|kilo|deci|centi|milli|micro|nano)?(?:g|gram|l|L|liter))/,
        ['number', 'text', 'emphasized']
      ]
    ],
    allergies: [{ include: '@root' }],
    intoxications: [{ include: '@root' }, [emphasized, 'emphasized']],
    anamnesis: [{ include: '@root' }],
    heteroAnamnesis: [{ include: '@root' }],
    neurologicalExam: [{ include: '@root' }],
    physicalExam: [{ include: '@root' }],
    secondarySurvey: [{ include: '@root' }],
    diagnostics: [{ include: '@root' }, [emphasized, 'emphasized']],
    conclusion: [{ include: '@root' }],
    treatment: [{ include: '@root' }],
    course: [{ include: '@root' }]
  }
};
