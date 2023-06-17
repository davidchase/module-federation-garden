# module-federation-garden
Using Vite Module Federation Plugin and Garden.io

Postgres db name, username and password store in kubernetes secrets

❯ kubectl --namespace=react-mf-expirement-default create secret generic pg-user --from-literal=pg-username=
                                                                                                  
❯ kubectl --namespace=react-mf-expirement-default create secret generic pg-pass --from-literal=pg-password=
                                                                                                 
❯ kubectl --namespace=react-mf-expirement-default create secret generic pg-name --from-literal=pg-dbname=

# Engineering Excelence Guildlines

- [docs/engx.md](docs/engx.md)

