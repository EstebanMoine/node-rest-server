const express = require('express')

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

let app = express()

let Producto = require('../models/producto')

var _ = require('underscore');



app.get('/producto', verificaToken, (req, res) => {

    Producto.find({})
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({}, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    productos
                })
            });

        })


})

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }

            res.json({
                ok: true,
                producto
            })

        })


})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')



    Producto.find({ nombre: regex })
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }

            res.json({
                ok: true,
                producto
            })

        })


})

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre',
        'precioUni',
        'descripcion',
        'disponible',
        'categoria',
        'usuario'
    ]);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })


})

app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id

    Producto.findByIdAndRemove(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })


    // Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB
    //     })

    // })


})


module.exports = app;