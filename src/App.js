import './App.css';
import Board from './components/Board.js'
import PlayerSideBar from './components/ui/Player.js'
import Container from "./components/container/Container.js"


function App() {
  return (
    <div className="App">
      <Container>
      <Board></Board>
      <PlayerSideBar></PlayerSideBar>
      </Container>
    </div>
  );
}

export default App;
