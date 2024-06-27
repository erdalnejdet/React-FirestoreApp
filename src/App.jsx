import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import AddProduct from './components/AddProduct'
import Products from './components/Products'
import PageContainer from './components/PageContainer';
function App() {


  return (
    <>
    <PageContainer>
    <AddProduct/>
    <Products/>
    <ToastContainer/>
    </PageContainer>
    </>
  )
}

export default App
