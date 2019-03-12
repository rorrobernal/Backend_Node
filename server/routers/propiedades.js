const express = require('express');
const fs = require('fs');
const path = require('path');
const data = require(path.join(__dirname, '../Storage/data/data.json'));
const _ = require('underscore');

let router = express.Router();

router.get('/ciudades', (req, res, next) => {
    let ciudades = _.keys(_.groupBy(data, d => {
        return d.Ciudad;
    }));

    res.json(ciudades);
});

router.get('/tipos', (req, res, next) => {
    let tipos = _.keys(_.groupBy(data, d => {
        return d.Tipo;
    }));

    res.json(tipos);
});

router.get('/propiedades', (req, res, next) => {
    if(_.isEmpty(req.query)) {
        res.json(data);
    } else {
        let resultado = [];
        let json = JSON.parse(JSON.stringify(data));
        if(req.query.ciudad !== 'Escoge una ciudad'){
            resultado = _.where(json, {Ciudad: req.query.ciudad});
        }

        if(req.query.tipo !== 'Escoge un tipo'){
            resultado = _.where(_.isEmpty(resultado) ? json : resultado, {Tipo: req.query.tipo});
        }

        let resultadoPrecios = [];
        let ingreso = false;

        if(!(req.query.precioInicial === 0 && req.query.precioFinal === 100000)){
            ingreso = true;

            for(var propiedad in _.isEmpty(resultado) ? json : resultado){
                let objPropiedad = _.isEmpty(resultado) ? json[propiedad] : resultado[propiedad];

                let valor = Number(objPropiedad.Precio.replace(/[^0-9\.]+/g,""));

                if(valor >= req.query.precioInicial && valor <= req.query.precioFinal){
                    resultadoPrecios.push(objPropiedad);
                }
            }
        }

        if(ingreso){
            res.json(JSON.stringify(resultadoPrecios));
        } else {
            res.json(_.isEmpty(resultado) ? json : resultado);
        }
    }
});

module.exports = router;
