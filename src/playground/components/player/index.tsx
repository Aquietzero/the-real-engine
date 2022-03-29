import * as React from 'react'
import classnames from 'classnames'

interface Props {
}

const audio = new Audio('assets/music/canon-in-d.mp3')
audio.autoplay = false
audio.loop = true

const { useEffect, useState } = React

export const Player: React.FC<Props> = (props: Props) => {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (playing) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [playing])

  return (
    <div
      className="fixed bottom-0 right-0 cursor-pointer m-2 flex justify-center"
      onClick={() => setPlaying(!playing)}
    >
      <span className="text-sm">Canon in D - Pachelbel</span>
      <div className="p-1 border-2 border-black rounded-full ml-1">
        <img
          className={classnames(playing && 'animate-spin')}
          width={10}
          height={10}
          src="assets/icons/music.svg"
        />
      </div>
    </div>
  )
}
