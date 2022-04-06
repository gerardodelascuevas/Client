import { Button, Grid, Card } from "@mui/material";
import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { getAllBrand, getAllCategories } from "../Redux/actions"
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Swal from 'sweetalert2'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import { makeStyles } from "@mui/styles";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const Input = styled('input')({
    display: 'none',
});
function getStyles(name, text, theme) {
    return {
        fontWeight:
            text.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const useStyles = makeStyles({
    container: {
        display: 'grid'
    },
    card: {
        backgroundColor: 'rgb(173, 184, 175)',
        boxShadow: '0 5px 5px rgb(0,0,0,0.1)',
        borderRadius: '5px',
        border: 'solid 1px black',
        alignSelf: "center"

    }
})


export default function Formulario() {
    const clases = useStyles()
    const navigate = useNavigate()
    const { categories, brands } = useSelector(state => state)
    const dispatch = useDispatch()
    const [progress, setProgress] = useState(0);
    const formHandler = (e) => {
        e.preventDefault();
        let file = e.target[0].files[0];
        // uploadFiles(file);
    };

    const pushToImagen = (e) => {
        setImg([...imagen, e])
    }

    const uploadFiles = (file) => {
        if (!file) return;
        const sotrageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImg([...imagen, downloadURL])
                });
            }
        );
    };

    const [imagen, setImg] = useState([])
    useEffect(() => {
        let token = window.localStorage.getItem('token');
        let config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        axios.get('http://localhost:3000/api/users/admin/verify', config)
            .then(res => {
                //console.log(res.data)
            }).catch(err => {
                console.log(err)
                return navigate('/')
            })
    }, [imagen, navigate])

    const theme = useTheme();
    const formik = useFormik({
        onSubmit: async (valores, { resetForm }) => {
            if (imagen.length >= 1) {
                valores.img = imagen
            }
            let infoproduct = await axios.post("http://localhost:3000/api/products/create", valores)
            if (infoproduct.data.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })

            } else {
                Swal.fire({
                    icon: "success",
                    title: 'Producto cargado con éxito',
                })
                resetForm("")
                setImg([])
            }
        },
        initialValues: {
            name: "",
            description: "",
            price: "",
            quantity: "",
            img: [],
            category: [],
            brand: "",
            image: []
        },
        validate: (valores) => {
            let errors = {}

            if (!valores.name) {
                errors.name = "Por favor ingrese un nombre"
            }

            if (!valores.description) {
                errors.description = "Por favor ingrese una descripción"
            }

            if (!valores.price) {
                errors.price = "Por favor ingrese un precio de venta"
            } else if (valores.price > 1000000000 || valores.price < 1) {
                errors.price = "¿Está seguro de publicar a ese precio?"
            } else if (!/^[0-9.]{1,10}$/.test(valores.price)) {
                errors.price = "Solo puedes ingrsar números, los decimales van con punto ( . )"
            }

            if (!valores.quantity) {
                errors.quantity = "Por favor ingrese una cantidad"
            } else if (valores.quantity > 1000000000) {
                errors.quantity = "¿Está seguro de poseer ese stock?"
            } else if (!/^[0-9]{1,10}$/.test(valores.quantity)) {
                errors.quantity = "Solo puede ingresar números "
            }

            if (!valores.category[0]) {
                errors.category = "Selecciona al menos una categoría"
            }

            if (!valores.brand) {
                errors.brand = "Selecciona al menos una marca"
            }

            return errors
        }

    })

    useEffect(() => {
        dispatch(getAllCategories())
        dispatch(getAllBrand())
    }, [])

    return (<div>
        <div>
            <form onSubmit={formik.handleSubmit}>

                <TextField
                    style={{ marginTop: "100px" }}
                    fullWidth
                    id="name"
                    name="name"
                    label="Nombre Producto"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                />
                <TextField
                    style={{ marginTop: "20px" }}
                    fullWidth
                    id="description"
                    name="description"
                    label="Descripción Producto"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                   helperText={formik.touched.description && formik.errors.description}
                    onBlur={formik.handleBlur}
                />
                <TextField
                    style={{ marginTop: "20px" }}
                    fullWidth
                    id="price"
                    name="price"
                    label="Precio Producto"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                   helperText={formik.touched.price && formik.errors.price}
                    onBlur={formik.handleBlur}
                />


                <TextField
                    style={{ marginTop: "20px" }}
                    fullWidth
                    id="quantity"
                    name="quantity"
                    label="Cantidad de Stock"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    onBlur={formik.handleBlur}
                />
                <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                        style={{ marginTop: "20px" }}
                        fullWidth
                        id="img"
                        name="img"
                        label="Imágen producto"
                        value={formik.values.img}
                        onChange={formik.handleChange}
                        error={formik.touched.img && Boolean(formik.errors.img)}
                       helperText={formik.touched.img && formik.errors.img}
                        onBlur={formik.handleBlur}
                    />
                    <Button
                        style={{ backgroundColor: "black", color: 'white', borderRadius: '5px', width: "200px" }}
                        color="primary"
                        variant="contained"
                        backgroud-color="black"
                        onClick={() => pushToImagen(formik.values.img)
                        }
                    >
                        ADD IMAGE URL
                    </Button>

                </Stack>


                <Stack style={{ display: "flex" }} spacing={2}>
                    <label style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Input
                            multiple
                            hidden={false}
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            name="image"
                            onChange={(event) => {
                                formik.setFieldValue("image", event.currentTarget.files[0]);
                            }} className="form-control" />

                        <IconButton style={{ backgroundColor: "black", color: 'white', borderRadius: '5px', margin: "10px" }} color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />

                        </IconButton>
                        <h5>Uploading done {progress}%</h5>
                        <Button
                            style={{ backgroundColor: "black", color: 'white', borderRadius: '5px', width: "200px", marginLeft: "20px" }}
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={() => uploadFiles(formik.values.image)}
                        >
                            UPLOAD IMAGE
                        </Button>
                    </label>
                </Stack>


                <Grid container spacing={1} style={{ display: "fex", justifyContent: "center" }}>
                    {
                        imagen.length > 0 ?
                            <Card
                                style={{ display: "flex", color: 'white', borderRadius: '5px', justifyContent: "center", flexDirection: "column" }}
                                sx={{ width: 350 }} className={clases.card}>{
                                    imagen.map(e => {
                                        return <div>
                                            <img src={e} alt="firebase-img" style={{ width: "200px", height: "200px" }} />
                                        </div>
                                    })
                                }
                                <Button style={{ backgroundColor: "black", color: 'white', borderRadius: '5px', margin: "10px" }}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => setImg([])}
                                >
                                    Quitar imágenes
                                </Button>
                            </Card>

                            : <></>

                    }

                </Grid>



                <FormControl style={{ marginTop: "20px" }} sx={{ m: 10, width: 500 }}>
                    <InputLabel id="demo-multiple-chip-label">Categorías</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        //helperText={formik.touched.category && formik.errors.category}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>

                        )}
                        MenuProps={MenuProps}
                    >
                        {categories.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, formik.values.category, theme)}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl style={{ margin: "20px" }} sx={{ m: 10, width: 500 }}>
                    <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        name="brand"
                        error={formik.touched.brand && Boolean(formik.errors.brand)}
                       // helperText={formik.touched.brand && formik.errors.brand}
                    >
                        {brands.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, formik.values.brand, theme)}

                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button style={{ backgroundColor: "black", color: 'white', borderRadius: '5px' }} color="primary" variant="contained" fullWidth type="submit">
                    Submit
                </Button>

            </form>
        </div>

    </div >)
} 