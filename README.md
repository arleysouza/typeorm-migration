# TypeORM e migration
Projeto usado para testar o uso de migration. Esta aplicação é uma modificação de [servidor-gasto-typeorm-jwt-bcrypt](https://github.com/arleysouza/servidor-gasto-typeorm-jwt-bcrypt).

## Modelo de dados da aplicação

![Texto alternativo para a imagem](https://github.com/arleysouza/typeorm-migration/blob/master/imagens/modelo.png)

É necessário setar os parâmetros de acesso ao SGBD PostgreSQL no arquivo `src/add-data-source.ts`.

## Teste de migração
A migração consiste em um arquivo JS/TS com uma classe com os métodos `up` e `down`. No método `up` estão as cláusulas SQL para criar a migração no SGBD e no método estão cláusulas SQL para desfazer a migração no SGBD.
Utilizaremos os comandos `migration:generate` para criar um arquivo de migração, `migration:run` para submeter as cláusulas SQL do arquivo de migração no SGBD e `migration:revert` para desfazer a última migração, ou seja, o comando `migration:run` executará o método `up` do arquivo de migração e `migration:revert` executará o método `down` do arquivo de migração.

Na propriedade `scripts` do arquivo de configuração `package.json` foram colocados os comandos de migração:
```
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "start": "ts-node src/index.ts",
  "migration:generate": "typeorm-ts-node-commonjs -d ./src/app-data-source.ts migration:generate ./src/migration/default",
  "migration:run": "typeorm-ts-node-commonjs -d ./src/app-data-source.ts migration:run",
  "migration:revert": "typeorm-ts-node-commonjs -d ./src/app-data-source.ts migration:revert"
},
```

Para testar as migrações reproduza os seguintes passos:
1. O comando a seguir criará um arquivo com as migrações na pasta src/migration:
```
npm run migration:generate
```
Como resultado será criado um arquivo com nome no seguinte formato src/migration/{timestamp}-default.ts. A migração possui como parte do nome o timestamp do horário de criação da migration. O termo `default` existe pelo fato de termos colocado como parte do arquivo de destino o termo default em `./src/migration/default`.
Observe que dentro do arquivo existe uma classe com o nome default{timestamp} que implementa a interface MigrationInterface. Na classe exitem os métodos `up` e `down`.

2. O comando a seguir submeterá a migração no SGBD:
```
npm run migration:run
```
Como resultado será criada as tabelas `usuarios`, `gastos` e `migrations`. Na tabela `migrations` será inserido um registro com os dados da migração. Será inserido um novo registro na tabela `migrations` cada vez que for executado o comando `migration:run`.

3. O comando a seguir reverterá a última migração no SGBD:
```
npm run migration:revert
```
Como resultado serão executadas as cláusulas SQL do método `down` do último arquivo de migração submetido ao SGBD.
