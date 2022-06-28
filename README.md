# API Rest
![w3c-badge](https://img.shields.io/badge/W3C-validation-green?style=for-the-badge)

Création d'une mini API Rest devant être développée en PHP avec output en json, tout en prévoyant qu'elle soit susceptible d'évoluer par la suite (nouveaux retours, nouveaux attributs dans les objets).

Entièrement réalisée en Ajax, aucun rechargement de page n'est effectué tout au long de l'utilisation.


## Technos
### Front-end&emsp; ![html5-badge](https://img.shields.io/badge/HTML5-orange?style=for-the-badge&color=f0632a) ![css3-badge](https://img.shields.io/badge/CSS3-blue?style=for-the-badge&color=3b9ad8) ![javascript-badge](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&color=eed94d)
### Back-end &emsp; ![php-badge](https://img.shields.io/badge/PHP-9cf?style=for-the-badge&color=8a9bd4) ![sql-badge](https://img.shields.io/badge/SQL-orange?style=for-the-badge&color=e68d02) ![ajax-badge](https://img.shields.io/badge/Ajax-blue?style=for-the-badge&color=3f92cb) ![postman-badge](https://img.shields.io/badge/Postman-orange?style=for-the-badge&color=fe6b3b)
### Framework&nbsp; ![bootstrap-badge](https://img.shields.io/badge/Bootstrap-blueviolet?style=for-the-badge&color=8c57d9)


## Description
Cette API :
- Gère 2 types d'objets :
    - User (id, name, email),
    - Task (id, user_id, title, description, creation_date, status).

- Met à disposition des endpoints permettant de récupérer les données d'un utilisateur et d'une tâche (ex: /users/{id}).

- Doit être capable de manipuler la liste des tâches associées à un utilisateur en offrant la possibilité de :
    - Récupérer cette liste de tâches,
    - Créer et ajouter une nouvelle tâche,
    - Supprimer une tâche.

Puis un front en HTML / CSS et JS (sans design particulier) communique avec l'API en Ajax pour :
- Gérer la liste des utilisateurs (affichage / ajout / modification / suppression),
- Gérer la liste des tâches d'un utilisateur (affichage / ajout / modification / suppression).


## Améliorations
- Ajouter des fonctionnalités de filtre (WHERE), tri (SORT BY), pagination côté back (LIMIT OFFSET) ou recherche par le biais de paramètres présents dans URL (ex: /tasks?status=0&sort=user_id)
- Rédiger une documentation technique de l'utilisation de l'API avec les informations sur les différents paramètres détaillés


## Aperçu
![screenshot](https://github.com/celine-trv/api_rest/blob/master/screenshot.jpg)
