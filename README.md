# Backend Challenge ProFranchising

## Sobre:
Trata-se de um desafio técnico referente ao processo seletivo da empresa ProFranchising.

## Tecnologias utilizadas:
- Node.js;
- Express;
- MongoDB;
- Jsonwebtoken;
- Multer;
- Insomnia ou Postman.

## O case:

Situação:

Um cliente chegou na loja e comprou 5 cookies. O barista olhou o pedido e ficou desesperado, havia somente 2 cookies na loja.
Ele teve que explicar ao cliente o ocorrido e o cliente foi embora, essa situação não aconteceria se o pessoal do TI estivesse controlado o estoque.

Sobre:

Você foi designado a resolver esse problema e precisa estruturar todo sistema de estoque e produtos para evitar acontecer novamente.

Requisitos:

O estoque nada mais é que controlar quantos ingredientes tem na loja, além de cookie em uma cafeteria tem outros ingredientes como café em pó, leite, entre outros.
Para organizar melhor crie uma estrutura de ingrediente com nome, unidade de medida e preço unitario.

Antes de ter um estoque você precisa ter um produto com algumas coisas basicas que o cliente precisa saber como: nome, imagem, preço e os ingredientes que esse produto tem. 
Porém temos um problema aqui, o ingrediente é só uma referencia a o que foi usado ele não tem quantidade, então você precisa fazer um novo objeto que faça referência a esse ingrediente com a quantidade que é usado, nós chamamos de componente.

Agora você já tem as informações basicas para controlar o estoque, organize em um objeto para que o cliente consiga visualizar os ingredientes da loja e quanto tem de estoque atualmente.

Ufa, tudo pronto, mas ainda o problema não foi resolvido, você só esta controlando quanto tem, faça uma rota de verificação para saber se o produto X pode ser vendido. 

Como você não tem acesso ao PDV faça uma rota de controle manual para o dono da loja imputar os valores do estoque.

O dono é quem cadastra todas as informações da loja, inclusive o upload da imagem, então será necessario uma rota para CRUD dessas informações.
Além disso alterar as informações é restrito então essas rotas especificas precisa de um login para controlar.

Situação resolvida, agora o cliente pediu novas alterações, como sempre. Ele precisa de um relatório para saber o custo dos produtos, você tem essas informações de quanto custa o ingrediente e de quanto vai no produto.
Precisamos de uma rota que retorne todos os produtos e o custo de cada um.

## Instruções de uso:

Clone o repositório e instale as dependencias com o comando npm install ou acesse o seguinte link com o deplou da aplicação:
https://api-profranchising-test.herokuapp.com/
Para rodar a aplicação é necessário usar o comando npm start.
Para rodar os testes de integração é comando npm test.
A aplicação foi desenvolvida utilizando principios da arquitetura MSC.

## Rotas:
  ##### Users:
  - Método post('/users) para criação de novos usuários. É necessário preencher os seguintes campos:
  ```json
  {
    "name": "tipo string com minimo 2 caracteres, obrigatório",
    "username": "tipo string com minimo 2 caracteres, obrigatório",
    "password": "tipo string, com minimo 6 caracteres, obrigatório",
    "role": "tipo string, é só será aceito "admin" ou "user", obrigatório"
  }
  ```
  - Método get('/users') para listar todos os usuários cadastrados.
  
  #### Login:
  - Método post('/login') para novos logins. O retorno será o token JWT. Para logar é necessários preencher os seguintes campos:
  ```json
  {
    "username": "tipo string com minimo 2 caracteres",
    "password": "tipo string, com minimo 6 caracteres",
  }
  ```
  #### Ingredients:
  - Método post('/ingredients'). É necessário estar logado, com usuario com a "role" "admin" para criação de um novo ingrediente. É necessário preencher os seguintes campos:
  ```json
  {
    "name": "tipo string, obrigátorio, e não pode estar vazio"
    "unity": "tipo string, obrigátorio, e não pode estar vazio, e tem que ser entre "kg", "l" ou "un"",
    "price": "tipo number, com valor minimo 0.01, obrigatório",
  }
  ```
  - Método put('/ingredients/:id'). Para edição de um ingrediente já cadastrado. O 'id' tem que ser de um ingrediente ativo no sistema. É necessário preencher os campos da mesma forma do método post.Somente usuario com a "role" admin consegue editar.
  - Método get('/ingredients') para acessar todos os ingredients cadastrados. Tem que estar logado com qualquer tipo de "role" do usuario.
  - Método get('/ingredients/:id') para acessar um ingrediente especifico, o 'id' tem que ser válido e de um ingrediente cadastrado. Tem que estar logado com qualquer tipo de "role" do usuario.
  - Método delete('/ingredientes/:id') para deletar um ingrediente especifico. Somente usuario com a "role" admin consegue deletar.
  
  #### Products:
  - Método post('/products').É necessário estar logado, com usuario com a "role" "admin" para criação de um novo produto. É necessário preencher os seguintes campos:
  ```json
  {
    "name": "tipo string, obrigátorio, e não pode estar vazio",
    "price": "tipo number, com valor minimo 0.01, obrigatório",
    "quantity": "tipo number, obrigátorio,com valor minimo de 1",
    "ingredients": [ "tipo array, obrigatório"
      {
        "name": "tipo string, obrigátorio, e não pode estar vazio, e tem que ser de um ingrediente já cadastrado no sistema",
        "quantity": "tipo number, obrigátorio,com valor minimo de 0.01", 
      }
    ]
  }
  ```
  - Método put('/products/:id'). Para edição de um produto já cadastrado. O 'id' tem que ser de um produto ativo no sistema. É necessário preencher os campos da mesma forma do método post.Somente usuario com a "role" admin consegue editar.
  - Método put('/products/:id/image'). Para cadastrar uma imagem em um produto ativo no sistema. Somente usuario com a "role" admin consegue adicionar a imagem.
  - Método delete('/products/:id') para deletar um produto especifico. Somente usuario com a "role" admin consegue deletar. 
  - Método get('/products') para acessar todos os produtos cadastrados. Tem que estar logado com qualquer tipo de "role" do usuario.
  - Método get('/products/:id') para acessar um produto especifico, o 'id' tem que ser válido e de um produto cadastrado. Tem que estar logado com qualquer tipo de "role" do usuario.
  - Método get('/images/:id.jpeg') para acessar um upload de imagem especifico. Onde 'id.jpeg' é referente o nome da imagem.
  
  #### Products Costs:
  - Método get('/productscosts'). Para listar todos os produtos cadastrados, com o custo individual de cada.
   
  
  ## Contato
  Qualquer dúvida ou sugestão, me contate por:
  - Email: gui.couto90@yahoo.com.br
  - LinkedIn: https://www.linkedin.com/in/guicouto90/
  
  
 
