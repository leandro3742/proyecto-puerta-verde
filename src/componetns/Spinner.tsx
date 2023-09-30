import { FadingBalls } from 'react-cssfx-loading'

const Spinner = () => {
  return (
    <main style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 1000
    }}>
      <FadingBalls />
    </main>
  )
}

export default Spinner