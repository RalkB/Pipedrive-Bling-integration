const express = require("express");
const routes = express.Router();
const ganho = require("./app/ganho");
const pedidos = require("./app/pedidos");

routes.get("/ganho", function(req, res) {
  if (req.query.pipedrive_api_token == undefined || req.query.pipedrive_api_token == '')
  {
    return res.send("necessario o envio do pipedrive_api_token!");
  }

  if (req.query.bling_api_key == undefined || req.query.bling_api_key == '') 
  {
    return res.send("necessario o envio do bling_api_key!");
  }

  ganho.sendBling(req.query.pipedrive_api_token, req.query.bling_api_key);

  pedidos.getBlingPedidos(req.query.bling_api_key).then(function (response) {
    const docPedidos = [];

    response.forEach(element => {
      docPedidos.push({
        numero: element.pedido.numero,
        data: element.pedido.data,
        valor: element.pedido.totalprodutos
      })
    });

    pedidos.insertPedidos(docPedidos);
  }).catch(function (error) {
    console.log(error);
  });

  return res.send("Ganhos inseridos com sucesso!");
});

routes.get("/getPedidos", function (req, res) {
  const pedidosModel = pedidos.getPedidos();
  pedidosModel.find(function (err, data) {
    if (err) {
      return res.send(err);
    } else {
      return res.send(data);
    }
  })
})

module.exports = routes;