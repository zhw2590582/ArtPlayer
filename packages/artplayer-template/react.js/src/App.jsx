import Artplayer from './ArtPlayer.jsx'

function App() {
  return (
    <div>
      <Artplayer
        option={{
          url: 'https://artplayer.org/assets/sample/video.mp4',
          autoSize: true,
        }}
        style={{
          width: '600px',
          height: '400px',
          margin: '60px auto 0',
        }}
        getInstance={art => console.info(art)}
      />
    </div>
  )
}

export default App