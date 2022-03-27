import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../Redux/actions";
import { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Menu from "./Menu"

import Paginado from "./Paginado";
import Card from "./Card"
import Grid from '@mui/material/Grid';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 100,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
    },

}));


export default function Home() {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllProducts())
    }, [])



    const { product } = useSelector(state => state)

    const classes = useStyles();

    let productToShow = new Array
    product.forEach(x => {
        if (x.quantity !== 0) {
            productToShow.push(x)
        }
    })


    return (
        <div >

            <Menu />
            <Grid container spacing={2} />
            <div className={classes.root}> 
            {
                (product.length !== 0) ?
                    productToShow.map((e, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3}
                            key={index}>
                            <Card
                                rating={e.rating}
                                id={e._id}
                                sku={e.sku}
                                name={e.name}
                                description={e.description}
                                price={e.price}
                                quantity={e.quantity}
                                isOnStock={e.isOnStock}
                                img={e.img}
                                category={e.category}
                                __v={e.__v} />
                        </Grid>

                    )) : <></>}

            {/* <Paginado /> */}

            </div>
        </div>
    )
}
