import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Rating from '@material-ui/lab/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, addToFavorites, deleteFromFavorites } from '../Redux/actions';
import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Button from "@material-ui/core/Button";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export default function Productcard({ id, price, name, description, img, rating, quantity }) {
 //  console.log(1111, id)
  const dispatch = useDispatch()

  //let stock = quantity
  //const [cartItem, setCardItem] = useState(0)
  const _id = id
  let myProduct = {_id, name, price, img, rating, quantity}  
  const functionToAddProductsToMyCart = ()=> {  
    dispatch(addCart(myProduct)) 
  }

  const { favoriteItems } = useSelector(state=> state)
  useEffect(() => {
  }, [favoriteItems])
  
  
   let showHeart = new Array 
  favoriteItems.forEach(x=> x !== null ? showHeart.push(x) : null)


  let boolean = showHeart.find(x=> x._id === _id)
  
 

  const addMyFavoriteProduct = (e)=> {  
    e.preventDefault()    
    dispatch(addToFavorites(myProduct))   
  }
  const deleteMyFavoriteProduct = ()=> {

    let find = favoriteItems.some(x=> x._id === myProduct._id)
    const deleteItem = favoriteItems.find(x=> x._id === myProduct._id)
    if(find){
      dispatch(deleteFromFavorites(deleteItem))
    } else console.log('hubo un problema')


  }




  return (

    <Card sx={{ maxWidth: 345 }}>     
    
      <CardHeader
      
        action={
           <IconButton >          
            
            {
              boolean === undefined ? <FavoriteBorder onClick={(e)=> addMyFavoriteProduct(e)}/> : <FavoriteIcon onClick={deleteMyFavoriteProduct}/>
            }  

            
          </IconButton>         
        }

        
        title={
          <Link to={`/product/${id}`} style={{ textDecoration: "none" }}>
            {name}
          </Link>}
        subheader={
          <Typography variant="body2" color="text.secondary">
            ${price.toFixed(2)}
          </Typography>}
      />

      <CardMedia
        component="img"
        height="194"
        image={img}
        alt="myProduct"
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>


      <CardActions disableSpacing>

        <IconButton aria-label="addShop">
          <AddShoppingCartIcon onClick={functionToAddProductsToMyCart}/>
        </IconButton>

        <Rating name="half-rating-read" value={rating} precision={0.5} readOnly />
      </CardActions>

    </Card>
  );
}
