interface Action {
  command: any
  title?: string
}

export default function(): Action[] {
  return [
    {
      command: {},
    },
  ]
}
