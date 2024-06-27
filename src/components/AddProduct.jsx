// src/AddProduct.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { TextField, Button,  Typography, Grid, Box } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCount, setProductCount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!productName.trim() || !productPrice.trim() || !productCount.trim() ){
        toast.error('Boş Bırakılamaz');
        return;
    }
    try {
      await addDoc(collection(db, 'products'), {
        name: productName,
        price: parseFloat(productPrice),
        count:productCount
      });
      setProductName('');
      setProductPrice('');
      setProductCount('');
      toast.success('Başarıyla Eklendi');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (

      <Box mt={5} mb={5}>
        <Typography variant="h4" gutterBottom>
          Ürün Ekle
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Adı"
                variant="outlined"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Fiyatı"
                type="number"
                variant="outlined"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Adet"
                type="number"
                variant="outlined"
                value={productCount}
                onChange={(e) => setProductCount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Ekle
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

  );
};

export default AddProduct;
