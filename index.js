const Contenedor = require('./contenedor')

const express = require('express')
const puerto = 8080
const app = express()

const obj = new Contenedor('productos.txt')

app.listen(puerto, () => {
    console.log(`Servidor iniciado en puerto: ${puerto}`)
})

app.get('/productos', async (req, res) => {
    let productos = await obj.getAll() 
    console.log(productos)
    res.send(productos)
})

app.get('/productoRandom', async (req, res) => {
    let producto = await obj.getRandomProduct()
    res.send(producto)
    
})