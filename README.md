# Go Barber - Backend

Projeto desenvolvido no bootcamp da RocketSeat. Com o propósito, de facilitar a vida de barbeiros e clientes das barbearias

## 🚀 Começando

Basta realizar o clone do projeto na sua máquina e instalar as dependências do projeto. Será necessário o uso de um banco de dados postgress, mongo e redis. Recomendo instanciá-lo com Docker. Configure também as veriáveis de ambiente especificadas no `env.examples` e o arquivo `ormconfig.json` para interação do typeorm com o postgres e mongo

### 📋 Pré-requisitos

```
git
node
yarn | npm
```

### 🔧 Instalação

Instalação das dependências:

```
yarn
```

Executando ambiente de desenvolvimento
```
yarn dev:server
```

Build e execução da aplicação transpilada para js

```
yarn build
cd dist
node shared/infra/http/server.js
```

## ⚙️ Executando os testes de unidade

```
yarn test
```

### ⌨️ Testes de estilo de codificação

```
yarn eslint --ext .ts ./src
```
Lembre de executar SonarQube análise
