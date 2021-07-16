# Integração Pipedrive + Bling

## Requisitos
* Tenha certeza de que tem uma instalação do mongodb rodando.
* Clone o projeto
* Na pasta do projeto utilize o comando npm install se estiver no windows e sudo npm install se estiver no linux
* Para rodar o programa utilize o comando npm run-script start

## Testando as rotas

### Inserção de pedidos no bling a partir de ganhos no pipedrive
Para inserir pedidos no bling é necessario que você tenha adicionado algum ganho no pipedrive. 

### Rotas GET

#### /ganho
Use a url http://localhost:3001/ganho para inserir os ganhos do pipdrive como pedidos no Bling. Utilize os parametro na url, pipedrive_api_token e bling_api_key para integrar as duas ferramentas.
ex: http://localhost:3001/ganho?pipedrive_api_token=#sua_api_token_do_pipedrive&bling_api_key=sua_key_de_usuario_api_do_bling

* pipedrive_api_token: seu token de autentificação da api do pipedrive.
* bling_api_key: sua key de autentificação do Usuario tipo api do Bling.

#### /getPedidos
Depois de seus pedidos serem inseridos no Bling a api gera alguns dados deles em uma collection no mongodb, para ter acesso a esses dados utilize a url http://localhost:3001/getPedidos

