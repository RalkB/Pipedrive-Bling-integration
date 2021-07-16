const { blingBaseUrl } = require("../config");
const axios = require("axios");
const pedidosSchema = require("./db/pedidosSchema");
const mongoose = require("mongoose");

// class that get the bling data and insert into the mongodb base
class Pedidos {
    constructor()
    {
        this.pedidosModel = mongoose.model('pedidos', pedidosSchema);
    }

    async getBlingPedidos(api_key)
    {
        const blingUrl = blingBaseUrl + "/Api/v2/pedidos/json/?apikey="+api_key;

        const blingResponse = await axios({
            method: "get",
            url: blingUrl,
            data: '',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
              },
        })

        return blingResponse.data.retorno.pedidos;
    }

    insertPedidos(pedidos)
    {
        this.pedidosModel.collection.insertMany(pedidos, onInsert);

        function onInsert(err, docs)
        {
            if(err)
            {
                console.log(err);
            } else {
                console.log('pedidos were successfully stored');
            }
        }
    }

    getPedidos()
    {
        return this.pedidosModel;
    }
}

module.exports = new Pedidos();