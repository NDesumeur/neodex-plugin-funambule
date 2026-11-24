# Funambule

Un jeu d'équilibre : un funambule avance tout seul sur un fil tendu très haut au-dessus de la ville, et c'est à toi de le garder droit contre son propre déséquilibre et contre le vent. Va le plus loin possible avant la chute.

*English version: [README.en.md](README.en.md)*


## Pigeons, ballons et contrats (nouveau en 1.2.0)

- **Pigeons** : ils arrivent en volant et se posent quelques secondes au bout de la perche, qui penche de leur côté.
- **Ballons** : ils montent de la ville ; s'ils cognent un bout de la perche, elle bascule d'un coup.
- **Contrats** : huit traversées jusqu'à un poteau donné, avec un plateau de trois verres sur la tête. Si tu penches trop, les verres glissent et tombent. Une étoile par verre gardé ; chaque contrat réussi ouvre le suivant (pigeons et ballons à partir du troisième).

## Commandes

- **Espace** : partir (et recommencer après une chute).
- Maintiens **←** ou **→**, ou clique et maintiens sur la moitié **gauche** ou **droite** du jeu, pour pencher la perche de ce côté.
- **P** : pause.
- **Plein écran** : le bouton du même nom ; Échap pour en sortir. Hors plein écran, le jeu prend la place que laisse la fenêtre.

## Comment ça marche

- Le funambule avance à vitesse constante, qui augmente doucement avec la distance.
- Il n'est jamais parfaitement stable : dès qu'il penche, il penche de plus en plus s'il n'est pas rattrapé. **Penche du côté opposé à la chute**, sans trop forcer, sinon il bascule de l'autre côté.
- Le **vent** souffle de plus en plus fort au fil de la traversée et change de sens.
- Des **rafales** soudaines s'ajoutent : elles sont annoncées une seconde à l'avance par des traits blancs qui traversent l'écran du côté d'où elles viennent, avec un souffle sonore.
- Au-delà d'une certaine inclinaison, c'est la **chute**.
- Un **poteau** est franchi tous les 26 mètres.
- Quand il penche fort, le funambule (béret et marinière) lâche la perche des mains et **ses bras moulinent**, de plus en plus vite ; ils reviennent sur la perche dès qu'il s'est rattrapé.

## Les villes

Tous les **250 mètres**, le fil passe au-dessus d'une autre ville, en fondu, et son nom s'affiche :

1. **Paris** au coucher du soleil : immeubles haussmanniens aux toits de zinc, la tour Eiffel et la basilique sur sa colline.
2. **Venise** : maisons colorées au bord d'un canal, gondoles, poteaux d'amarrage, campaniles et coupoles.
3. **New York la nuit** : étoiles, croissant de lune, gratte-ciel aux fenêtres allumées et réservoirs d'eau sur les toits.
4. **Le canyon** : plateaux de roche rouge, cheminées de fée, une arche de pierre et des cactus.

Puis la traversée repart de Paris.

## Statistiques

Après chaque chute, l'écran montre la distance parcourue et les poteaux franchis. Le panneau Records garde ta **plus longue traversée**, le nombre de **traversées**, le total de **poteaux franchis** et la **distance totale**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Funambule → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
