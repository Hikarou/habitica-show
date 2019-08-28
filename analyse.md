# Analyse

## Résumé du projet

[Habitica](http://www.habitica.com) est un programme de renforcement des habitudes et de gestion du temps qui est un jeu du genre [RPG](https://fr.wikipedia.org/wiki/Jeu_de_r%C3%B4le).

Le but du projet est d'implémenter une interface alternative pour principalement faire de l'affichage de statistiques sur l'avancement de la productivité.

## Fonctionnalités
### Par ordre d'importance
1. **Connexion (UserID + APIToken)**
1. Affichage des tâches
1. Création de tâches "en masse"
1. Grapher l'avancée des tâches
1. Grapher la période la plus active de la journée

*Les données en **gras** sont les features minimales*

### But première démo
* Connexion
* Affichage des tâches

## Organisation

### Composants
* [API habitica](https://habitica.com/apidoc/) (déjà existante)
* Back-end Node.js
* Front-end

### Librairies
* [csv2json](https://www.npmjs.com/package/csvjson-csv2json) pour extraire les données pour en faire des graphiques
* [Plotly](https://plot.ly/nodejs/) pour la création de graphiques


### Equipe
* Comment allez-vous vous partager le travail ?
  * Travaillant tout seul, je ferai tout le travail
* Comment allez-vous tester les différentes parties ?
  * Habitica offre la possibilité d'[installer localement un serveur](https://habitica.fandom.com/wiki/Setting_up_Habitica_Locally).

    Je pourrai donc faire des tests sans toucher aux valeurs de production du jeu.

