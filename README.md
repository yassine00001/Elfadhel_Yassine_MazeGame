# Elfadhel_Yassine_MazeGame
Maze The Game:
Un mini-jeu de labyrinthe généré procéduralement, où le joueur doit atteindre la sortie le plus rapidement possible. Le jeu enregistre également les meilleurs temps pour chaque difficulté.

Description du projet:
    Maze The Game est une application web qui génère un labyrinthe aléatoire grâce à un algorithme DFS.
    Le joueur, représenté par un cercle rouge, doit se déplacer à travers les chemins pour atteindre la sortie.
    Le jeu inclut plusieurs niveaux de difficulté et mémorise les meilleurs temps à l’aide du localStorage.

Technologies utilisées:
    HTML: Structure et canvas du jeu
    CSS: Mise en page et design responsive
    JavaScript:
        - Algorithme DFS pour générer le labyrinthe
        - Déplacement du joueur et détection des collisions
        - Chronomètre en temps réel
        - Stockage des records dans le localStorage
        - Gestion d’un canvas responsive
        - Popup de fin de partie

Fonctionnalités principales:
    - Génération aléatoire du labyrinthe
    - Déplacement du joueur avec les flèches du clavier
    - Chronomètre intégré
    - Sauvegarde du meilleur temps pour chaque difficulté
    - Popup de fin de partie avec temps final et message indicatif
    - Canvas responsive (s'adapte à la fenêtre)
    - 4 niveaux de difficulté : Easy, Medium, Hard, Extreme

Nouveautés explorées:
    - Compréhension et implémentation du DFS (Depth-First Search)
    - Génération procédurale sur une matrice 2D
    - Dessin dynamique avec le Canvas HTML
    - Calcul du temps via Date.now()
    - Manipulation du localStorage
    - Gestion du responsive d’un canvas avec recalcul de résolution
    - Mise en place d'une logique de jeu complète (collision, victoire, popup, freeze des interactions)

Difficultés rencontrées:
    - Gestion correcte des limites du labyrinthe pendant le DFS
    - Problèmes de canvas qui se déformait lorsque la fenêtre changeait de taille
    - Timer qui continuait après la victoire
    - Association d’un record unique pour chaque difficulté
    - Correction du placement du joueur et des coordonnées de la sortie

Solutions apportées:
    - Vérifications strictes des limites dans le DFS
    - Recalcul complet du cellSize, du joueur et du canvas lors d’un redimensionnement
    - Ajout de clearInterval() pour stopper correctement le timer
    - Utilisation de clés uniques dans le storage: bestTime_easy, bestTime_medium, etc.
    - Gestion d'un freeze (gameFrozen) pour empêcher le joueur de bouger pendant le popup
    - Recalcul des coordonnées du joueur et de la sortie pour éviter les erreurs d’index

=======
https://yassine00001.github.io/Elfadhel_Yassine_MazeGame/
