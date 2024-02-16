import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// export const appLink = "http://localhost:3000"
export const appLink = window.location.origin;

function App() {
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      {/* <div>
        <Footer/>
      </div> */}
    </div>
  );
}

export default App;
