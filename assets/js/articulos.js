const productos = [
    {
        id: 'p1',
        nombre: 'Pancho Salchi Clásico',
        descripcion: 'Salchicha tipo viena, lluvia de papas y aderezos tradicionales.',
        precio: 3500,
        categoria: 'Panchos',
        imagen: 'https://www.eltrecetv.com.ar/resizer/v2/pancho-46-la-pancheria-que-se-convirtio-en-leyenda-con-un-combo-de-clientes-famosos-y-gente-al-paso-GHJ6Z6QX6ZHT5KMC4V7UQCXB4E.jpg?auth=ba2e8d2f723e14b5681f90865f802c746643fd58924023ef90c8dad3971d27f5&width=767'
    },
    {
        id: 'p2',
        nombre: 'Pancho Loki Cheddar',
        descripcion: 'Salchicha tipo viena, cheddar fundido y lluvia de papas.',
        precio: 4300,
        categoria: 'Panchos',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgMkI6OQLO3IfCXRqSLRHnJ99U6NDe6uP60A&s',
        maximoExtrasSeleccionados: 6,
        extras: [
            { id: "extra-cheddar", nombre: "Extra cheddar", precio: 800, cantidadMaxima: 3 },
            { id: "extra-bacon", nombre: "Bacon", precio: 1000, cantidadMaxima: 2 }
        ]
    },
    {
        id: 'p3',
        nombre: 'Pancho Patitas',
        descripcion: 'Salchicha, salsa criolla, papas pay y aderezos.',
        precio: 4700,
        categoria: 'Panchos',
        imagen: 'https://as1.ftcdn.net/jpg/03/05/52/00/1000_F_305520073_RhoHCnNU0DZp8TTgwh9gb0sBpXM74afL.jpg',
        maximoExtrasSeleccionados: 5,
        extras: [
            { id: "extra-criolla", nombre: "Salsa criolla extra", precio: 500, cantidadMaxima: 2 }
        ]
    },
    {
        id: 'p4',
        nombre: 'Pancho Gran Loki',
        descripcion: 'Salchicha alemana, doble cheddar, bacon y verdeo.',
        precio: 6800,
        categoria: 'Panchos',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSghag3lhdrT7QesvVPBvMtGE60aVjLl4HwlQ&s'
    },

    {
    id: 'h1',
    nombre: 'Burger Colita Feliz',
    descripcion: 'Medallón de carne, queso, lechuga, tomate y salsa.',
    precio: 7000,
    categoria: 'Hamburguesas',
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
    ingredientesRemovibles: ["Lechuga", "Queso", "Tomate", "Salsa"]
},
{
    id: 'h2',
    nombre: 'Burger Loki Doble',
    descripcion: 'Doble carne, doble queso y salsa especial.',
    precio: 9500,
    categoria: 'Hamburguesas',
    imagen: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop',
    maximoExtrasSeleccionados: 8,
    ingredientesRemovibles: ["Queso", "Salsa"],
    extras: [
        { id: "extra-medallon", nombre: "Medallón extra", precio: 2200, cantidadMaxima: 3 },
        { id: "extra-cheddar", nombre: "Extra cheddar", precio: 800, cantidadMaxima: 4 }
    ]
},
{
    id: 'h3',
    nombre: 'Burger Salchilover BBQ',
    descripcion: 'Carne, cheddar, panceta y salsa barbacoa.',
    precio: 10500,
    categoria: 'Hamburguesas',
    imagen: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1200&auto=format&fit=crop',
    ingredientesRemovibles: ["Cheddar", "Panceta", "Salsa BBQ"]
},
{
    id: 'h4',
    nombre: 'Burger Dachshund Veggie',
    descripcion: 'Medallón veggie, rúcula, tomate y salsa alioli.',
    precio: 8500,
    categoria: 'Hamburguesas',
    imagen: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1200&auto=format&fit=crop',
    ingredientesRemovibles: ["Rúcula", "Tomate", "Salsa alioli"]
},

    {
        id: 'hel1',
        nombre: 'Helado 1 KG',
        descripcion: 'Elegí hasta 4 sabores.',
        precio: 12000,
        categoria: 'Helados',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuec1-wWrRHXBPF7YDERuAzkble_WN_MVQiA&s',
        maximoExtrasSeleccionados: 4,
        extras: [
            { id: "sabor-chocolate", nombre: "Chocolate", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-dulce-leche", nombre: "Dulce de leche", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-frutilla", nombre: "Frutilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-limon", nombre: "Limón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-vainilla", nombre: "Vainilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-granizado", nombre: "Granizado", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-menta", nombre: "Menta granizada", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-sambayon", nombre: "Sambayón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-pistacho", nombre: "Pistacho", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-crema-americana", nombre: "Crema americana", precio: 0, cantidadMaxima: 1 }
        ]
    },
    {
        id: 'hel2',
        nombre: 'Helado 1/2 KG',
        descripcion: 'Elegí hasta 3 sabores.',
        precio: 7000,
        categoria: 'Helados',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLAH69EysaQ4ZOmVUxvWytd2y6-ye5nxF8IA&s',
        maximoExtrasSeleccionados: 3,
        extras: [
            { id: "sabor-chocolate", nombre: "Chocolate", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-dulce-leche", nombre: "Dulce de leche", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-frutilla", nombre: "Frutilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-limon", nombre: "Limón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-vainilla", nombre: "Vainilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-granizado", nombre: "Granizado", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-menta", nombre: "Menta granizada", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-sambayon", nombre: "Sambayón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-pistacho", nombre: "Pistacho", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-crema-americana", nombre: "Crema americana", precio: 0, cantidadMaxima: 1 }
        ]
    },
    {
        id: 'hel3',
        nombre: 'Helado 1/4 KG',
        descripcion: 'Elegí hasta 3 sabores.',
        precio: 4200,
        categoria: 'Helados',
        imagen: 'https://acdn-us.mitiendanube.com/stores/001/178/413/products/pote-1-4-kk-telgopor-a9ec266c1b54fb564417149998652819-1024-1024.webp',
        maximoExtrasSeleccionados: 3,
        extras: [
            { id: "sabor-chocolate", nombre: "Chocolate", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-dulce-leche", nombre: "Dulce de leche", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-frutilla", nombre: "Frutilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-limon", nombre: "Limón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-vainilla", nombre: "Vainilla", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-granizado", nombre: "Granizado", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-menta", nombre: "Menta granizada", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-sambayon", nombre: "Sambayón", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-pistacho", nombre: "Pistacho", precio: 0, cantidadMaxima: 1 },
            { id: "sabor-crema-americana", nombre: "Crema americana", precio: 0, cantidadMaxima: 1 }
        ]
    },

    {
        id: 'b1',
        nombre: 'Coca-Cola',
        descripcion: 'Gaseosa Coca-Cola fría.',
        precio: 2500,
        categoria: 'Bebidas',
        imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 'b2',
        nombre: 'Sprite',
        descripcion: 'Gaseosa Sprite fría.',
        precio: 2500,
        categoria: 'Bebidas',
        imagen: 'https://jumboargentina.vtexassets.com/arquivos/ids/791793/Gaseosa-Sprite-Lima-Lim-n-2-25lts-Gaseosa-Sprite-Lima-lim-n-2-25-Lt-2-248213.jpg?v=638291793630230000'
    },
    {
        id: 'b3',
        nombre: 'Agua Mineral',
        descripcion: 'Botella de agua mineral.',
        precio: 1800,
        categoria: 'Bebidas',
        imagen: 'https://dam.elcorteingles.es/producto/www-001013343800069-00.jpg'
    },
    {
        id: 'b4',
        nombre: 'Agua Saborizada',
        descripcion: 'Agua saborizada fría.',
        precio: 2200,
        categoria: 'Bebidas',
        imagen: 'https://alberdisa.vteximg.com.br/arquivos/ids/174018/Agua-Saborizada-Aquarius-Manzana-1500-cc.png?v=638146554991030000',
        maximoExtrasSeleccionados: 1,
        extras: [
            { id: "B4manzana", nombre: "Manzana", precio: 0, cantidadMaxima: 1 },
            { id: "B4pomelo", nombre: "Pomelo", precio: 0, cantidadMaxima: 1 },
            { id: "B4naranja", nombre: "Naranja", precio: 0, cantidadMaxima: 1 }
        ]
    },
    {
        id: 'b5',
        nombre: 'Fanta',
        descripcion: 'Gaseosa Fanta fría.',
        precio: 2500,
        categoria: 'Bebidas',
        imagen: 'https://www.casa-segal.com/wp-content/uploads/2020/03/fanta-naranja.png'
    },

    {
        id: 'pa1',
        nombre: 'Papas Patitas',
        descripcion: 'Papas fritas crocantes.',
        precio: 4500,
        categoria: 'Papas y Nuggets',
        imagen: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 'pa2',
        nombre: 'Papas Loki Cheddar',
        descripcion: 'Papas fritas con cheddar fundido.',
        precio: 5800,
        categoria: 'Papas y Nuggets',
        imagen: 'https://f.fcdn.app/imgs/568aa3/rudyburgers.com/rudyuy/9140/original/catalogo/009003_009003_1/2000-2000/papas-fritas-cheddar-papas-fritas-cheddar.jpg'
    },
    {
        id: 'pa3',
        nombre: 'Papas Salchi Bacon',
        descripcion: 'Papas fritas con cheddar y bacon.',
        precio: 6800,
        categoria: 'Papas y Nuggets',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRkpKKE3_ptYS3TAi1r0tiu8_dF90eslTMUQ&s'
    },
    {
        id: 'pa4',
        nombre: 'Papas Dachshund',
        descripcion: 'Papas fritas con ajo y perejil.',
        precio: 5200,
        categoria: 'Papas y Nuggets',
        imagen: 'https://er-s3-prod.s3.fr-par.scw.cloud/foo_f722157c7a.webp'
    },
    {
        id: 'ng1',
        nombre: 'Nuggets Loki',
        descripcion: 'Nuggets de pollo crocantes.',
        precio: 5500,
        categoria: 'Papas y Nuggets',
        imagen: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200&auto=format&fit=crop'
    },

    {
        id: 'po1',
        nombre: 'Flan Casero',
        descripcion: 'Flan casero con dulce de leche.',
        precio: 3500,
        categoria: 'Postres',
        imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 'po2',
        nombre: 'Brownie Chocolate',
        descripcion: 'Brownie húmedo de chocolate.',
        precio: 4000,
        categoria: 'Postres',
        imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: 'po3',
        nombre: 'Chocotorta',
        descripcion: 'Porción de chocotorta clásica.',
        precio: 4500,
        categoria: 'Postres',
        imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop'
    }
];