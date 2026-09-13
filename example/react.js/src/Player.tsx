import type { Option } from 'artplayer'
import type { HTMLAttributes } from 'react'
import Artplayer from 'artplayer'
import { useEffect, useRef } from 'react'
import { playerOptions } from './player-options'

export interface PlayerProps extends HTMLAttributes<HTMLDivElement> {
  option: Partial<Option>
  getInstance?: (art: Artplayer) => void
}

export default function Player({ option, getInstance, ...rest }: PlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current)
      return

    const art = new Artplayer(playerOptions(option, containerRef.current))

    try {
      if (typeof getInstance === 'function') {
        getInstance(art)
      }
    }
    catch (error) {
      try {
        art.destroy(false)
      }
      finally {
        // Keep the consumer's error even if teardown also fails.
        // eslint-disable-next-line no-unsafe-finally
        throw error
      }
    }

    return () => {
      art.destroy(false)
    }
  }, [option, getInstance])

  return <div ref={containerRef} {...rest}></div>
}
