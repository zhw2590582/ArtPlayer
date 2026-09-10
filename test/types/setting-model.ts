import { findItem, formatTree, traverseTree, treeBinding } from '../../packages/artplayer/src/setting/model'

const item = { name: 'custom', payload: 42, selector: [{ name: 'child' }] }
const result = formatTree({ id: 0 }, [item])
const payload: number = result[0]!.payload
const binding = treeBinding(item)
const events: (() => void)[] = binding.events
const found = findItem(result, 'absent')
const nullable: typeof found | null = null
traverseTree(result, (node) => {
  const name: string | undefined = node.name
  void name
})
// @ts-expect-error A tree item can be missing; find must not promise a DOM node.
const element: HTMLElement = found
// @ts-expect-error Item names are strings.
formatTree({ id: 0 }, [{ name: 12 }])
// @ts-expect-error The generated-name counter is numeric.
formatTree({ id: '0' }, [item])
void [payload, events, nullable, element]
