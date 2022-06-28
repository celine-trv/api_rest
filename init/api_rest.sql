-- Version du serveur :  10.4.16-MariaDB
-- Version de PHP : 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `api_rest`
--

-- --------------------------------------------------------

--
-- Structure de la table `api_task`
--

CREATE TABLE `api_task` (
  `id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = not done,\r\n1 = done,\r\n2 = in progress,'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `api_task`
--

INSERT INTO `api_task` (`id`, `user_id`, `title`, `description`, `creation_date`, `status`) VALUES
(1, 4, 'mini API REST en PHP et Ajax json', '1/ Développer en PHP une mini API REST avec output en json\n\n    Cette api doit :\n    \n    - Gérer 2 types d\'objets :\n    User (id, name, email)\n    Task (id, user_id, title, description, creation_date, status)\n    \n    - Mettre à disposition des endpoints permettant de récupérer les données d\'un user et d\'une task. (ex: /user/$id)\n    \n    - L\'api doit être capable de manipuler la liste des taches associées à un utilisateur en offrant la possibilité de :\n    Récupérer cette liste de taches\n    Créer et ajouter une nouvelle tache\n    Supprimer une tache\n    \n    En développant cette API, vous devez garder en tête qu\'elle est susceptible d\'évoluer (nouveaux retours, nouveaux attributs dans les objets)\n    \n    2/ Développer un front en HtML/JS/CSS (pas de design nécessaire)\n    \n    Ce front doit communiquer avec l\'api en ajax.\n    On doit pouvoir ajouter/supprimer un utilisateur\n    Gérer la liste des tâches d\'un utilisateur (liste / ajout / suppression)', '2022-03-01 18:19:27', 1),
(2, 13, 'Rédaction du cahier des charges', 'Définir les besoins du client, le design attendu et les objectifs de l\'application', '2022-03-02 12:08:43', 1),
(3, 20, 'Rédaction des spécifications fonctionnelles et techniques', '', '2022-03-08 12:11:34', 1),
(4, 10, 'Répartition des tâches', '', '2022-03-08 12:13:10', 1),
(5, 9, 'Cadeau surprise', 'Apporter le café et les viennoiseries pour l\'équipe vendredi', '2022-03-09 13:34:57', 1),
(6, 5, 'Maquette', 'A réaliser et présenter au client sous 2 semaines', '2022-03-17 15:53:40', 1),
(7, 9, 'Développer les fonctionnalités front-end', 'Rappel : HTML / JS / CSS\n\nCe front doit communiquer avec l\'api en ajax.\nOn doit pouvoir ajouter/supprimer un utilisateur\nGérer la liste des tâches d\'un utilisateur (liste / ajout / suppression)', '2022-03-22 12:20:43', 1),
(8, 12, 'Développer les fonctionnalités back-end', 'Rappel : PHP / Ajax / json\n\nRessources : users + tasks\nEndpoints pour accéder aux données\nCréer, ajouter, modifier et supprimer une ressource', '2022-03-22 12:24:04', 1),
(9, 14, 'Plannifier le délai de développement de chaque fonctionnalités', 'Créer un planning pour chaque fonctionnalités et spécificités développées prenant en compte les demandes précises attendues par le client, telles qu\'elles ont été définies préalablement', '2022-03-25 12:33:09', 1),
(10, 2, 'Nouvelle fonctionnalité', 'Développer et ajouter la mise à jour des ressources (update - PUT)', '2022-03-30 11:59:55', 1),
(11, 6, 'Date de livraison estimée', 'A définir et communiquer au client', '2022-04-11 14:42:13', 1),
(12, 1, 'Filtrage, pagination, tri et recherche des résultats', 'Ajouter des fonctionnalités de filtre (WHERE), tri (SORT BY), pagination (LIMIT OFFSET) ou recherche.\n\n\nFILTRE - par exemple, récupérer la liste des tâches seulement non effectuées :\n\nGET   /tasks?status=0 \nIci status est un paramètre de requête qui implémente un filtre.\n\n\nPAGINATION - pour ne récupérer que les 5 premiers utilisateurs, la requête aura la forme suivante :\n\nGET   /users?sex=m&amp;amp;limit=5\n\nPour récupérer les 5 utilisateurs suivants, la requête sera alors la suivante :\n\nGET   /users?sex=m&amp;amp;offset=5&amp;amp;limit=5\n\n“limit” donne le nombre d’objets retournés à partir du début de la liste tandis que “offset” donne le point de départ du curseur à partir duquel on va prendre en compte les objets.\n\n\nTRI - on pourra avoir les exemples de requêtes suivantes en laissant le paramètre de tri prendre une liste de champs séparés par des virgules :\n\nGET   /users?sex=m&amp;amp;offset=5&amp;amp;limit=5&amp;amp;sort=+name,-birth_date\nGET   /tasks?sort=status,creation_date\n\nIci  le tri se fera sur le nom (ordre alphabétique avec &amp;quot; + &amp;quot; devant &amp;quot;name&amp;quot;) puis ensuite sur la date de naissance (ordre décroissant avec &amp;quot; - &amp;quot; devant &amp;quot;birth_date&amp;quot;) ou encore, à statut égal, les tâches les plus anciennes seront classées en premier.\n\n\nRECHERCHE - Parfois, les filtres de base ne suffisent pas et il peut y avoir besoin de la puissance de la recherche en texte intégral. Lorsque celle-ci est utilisée comme mécanisme de récupération d\'instances de ressource pour un type de ressource spécifique, elle peut être exposée sur l\'API en tant que paramètre de requête sur l\'endpoint de la ressource. Les requêtes de recherche doivent être transmises directement au moteur de recherche et la sortie de l\'API doit être au même format qu\'un résultat de liste normal. En les combinant, la requête pour récupérer la priorité la plus élevée des tâches non terminées mentionnant le mot \'SEO\' sera la suivante :\n\nGET /tasks?q=SEO&amp;amp;status=0&amp;amp;sort=priority,creation_date', '2022-04-19 20:24:23', 2),
(13, 13, 'Rédaction du cahier de recette à la fin du projet', '', '2022-04-25 10:16:01', 0),
(14, 1, 'Affichage sous forme de pages', 'Ajouter une fonctionnalité de pagination avec les paramètres suivants :\n\n- 6 ressources affichées par page (ajustable)\n- nav pour accéder aux pages de -2 à +2 par rapport à la page en cours\n- boutons allant directement à la première et dernière page', '2022-04-26 09:29:12', 1),
(15, 4, 'Effectuer les tests fonctionnels', 'visuels, liens, exécution des différentes requêtes (verbes http) puis faire remonter les différents bugs et erreurs rencontrés', '2022-04-28 13:48:25', 1),
(16, 17, 'Vérifier l\'accessibilité du site', '', '2022-04-28 15:10:34', 1),
(17, 4, 'Rédiger la documentation technique de l\'appli', '', '2022-05-02 15:05:48', 2),
(18, 6, 'Optimisation UX', 'Faire le point avec le designer sur les améliorations à apporter en matière d\'expérience utilisateur', '2022-05-03 15:17:50', 2),
(19, 2, 'SEO', 'Optimiser le référencement de l\'appli', '2022-05-03 18:41:16', 0),
(20, 3, 'Nouveau dev', 'Ajouter le nouveau dev à la liste des utilisateurs et lui présenter la stack technique', '2022-05-04 15:22:02', 1);

-- --------------------------------------------------------

--
-- Structure de la table `api_user`
--

CREATE TABLE `api_user` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `api_user`
--

INSERT INTO `api_user` (`id`, `name`, `email`) VALUES
(1, 'Claire MANGIN', 'claire.mangin@gmail.com'),
(2, 'David REY', 'david.rey@gmail.com'),
(3, 'Julie CHURIA', 'julie.churia@hotmail.fr'),
(4, 'Amanda DAVIET', 'amanda.daviet@yahoo.com'),
(5, 'Olivier LEBLANC', 'olivier.leblanc@live.com'),
(6, 'Françoise BLANCHARD', 'francoise.blanchard@laposte.net'),
(7, 'Christel BEAUMIN', 'christel.beaumin@hotmail.fr'),
(8, 'Thibault AUCLAIR', 'thibault.auclair@aol.com'),
(9, 'Benjamin TREGON', 'benjamin.tregon@outlook.fr'),
(10, 'Yves GOUGEON', 'yves.gougeon@gmail.com'),
(11, 'Patricia LAPIERRE', 'patricia.lapierre@yahoo.com'),
(12, 'Pierre JAMIRAT', 'pierre.jamirat@outlook.fr'),
(13, 'Blandine BAUCHU', 'blandine.bauchu@mail.net'),
(14, 'Christian AMARIGO', 'christian.amarigo@aol.com'),
(15, 'Julien GOUPAT', 'julien.goupat@outlook.com'),
(16, 'Gontier OLIBENCLAIN', 'gontier.olibenclain@live.fr'),
(17, 'Georges BEATHIN', 'georges.beathin@yahoo.fr'),
(18, 'Yvette FRATRE', 'yvette.fratre@laposte.net'),
(19, 'Trecy YVANOV', 'trecy.yvanov@hotmail.com'),
(20, 'Reguia CAREY', 'reguia.carey@gmail.com');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `api_task`
--
ALTER TABLE `api_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Index pour la table `api_user`
--
ALTER TABLE `api_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `api_task`
--
ALTER TABLE `api_task`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `api_user`
--
ALTER TABLE `api_user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `api_task`
--
ALTER TABLE `api_task`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
