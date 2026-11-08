# Funambule

Un jeu d'équilibre : un funambule avance tout seul sur un fil tendu très haut au-dessus de la ville, et c'est à toi de le garder droit contre son propre déséquilibre et contre le vent. Va le plus loin possible avant la chute.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Espace** : partir (et recommencer après une chute).
- Maintiens **←** ou **→**, ou clique et maintiens sur la moitié **gauche** ou **droite** du jeu, pour pencher la perche de ce côté.
- **P** : pause.

## Comment ça marche

- Le funambule avance à vitesse constante, qui augmente doucement avec la distance.
- Il n'est jamais parfaitement stable : dès qu'il penche, il penche de plus en plus s'il n'est pas rattrapé. **Penche du côté opposé à la chute**, sans trop forcer, sinon il bascule de l'autre côté.
- Le **vent** souffle de plus en plus fort au fil de la traversée et change de sens.
- Des **rafales** soudaines s'ajoutent : elles sont annoncées une seconde à l'avance par des traits blancs qui traversent l'écran du côté d'où elles viennent, avec un souffle sonore.
- Au-delà d'une certaine inclinaison, c'est la **chute**.
- Un **poteau** est franchi tous les 26 mètres.

## Statistiques

Après chaque chute, l'écran montre la distance parcourue et les poteaux franchis. Le panneau Records garde ta **plus longue traversée**, le nombre de **traversées**, le total de **poteaux franchis** et la **distance totale**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Funambule → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
