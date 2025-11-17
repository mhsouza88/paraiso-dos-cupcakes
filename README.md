# 🍰 Paraíso dos Cupcakes  
Uma loja virtual de cupcakes desenvolvida **100% em HTML, CSS e JavaScript**, utilizando também o banco de dados SQLite.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)  
- [Arquitetura da Aplicação](#-arquitetura-da-aplicação)  
- [Banco de Dados](#-banco-de-dados)  
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)  
- [Experiência do Usuário (UX)](#-experiência-do-usuário-ux)  
- [Funcionalidades](#-funcionalidades)  
  - [Catálogo de Cupcakes](#catálogo-de-cupcakes)  
  - [Carrinho de Compras](#carrinho-de-compras)  
  - [Cadastro de Cupcakes](#cadastro-de-cupcakes)  
  - [CRUD de Vendas](#crud-de-vendas)  
- [Como Executar o Projeto](#-como-executar-o-projeto)  
- [Estrutura de Pastas](#-estrutura-de-pastas)  
- [Considerações Finais](#-considerações-finais)  

---

# 🎂 Visão Geral

Este projeto é uma loja online de cupcakes desenvolvida como parte de um trabalho acadêmico.  
Para a camada de persistência, foi utilizado o banco de dados SQLite, devido à sua leveza, facilidade de integração e adequação a aplicações de pequeno porte.

O objetivo principal é demonstrar um **CRUD completo**, organização arquitetural, boa experiência do usuário e o funcionamento de uma aplicação web real.

---

# 🧱 Arquitetura da Aplicação

A aplicação segue uma arquitetura inspirada no padrão **MVC**, adaptada para funcionar inteiramente no front-end:

### **📌 Model**
Representação dos dados principais:

- Cupcakes  
- Itens do carrinho  
- Vendas  

---

### 📌 Repository (Camada de Persistência)
Responsável por encapsular o acesso ao banco de dados (SQLite),
realizando operações de leitura e escrita através de comandos SQL.

---

### **📌 Controller**

Responsável pela lógica da aplicação:

- adicionar e remover itens do carrinho  
- registrar vendas  
- filtrar cupcakes por nome  
- cadastrar novos cupcakes  
- atualizar status das vendas  
- renderizar tabelas e listas na interface  

---

### **📌 View**
Manipulação do DOM:

- atualização do catálogo  
- exibição do carrinho  
- tabela de vendas  
- mensagens de feedback  
- formulários de cadastro  

---

# 🗄 Banco de Dados

Para a camada de persistência, foi utilizado o banco de dados **SQLite**, escolhido por ser leve, simples de configurar e amplamente utilizado em aplicações de pequeno porte. O SQLite armazena todas as informações em um único arquivo físico, permitindo um gerenciamento estruturado dos dados sem a necessidade de um servidor dedicado.

Foram definidas duas tabelas principais:

- **cupcake_catalog** → responsável por armazenar os cupcakes cadastrados, contendo informações como nome, descrição e preço.  
- **cupcake_sales** → armazena as vendas realizadas, incluindo cliente, total da compra, data e status.  

Essa estrutura permite organizar as informações de forma relacional e realizar operações CRUD (Create, Read, Update, Delete) por meio de comandos SQL, garantindo consistência e integridade nos dados manipulados pela aplicação.


### 🔧 Operações CRUD

| Operação | Método               | Ação no Banco de Dados (SQLite)        |
|----------|-----------------------|------------------------------------------|
| Create   | `.create()`          | Inserção de novos registros via SQL (`INSERT INTO`) |
| Read     | `.getAll()`          | Consulta dos dados armazenados (`SELECT * FROM`)    |
| Update   | `.updateStatus()`    | Atualização de informações existentes (`UPDATE`)     |
| Delete   | `.remove()`          | Remoção de registros da tabela (`DELETE FROM`)       |

Esse conjunto de operações garante que o sistema funcione de forma estruturada e consistente, utilizando o **SQLite como camada de persistência**, semelhante ao funcionamento de aplicações reais.

---

# 🛠 Tecnologias Utilizadas

| Tecnologia        | Função |
|-------------------|--------|
| **HTML5**         | Estrutura das páginas e componentes |
| **CSS3**          | Estilização, responsividade e identidade visual |
| **JavaScript ES6+** | Lógica da aplicação, repositórios, manipulação do DOM e operações CRUD |
| **SQLite**        | Banco de dados relacional utilizado para a persistência das informações da aplicação |

Nenhuma biblioteca externa foi utilizada.

---

# 🎨 Experiência do Usuário (UX)

O sistema foi pensado para ser:

### **✔ Simples e claro**
As três principais seções estão na mesma tela:

- catálogo  
- carrinho  
- vendas  

### **✔ Rápido**
As ações são instantâneas graças ao uso de JavaScript direto no navegador.

### **✔ Intuitivo**
Feedbacks são exibidos ao usuário:

- venda registrada com sucesso  
- carrinho vazio  
- cupcake cadastrado  
- erro ao enviar formulário  

### **✔ Visualmente agradável**
Cores suaves, espaçamento confortável e botões padronizados tornam a experiência leve e amigável.

---

# ✨ Funcionalidades

## **Catálogo de Cupcakes**
- Cupcakes pré-cadastrados  
- Possibilidade de cadastrar novos cupcakes  
- Cada cupcake contém:
  - nome  
  - descrição  
  - preço  

---

## **Carrinho de Compras**
- Adicionar itens  
- Remover itens  
- Calculadora de total  
- Finalização da venda com nome do cliente  

---

## **Cadastro de Cupcakes**

Formulário com:

- nome  
- descrição  
- preço  

Os cupcakes cadastrados são armazenados no banco de dados **SQLite**, garantindo persistência e permitindo que o catálogo seja mantido de forma estruturada e organizada.

---

## **CRUD de Vendas**

### ✔ **Create**
Venda registrada ao finalizar o carrinho.

### ✔ **Read**
Tabela com:

- ID  
- Cliente  
- Data  
- Itens vendidos  
- Total  
- Status  

### ✔ **Update**
Status pode ser alterado:

- Pendente  
- Pago  
- Cancelado  

### ✔ **Delete**
Vendas podem ser excluídas do sistema.

---

# ▶ Como Executar o Projeto

Não é necessário instalar nada.

### **1. Baixe ou clone o repositório**
```bash
git clone https://github.com/seu-usuario/paraiso-dos-cupcakes
```

### **2. Abra o arquivo**
```bash
index.html
```

### **3. Pronto!**
A aplicação funciona diretamente no navegador, sem necessidade de instalar nada.

---

# 📂 Estrutura de Pastas
```text
paraiso-dos-cupcakes/
│
├── index.html        # Página principal
├── styles.css        # Estilos
└── app.js            # Lógica da aplicação
```

---

# 🧁 Considerações Finais

Mesmo desenvolvida exclusivamente com **HTML**, **CSS** e **JavaScript** puro, a **Paraíso dos Cupcakes** simula de forma fiel o funcionamento de uma aplicação web completa, incluindo:

- gerenciamento de produtos;
- carrinho de compras;
- CRUD completo de vendas;
- cadastro de novos cupcakes;
- armazenamento persistente por meio do banco de dados **SQLite**;
- arquitetura modular inspirada no padrão MVC.

A aplicação demonstra como é possível construir uma experiência rica, funcional e organizada apenas com tecnologias básicas de desenvolvimento web, mantendo uma separação clara entre lógica, persistência e interface.  
O projeto atende plenamente aos requisitos da atividade acadêmica, apresentando boa estrutura, usabilidade intuitiva e uma organização arquitetural coerente.

Essa implementação torna o sistema didático e ideal tanto para estudos quanto para demonstrações práticas de desenvolvimento web, mostrando que é possível criar soluções completas mesmo utilizando tecnologias simples e acessíveis.

# 👩‍💻 Autoria
Projeto desenvolvido por Maria Helena Souza como parte da atividade acadêmica Projeto Integrador Transdisciplinar em Engenharia de Software II.

