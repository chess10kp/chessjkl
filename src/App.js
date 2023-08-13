import './App.css';
import Board from './components/Board.js'
import Container from "./components/container/Container.js"


function App() {
  return (
    <div className="App">
      <Container>
      <Board></Board>
      </Container>
    </div>
  );
}

export default App;
