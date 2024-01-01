import Home from './components/Home'
import Collection from './components/Collection';
import ComicList from './components/ComicList';
import Comic from './components/DetailedComic';
import UserErrorPage from './components/UserErrorPage';
import NoComicErrorPage from './components/NoComicErrorPage';
import ApiErrorPage from './components/ApiErrorPage';
import {Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Marvel from './img/Marvel.png'

const App = () => {

  const selectedCollection = useSelector((state) => state.selection)
  const allCollections = useSelector((state) => state.collections)
  const currCollection = allCollections.find((collection) => collection.collectionName === selectedCollection[0].collectionName)

  return (
    <div className='App'>
      <header className='App-header' style={{ margin: 0 }}>
        <div style={{backgroundColor: '#FF171F'}}>
        <img src={Marvel} className='App-logo' alt='logo' 
            style={{display: 'block', margin: '0 auto', width: '300px', height: '50%'}}/>
        </div>
        <p style={{margin: '0 auto', 
            textAlign: 'center', 
            padding: '5px', 
            fontFamily: 'Benton Sans Extra Comp Black', 
            fontSize: '20px',
            fontWeight: 'bolder',
            border: 'solid',
            }}> 
        {selectedCollection && (selectedCollection.length > 0)
            ? `Current Collection: ${selectedCollection[0].collectionName} | Comics Present: ${currCollection.collection.length}`
            : ``}</p>
      </header>
      <Routes>
          <Route path='/' element ={<Home/>}/>
          <Route path='/marvel-comics/collections' element={<Collection/>} />
          <Route path='/marvel-comics/page/:pagenum' element={<ComicList/>} />
          <Route path='/marvel-comics/:id' element={<Comic/>} />
          <Route path='/400' element={<UserErrorPage/>} />
          <Route path='/404' element={<NoComicErrorPage/>} />
          <Route path='/500' element={<ApiErrorPage/>} />
      </Routes>
    </div>
  )
}

export default App;