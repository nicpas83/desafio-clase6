fs = require('fs')

class Contenedor {

    constructor(fileName) {
        this.fileName = fileName;
    }

    async save(product) {

        let contentFile = this.getAll();

        if (contentFile.length > 0) {
            let lastId = this.getLastId(contentFile);
            product.id = lastId + 1;
        } else {
            product.id = 1;
        }

        contentFile.push(product);

        let newContentFile = JSON.stringify(contentFile);
        console.log('Guardando el nuevo producto...');

        try {
            await fs.promises.writeFile(this.fileName, newContentFile)
            console.log('Producto guardado exitosamente con ID:', product.id);

        }
        catch (error) {
            console.log('Ocurrió un error al intentar grabar el archivo', error)
        }
    }

    async getById(id) {
        let data = null;
        let contentFile = await this.getAll();

        if (contentFile.length > 0) {
            contentFile.forEach(function (product) {
                if (product.id == id) {
                    data = product;
                }
            })
        }
        return data;
    }

    async getAll() {
        try {
            let data = [];
            let contentFile = await fs.promises.readFile(this.fileName, 'utf-8');
            if (contentFile.length > 0) {
                data = JSON.parse(contentFile);
            }
            // console.log(data)
            return data;
        }
        catch (error) {
            console.log('Error de lectura: ', error)
        }
    }

    deleteById(id) {

        if (this.getById(id)) {
            let data = this.getAll();
            let newData = JSON.stringify(data.filter(product => product.id != id));

            try {
                fs.writeFileSync(this.fileName, newData)
                console.log('El producto fue eliminado...')
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log('El producto que intenta eliminar no existe')
        }
    }

    deleteAll() {
        fs.unlink(this.fileName, error => {
            if(error){
                console.log('No fue posible borrar los productos del archivo.')
            }else{
                console.log('Los productos del archivo fueron eliminados.')
            }
        });
    }


    getLastId(contentFile) {
        let ids = contentFile.map(object => {
            return object.id
        })

        return Math.max(...ids)
    }

    async getRandomProduct(){

        let products = await this.getAll()
        let max = products.length
        let min = 1
        let randomId = Math.floor(Math.random() * (max - min + 1) + min)

        let randomProduct = await this.getById(randomId)
        console.log(randomProduct)

        return randomProduct
        console.log(randomId)
    }
}

module.exports = Contenedor




// INSTANCIO LA CLASE.
const contenedor = new Contenedor('productos.txt');


// EJEMPLO PRODUCTO NUEVO.
let productoNuevo = {
    title: 'TV 42 pulgadas',
    price: 1600,
    thumbnail: 'url de la TV'
}


// GRABAR UN NUEVO PRODUCTO EN EL ARCHIVO-
//contenedor.save(productoNuevo);

//LEER LOS PRODUCTOS
// console.log(contenedor.getAll())

// LEER PRODUCTO SEGUN ID.
//console.log(contenedor.getById(33));

// BORRAR UN PRODUCTO DEL ARCHIVO SEGUN ID.
//contenedor.deleteById(3);

//BORRAR TODOS LOS PRODUCTOS DEL ARCHIVO.
// contenedor.deleteAll();
