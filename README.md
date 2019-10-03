# DFS15 NodeJS Evaluation Annuaire

## Projet
Ce projet est un annuaire dans le cadre d'une évaluation NodeJS / expressJS.

## Création du projet
### Prérequis
- [NodeJS v12.10.0](https://nodejs.org/en/download/)
- [postman](https://www.getpostman.com/downloads/)
- [NoSQLBooster for mongoDB](https://nosqlbooster.com/downloads)
- express v4.16.1 : ```sh npm install -g express```
- expres-generator : ```sh npm install -g express generator```

### Process utilisé
```sh
express --css=sass --view=twig --git
```

## Installation pour développement
- Installer le projet
```sh
npm install
```

- lancer le serveur avec nodemon en mode debug
```sh
npm run dev
```

## Routes
### API rest
| route     | action | url                     | options            | return                          |
|-----------|:------:|-------------------------|:------------------:| -------------------------------:|
| /         | get    | /                       |                    | render html home page           |
| /contacts | get    | contacts?limit=0&sort=1 | limit / sort       | read 3 last contacts by default |
|           | get    | contacts/:id            | contactId          | read one contact                |
|           | post   | contacts/               |                    | create contact                  |
|           | put    | contacts/:id            | contactId          | update contact                  |
|           | delete | contacts/:id            | contactId          | archive contact                 |

### AJAX
- voir tous les contacts
- supprimer un contact
- mettre à jour un contact
- ajouter un contact

