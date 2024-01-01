//import logo from './img/tvm-header-logo.png';
//import './App.css';
import ObjectList from './components/ObjectList';
import DetailedObject from './components/DetailedObject';
import Home from './components/Home'
import { Route, Link, Routes} from 'react-router-dom';
import metLogo from './img/TheMetLogo.gif';
import NotFound from './components/NotFound';
import Invalid from './components/Invalid';

const App = () => {
  return (
      <div className='App'>
        <header className='App-header' style={{ marginBottom: 0 }}>
          <div style={{backgroundColor: '#E4002B'}}>
            <img src={metLogo} className='App-logo' alt='logo' 
            style={{display: 'block', margin: '0 auto', width: '300px', height: '50%'}}/>
              <h1 
                className='App-title'
                style={{ backgroundColor: '#E4002B', fontFamily: 'Times New Roman', textAlign: 'center', color: 'whitesmoke', marginBottom: 0}}>
                Welcome to the The Metropolitan Museum of Art
              </h1>
          </div>
        </header>
        {/* <br />
        <br /> */}
          <Routes>
          <Route path='/' element ={<Home/>}/>
          <Route path='/collection/page/:page'  element={<ObjectList/>} />
          <Route path='/collection/:id'  element={<DetailedObject/>} />
          <Route path='/404'  element={<NotFound/>} />
          <Route path='/400'  element={<Invalid/>} />
          </Routes>
      </div>
   
  );
};

export default App;