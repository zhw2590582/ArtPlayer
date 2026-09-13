interface SampleBlock {
  samples: Float32Array
  next?: SampleBlock
}

export class SampleQueue {
  private head?: SampleBlock
  private tail?: SampleBlock
  private offset = 0
  private size = 0

  get length(): number {
    return this.size
  }

  push(input: Float32Array): void {
    if (input.length === 0)
      return
    const block: SampleBlock = { samples: new Float32Array(input) }
    if (this.tail)
      this.tail.next = block
    else
      this.head = block
    this.tail = block
    this.size += input.length
  }

  take(count: number): Float32Array | null {
    if (!Number.isSafeInteger(count) || count <= 0)
      throw new RangeError('Sample count must be a positive safe integer')
    if (count > this.size)
      return null

    const output = new Float32Array(count)
    let written = 0
    while (this.head && written < count) {
      const samples = this.head.samples
      const amount = Math.min(samples.length - this.offset, count - written)
      output.set(samples.subarray(this.offset, this.offset + amount), written)
      written += amount
      this.offset += amount
      if (this.offset === samples.length) {
        this.head = this.head.next
        this.offset = 0
      }
    }
    if (!this.head)
      this.tail = undefined
    this.size -= count
    return output
  }

  clear(): void {
    this.head = undefined
    this.tail = undefined
    this.offset = 0
    this.size = 0
  }
}
