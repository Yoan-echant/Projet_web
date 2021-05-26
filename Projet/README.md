
Pour lancer le projet la première fois :
```shell
npm install
```
Pour initialiser la base de données
```shell
node init.js
```


Pour lancer le serveur  : 
```shell
node main.js
```


ATTENTION

Il faut se rendre sur la testmerge!!!!!
(tout les fichier n'ont pas été ajouter dans le main)

Fonctionnalité:

Implémenté:

Connexion:
    La plupart des pages redirige l'utilisateur vers la page de connexion s'il n'est pas connecté

    La page de connexion dipose d'un lien vers la page de création de compte

    On peut créer de nouveaux comptes, le mot de passe doit etre > a 6 caractères, l'username superieur a 4 et l'adresse mail doit être valide

Page principales
    On peut ajouter des pages, et editer et supprimer les pages qu'on a créer. Il n'est pas possible de supprimer ou d'editer des pages.
    Chaque page dispose egalement d'un lien

    On peut se rendre sur chaque page.
    La catégorie, l'auteur et la date de parution (ou de dernière edition si edition il y a eu) sont affichée sur le site

Pages:
    On a un système de like/dislike similaire à Youtube.
    Chaque personne ne peut liker ou disliker qu'une seul fois. On ne peut pas liker et disliker en même temps. Il est possible de changer d'avis.
    On peut voir le choix que l'on a fait ainsi que le nombre total de like/dislike.

    Il est possible de commenter une page.
    Chaque utilisateur peut editer/supprimer son commentaire à tout moment.

Profile:
    Chaque utilisateur dispose d'une page de profil.
    Il est possible d'y changer son mot de passe.
    On y trouve un historique de toutes les pages visitees par ordre antichronologique.

Subredits:
    On peut créer et editer des subredits (catégories) et y acceder depuis des onglets

Tendance:
    On dispose d'un onglet tendance qui classe toutes les pages par nombre de like

Visite:
    On dispose d'un onglet visite qui contient toutes les pages que l'utilisateur a visité dans les dernière 24h ET qui ont été modifié depuis (ex: A visite la page Telecommunication puis se deconnecte/ B ajoute un commentaire sur cette page ou l'auteur edit la page/ La page apparaitra dans l'onglet visite) 
    Attention, un like ne fera pas apparaitre la page dans l'onglet visite!

Non implémenté:

On ne peut pas liker/disliker les commentaire.

Les boutons edit/supprimer ne sont pas cacher pour les utilisateur qui ne dipose pas des droits
(mais appuyer dessus ne fait rien si on a pas les droits)


