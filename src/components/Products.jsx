import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';
import Loading from './Loading';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false); 
  const [selectedProductId, setSelectedProductId] = useState(null); 
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState(0);
  const [editProductCount, setEditProductCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);

        // Gerçek zamanlı güncellemeleri dinleme
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
          const updatedProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(updatedProducts);
        });

        // Component unmount olduğunda dinlemeyi durdur
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      // Confirm deletion
      if (!window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
        return; // Kullanıcı onayı iptal ettiyse işlemi durdur
      }
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Ürün Silindi");
    } catch (error) {
      console.log(error);
      toast.error("Ürün Silinirken bir hata oluştu");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };
  

  const handleOpenModal = (productId) => {
    const product = products.find(product => product.id === productId);
    setSelectedProductId(productId);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
    setEditProductCount(product.count);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false); 
  };

  const handleEditProduct = async () => {
    try {
      setLoading(true);
      const productRef = doc(db, 'products', selectedProductId);
      await updateDoc(productRef, {
        name: editProductName,
        price: editProductPrice,
        count: editProductCount
      });
      toast.success("Ürün güncellendi");
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating product: ', error);
      toast.error("Ürün güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };


  const calculateTotalAmount = () => {
    let total = 0;
    products.forEach(product => {
      total += product.price ;
    });
    return total;
  };

  const renderProducts = () => {
    return products.map(product => (
      <Grid key={product.id} item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: {product.price} $
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Count: {product.count}
            </Typography>
          </CardContent>
          <Stack direction="row" spacing={2} my={3} mx={3}>
            <Button variant="contained" color="success"
            onClick={() => handleOpenModal(product.id)}>
              Düzenle

            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(product.id)}
              > 
              Sil
            </Button>
          </Stack>
        </Card>
      </Grid>
    ));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {renderProducts()}
      </Grid>
      <Loading open={loading} />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Ürünü düzenle
          </Typography>
          <TextField
            fullWidth
            label="Ürün Adı"
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            fullWidth
            label="Fiyat"
            type="number"
            value={editProductPrice}
            onChange={(e) => setEditProductPrice(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            fullWidth
            label="Miktar"
            type="number"
            value={editProductCount}
            onChange={(e) => setEditProductCount(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button variant="contained" onClick={handleEditProduct} color="success">
              Kaydet
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Typography variant="h6">
          Toplam Tutar {calculateTotalAmount()}
        </Typography>
      </Box>
    </div>
  );
};

export default Products;
