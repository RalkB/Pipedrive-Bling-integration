const axios = require("axios");
const xmlbuilder = require("xmlbuilder");
const qs = require('qs');
const { blingBaseUrl, pipedriveBaseUrl } = require("../config");

class Ganho {
    // api_token is the pipedrive api token and api_key is the bling api_key
    async sendBling(api_token, api_key)
    {
        this.api_token = api_token;
        const dealUrl = pipedriveBaseUrl + "/v1/deals?api_token=" + api_token;

        const response = await axios.get(dealUrl);

        const blingUrl = blingBaseUrl + "/Api/v2/pedido/json/";

        const data = response.data;
        for (var index in data['data']) {
            const xml = await this.getBlingXML(data['data'][index]);

            const blingResponse = await axios({
                method: "post",
                url: blingUrl,
                data: qs.stringify({
                    "apikey": api_key,
                    "xml": xml
                }),
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
            });

            const blingData = blingResponse.data;
            return blingData;
        }
    }

    //get the bling xml to insert the data into the bling platform
    async getBlingXML(pipedriveReturn)
    {
        let xml = xmlbuilder.create("pedido");
        let itensXml = xmlbuilder.create("itens");

        const products = await this.getGanhosProdutos(pipedriveReturn.id);
        const data = products.data;

        let enabled = false;

        xml.ele("cliente")
                .ele("nome").txt(pipedriveReturn.org_name).up().up()
            .ele("volume")
                .ele("servico").txt("pipedrive").up().up()

        if (data != null) {
            data.forEach(element => {
                if (element.enabled_flag) {

                    enabled = true;
                    let descricao = element.name;
                    let qtde = element.quantity;
                    let vlr_unit = element.item_price;
                    let codigo = element.id;

                    itensXml.ele("item")
                        .ele("descricao").txt(descricao).up()
                        .ele("qtde").txt(qtde).up()
                        .ele("vlr_unit").txt(vlr_unit).up()
                        .ele("codigo").txt(codigo).up().up();
                    
                }
            });
        } 

        if (!enabled) {
                xml.ele("item")
                    .ele("descricao").txt("Sem produto cadastrado").up()
                    .ele("qtde").txt("0").up()
                    .ele("vlr_unit").txt("0").up()
                    .ele("codigo").txt("sem código para este produto").up().up();
        } else {
            xml.importDocument(itensXml);
        }

        xml.ele("parcela")
                .ele("vlr").txt("1").up().end();

        return xml.toString();
    }

    // get all deals of the pipedrive plataform
    async getGanhosProdutos(pipedriveDeal)
    {
        const productsUrl = pipedriveBaseUrl + "/v1/deals/" + pipedriveDeal + "/products?api_token=" + this.api_token;

        const response = await axios.get(productsUrl);
        return response.data;
    }
}

module.exports = new Ganho();