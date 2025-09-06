import Artplayer, { type Option } from 'artplayer'
import Player from './Player'

function getInstance(art: Artplayer) {
  console.log(art)
}

const style = {
  width: '800px',
  height: '600px',
  margin: '60px auto 0',
}

const option: Partial<Option> = {
  url: 'https://artplayer.org/assets/sample/video.mp4',
  autoSize: true,
}

function App() {
  return (
    <div>
      <Player
        style={style}
        option={option}
        getInstance={getInstance}
      />
    </div>
  )
}

export default App
