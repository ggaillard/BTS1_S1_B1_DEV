---
title: "SÉANCE 5 — « Mardi, 17 h 52 »"
seance: 5
duree: "1 h"
notee: false
---

# SÉANCE 5 — « Mardi, 17 h 52 »
### La machine qui teste et qui livre, et la boîte qui fait tourner le code partout pareil

> **Séance 5 / 14** · Acte 1 — DevOps : industrialiser le code · **Durée : 1 h** · **100 % en ligne**
> Fil rouge du semestre : *Du code au service — les 4 cultures Ops*

---

## 👉 Le jour de la séance, tout se passe ici

# **[ggaillard.github.io/portail-bts](https://ggaillard.github.io/portail-bts/)**

**Une seule adresse, toute l'année.** Vous vous identifiez une fois — code classe,
numéro, code à quatre chiffres — puis vous ouvrez le cours depuis le portail.
C'est ce passage qui enregistre votre présence et votre progression : entrer
par une autre porte, c'est travailler sans que rien ne soit compté.

1. Ouvrez **le portail** dans le navigateur du poste.
2. Répondez à la question du jour, puis ouvrez la séance depuis « Vos projets ».
3. Avancez **acte par acte** : vous lisez, vous répondez, vous passez au suivant.

**Aucune note ne sera mise.** Répondre faux ne coûte rien, ne pas répondre, si.

> Cette page-ci est la **trace écrite** de la séance : elle sert à **réviser après**,
> ou à rattraper si vous étiez absent.

---

## 🎬 COLD OPEN — dix-sept minutes de page blanche

La correction de Thomas est enfin dans main. Commit poussé, pull request relue,
fusion faite : tout ce que la séance 4 réclamait. Mardi, Noah la met en
production, à la main, comme d'habitude. Voici sa fenêtre de terminal :

```
17:44  $ ssh prod.devsecure.fr
17:45  $ cd /srv/rapport && git pull
17:46  $ pip install -r requirements.txt
17:47  $ systemctl restart rapport
17:52  ⚠ Alerte : page d'accueil — erreur 500
18:09  ✓ Retour à la version précédente
```

La correction était juste. Ce qui manquait : **personne n'avait relancé les tests** — « on n'avait pas le
temps » —, et le serveur n'avait pas la même version de Python que le poste de
Thomas.

Et l'assistant de Léa répond toujours « 47 % ». Personne n'a pensé à
reconstruire son index.

> — *« Il faudrait une check-list »*, propose Maya.
> — *« Il y en a une »*, répond Noah. *« Douze lignes. J'en ai sauté une. »*

!!! fil "Au fil de l'heure"
    **D'après le terminal de Noah, juste après quelle commande la page d'accueil est-elle tombée ?**<span class="fil-cle" hidden>f08</span>

    `A` la connexion au serveur · `B` la récupération de main · `C` le redémarrage du service · `D` l'installation des dépendances

**Trois oublis, trois humains. Et si ce n'était plus à un humain de s'en
souvenir ?** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    La direction veut savoir **ce qui s'est passé mardi à 17 h 52**, et comment
    éviter que ça recommence. À la fin de l'heure, vous saurez dessiner la chaîne
    qui aurait arrêté la panne avant la production — et lire le fichier qui la
    décrit.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| ✋ | Dire pourquoi un **déploiement à la main** est risqué | Indice n° 1 |
| 🔗 | Dérouler un **pipeline CI/CD** : build, test, déploiement | Indice n° 2 |
| 🧪 | Distinguer test **unitaire**, d'**intégration** et **de bout en bout** | Indice n° 2 |
| 📦 | Expliquer **image**, **conteneur** et **Dockerfile** | Indice n° 3 |
| 📄 | Lire un **workflow** GitHub Actions et dire quand il se lance | Indice n° 4 |

*Compétence visée : **B1C2** — développer des solutions applicatives, en
automatisant leur test et leur mise à disposition.*
*Prérequis : la séance 4. Si vous étiez absent, lisez d'abord « Ça marche sur mon poste ».*

---

## ✋ ACTE I — DOUZE LIGNES, UNE SAUTÉE *(≈ 6 min)*

Voici la check-list de Noah, recopiée telle quelle du wiki de l'équipe :

```
1. Récupérer main                    7. Copier le fichier .env
2. Installer les dépendances         8. Migrer la base de données
3. Lancer les tests                  9. Redémarrer le service
4. Vérifier la version de Python    10. Ouvrir la page d'accueil
5. Prévenir l'équipe                11. Reconstruire l'index
6. Sauvegarder la base              12. Noter la version en production
```

Mardi, il a sauté la 3, la 4 et la 11 : il était 17 h 44, et les tests
prennent six minutes.

Une **mise en production à la main**, c'est une suite de gestes qui reposent
**sur la mémoire de quelqu'un**. Elle a trois défauts :

| Défaut | Ce qui s'est passé mardi |
|---|---|
| On **oublie** | Les tests n'ont pas été lancés |
| On ne fait **jamais deux fois pareil** | Le serveur n'avait pas la version de Python du poste |
| On ne **sait pas après coup** ce qui a été fait | Il a fallu dix-sept minutes pour comprendre et revenir en arrière |

!!! fil "Au fil de l'heure"
    **La panne de Python vient de quel défaut du déploiement à la main ?**<span class="fil-cle" hidden>f09</span>

    `A` on oublie une étape · `B` on ne fait jamais deux fois pareil · `C` on ne sait pas après coup ce qui a été fait · `D` on va trop vite

> 🔑 **Ce qui se répète doit être fait par une machine.** C'est le premier geste
> DevOps de la séance 4 — **automatiser** —, appliqué au trajet du code vers la
> production.

### 🧪 Indice n° 1 — à vous

Dans la check-list, lesquelles des douze lignes une machine peut-elle faire
seule, à chaque fois, sans rien demander à personne ?

??? question "🔓 Ouvrir le rapport d'expertise"

    **Presque toutes.** Récupérer main, installer, tester, vérifier la version,
    sauvegarder, copier la configuration, migrer, redémarrer, ouvrir la page,
    reconstruire l'index, noter la version : ce sont des commandes. Une machine les
    tape sans fatigue, dans le même ordre, un mardi à 17 h 44 comme un lundi à 9 h.

    Seule la 5 — **prévenir l'équipe** — demande un humain, et un message
    automatique s'en charge.

    **Le piège** : croire qu'une meilleure check-list aurait suffi. La check-list
    était bonne. C'est la **mémoire humaine** qui ne tient pas à 17 h 44.

---

## 🔗 ACTE II — LA CHAÎNE QUI S'ARRÊTE AU PREMIER ROUGE *(≈ 14 min)*

> **Mercredi, 8 h 30.** Maya a réuni l'équipe autour d'un café. Sur le tableau
> blanc, elle a recopié les douze lignes de Noah, puis barré tout ce qu'une
> machine sait faire. Il reste une seule ligne. *« Le reste, on le confie à une
> chaîne. »* Thomas lève la main : *« Et qui la lance, la chaîne ? »* —
> *« Personne. Ton push. »*

La machine qui fait la check-list à la place de Noah s'appelle un **pipeline** :
une chaîne d'étapes qui s'enchaînent toutes seules, **à chaque push**.

```
 push ─▶ BUILD ─▶ TEST ─▶ PRÉPRODUCTION ─▶ PRODUCTION
           🟢       🔴        ⏸               ⏸
                    └─ tout s'arrête ici : rien n'est livré
```

### Trois étapes, une règle

| Étape | Ce que fait la machine | La question qu'elle pose |
|---|---|---|
| **Build** | Rassemble le code et ses dépendances, fabrique ce qui sera livré | « Est-ce que ça se construit ? » |
| **Test** | Lance tous les tests automatisés | « Est-ce que ça marche encore ? » |
| **Déploiement** | Installe la version en préproduction, puis en production | « Est-ce que ça tourne là-bas ? » |

La règle : **au premier rouge, la chaîne s'arrête.** Un test qui échoue, et rien
n'est déployé. Mardi, un pipeline aurait vu l'erreur à 17 h 46 sur la machine de
test — et la page d'accueil n'aurait jamais été blanche.

!!! fil "Au fil de l'heure"
    **Le build est vert, mais un test est rouge. Que reçoit la production ?**<span class="fil-cle" hidden>f01</span>

    `A` la nouvelle version, installée quand même · `B` rien : la chaîne s'arrête avant le déploiement · `C` la nouvelle version, sans ses tests · `D` un build relancé jusqu'à ce qu'il passe

### CI et CD : deux lettres, deux promesses

- **CI** — *Continuous Integration*, l'**intégration continue** : à chaque push,
  le code est construit et testé. On sait en quelques minutes si le changement
  casse quelque chose.
- **CD** — *Continuous Delivery*, la **livraison continue** : ce qui a passé les
  tests est prêt à partir, en un clic. Quand ce clic lui-même disparaît et que la
  production se met à jour seule, on parle de **déploiement continu**.

!!! fil "Au fil de l'heure"
    **Livraison continue, déploiement continu : qu'est-ce qui les sépare ?**<span class="fil-cle" hidden>f02</span>

    `A` le langage de programmation utilisé · `B` le nombre de tests lancés à chaque push · `C` un humain clique pour mettre en production, ou plus personne · `D` le nombre de développeurs de l'équipe

### Les tests automatisés : trois tailles

Un test automatisé est un petit programme qui vérifie un autre programme. On en
écrit de trois tailles, du plus petit au plus grand :

| Test | Il vérifie | Exemple chez DevSecure | Durée |
|---|---|---|---|
| **Unitaire** | une seule fonction, isolée du reste | « les tâches annulées ne comptent pas dans l'avancement » | quelques millisecondes |
| **D'intégration** | plusieurs morceaux qui se parlent | « le calcul lit bien la table des tâches » | quelques secondes |
| **De bout en bout** | le parcours d'un utilisateur, comme dans un navigateur | « la page d'accueil s'affiche et montre 60 % » | quelques minutes |

Beaucoup de petits tests rapides, quelques grands tests lents : le pipeline
reste court.

!!! fil "Au fil de l'heure"
    **« La page d'accueil s'affiche et montre 60 % » : de quel test s'agit-il ?**<span class="fil-cle" hidden>f03</span>

    `A` un test unitaire · `B` un test d'intégration · `C` un test de charge · `D` un test de bout en bout

### Préproduction et production

Avant la production, une étape intermédiaire : la **préproduction** — en anglais
*staging*. C'est une copie de la production, **sans les vrais utilisateurs**. On y
essaie la version dans les mêmes conditions, et on regarde. Si elle casse là,
elle casse devant l'équipe, pas devant le client.

!!! fil "Au fil de l'heure"
    **Pourquoi essayer une version en préproduction avant la production ?**<span class="fil-cle" hidden>f10</span>

    `A` pour qu'une panne arrive devant l'équipe, pas devant le client · `B` pour que la production aille plus vite · `C` pour garder une sauvegarde de la base · `D` pour éviter d'écrire des tests

> 🔑 **Un pipeline ne rend pas le code meilleur. Il rend l'erreur visible tôt,
> au même endroit, à chaque fois** — avant qu'elle n'arrive en production.

### 🧪 Indice n° 2 — remettez dans l'ordre, puis classez

**a.** Cinq cartes, mélangées : `déploiement en production` · `tests` · `push` ·
`déploiement en préproduction` · `build`.

**b.** Unitaire, intégration ou bout en bout ?

| # | Ce que vérifie le test | ? |
|---|---|---|
| 1 | Un robot ouvre le site, se connecte et télécharge le rapport | ? |
| 2 | La fonction d'arrondi transforme 59,6 en 60 | ? |
| 3 | Le calcul enregistre bien son résultat dans la base | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    **a.** Push → build → tests → préproduction → production. Le push **déclenche**,
    la production **termine**. Rien ne passe une étape tant que la précédente n'est
    pas verte.

    **b.** 1 — **de bout en bout** : le parcours complet, comme un utilisateur.
    2 — **unitaire** : une seule fonction, rien autour. 3 — **d'intégration** : le
    calcul et la base, deux morceaux qui se parlent.

    **Le piège** : mettre les tests après la préproduction. On teste **avant**
    d'installer quoi que ce soit, même sur une copie.

---

## 📦 ACTE III — LE COLIS STANDARDISÉ *(≈ 12 min)*

> **Mercredi, 10 h 15.** Thomas ouvre deux terminaux côte à côte. À gauche, son
> poste ; à droite, le serveur.
>
> ```
> thomas@poste:~$ python --version        noah@prod:~$ python --version
> Python 3.12.4                            Python 3.8.10
> ```
>
> *« Même code, deux Python. Mardi, c'est ça qui a planté »*, soupire-t-il.
> Noah hausse les épaules : *« Le serveur a quatre ans. On ne va pas le
> réinstaller à chaque fois que tu changes de version. »* Maya sourit :
> *« Et si c'était le code qui emportait son Python avec lui ? »*

Reste la deuxième panne de mardi : Python 3.12 sur le poste de Thomas, Python 3.8
sur le serveur. Le code était juste, **l'environnement** était différent. C'est
l'autre sens de « ça marche sur mon poste ».

### Le conteneur, comme au port

Avant 1956, on chargeait les bateaux caisse par caisse. Puis est arrivé le
**conteneur** : une boîte de taille standard, que la grue soulève sans savoir
ce qu'il y a dedans.

Un **conteneur logiciel** fait la même chose pour le code : une boîte qui emporte
**le code et tout ce dont il a besoin pour tourner** — la bonne version de
Python, les bibliothèques, la configuration. La boîte tourne pareil sur le poste
de Thomas, sur la machine de test et sur le serveur. L'outil le plus répandu
s'appelle **Docker**.

!!! fil "Au fil de l'heure"
    **Qu'est-ce qu'un conteneur emporte avec le code ?**<span class="fil-cle" hidden>f04</span>

    `A` tout ce dont il a besoin pour tourner · `B` le serveur entier, matériel compris · `C` les données des utilisateurs · `D` une copie du poste du développeur

### Trois mots à ne pas confondre

| Mot | Ce que c'est | L'image du port |
|---|---|---|
| **Dockerfile** | un fichier texte : la **recette** pour fabriquer l'image | le bon de chargement |
| **Image** | le **modèle figé**, construit une fois, identique partout | le conteneur fermé, plombé |
| **Conteneur** | une image **en marche** — on peut en lancer plusieurs | le conteneur ouvert, au travail |

Les images se rangent dans un **registre** — Docker Hub, ou celui de GitHub —
d'où chaque machine peut les télécharger.

!!! fil "Au fil de l'heure"
    **On lance trois exemplaires du rapport à partir de l'image 1.4. Combien y a-t-il d'images ?**<span class="fil-cle" hidden>f05</span>

    `A` trois · `B` une seule · `C` six · `D` aucune

### Lire un Dockerfile

Voici celui du rapport de DevSecure. Six lignes, une étape par ligne :

```dockerfile
FROM python:3.12-slim              # 1. partir d'une image qui contient Python 3.12
WORKDIR /app                       # 2. se placer dans le dossier /app de la boîte
COPY requirements.txt .            # 3. y copier la liste des dépendances
RUN pip install -r requirements.txt  # 4. les installer, une fois pour toutes
COPY . .                           # 5. copier le code
CMD ["python", "rapport.py"]       # 6. la commande lancée au démarrage
```

La ligne 1 règle la panne de mardi : la version de Python **est écrite dans le
fichier**. Ce n'est plus celle du serveur qui décide, c'est celle de l'image.

Et le Dockerfile se **commite dans Git**, comme le code.

!!! fil "Au fil de l'heure"
    **Dans le Dockerfile du rapport, quelle ligne fixe la version de Python ?**<span class="fil-cle" hidden>f06</span>

    `A` la ligne CMD · `B` la ligne COPY · `C` la ligne FROM · `D` la ligne WORKDIR

> 🔑 **Le conteneur ne corrige pas le code : il garantit que le code tourne dans
> le même environnement partout.** C'est lui que le pipeline fabrique à l'étape
> build, teste, puis livre.

### 🧪 Indice n° 3 — image, conteneur ou Dockerfile ?

| # | Phrase entendue dans l'équipe | ? |
|---|---|---|
| a | « J'ai ajouté une ligne pour installer la bibliothèque des graphiques » | ? |
| b | « Il y en a trois qui tournent en même temps sur le serveur » | ? |
| c | « La 1.4 est dans le registre, tu peux la télécharger » | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Réponse | Pourquoi |
    |---|---|---|
    | a | **Dockerfile** | On modifie la recette : une ligne `RUN pip install …` de plus. |
    | b | **Conteneurs** | Trois exemplaires en marche, lancés depuis la même image. |
    | c | **Image** | Le modèle figé, numéroté, rangé dans le registre. |

    **Le piège** : dire « conteneur » pour tout. L'image est le colis plombé,
    le conteneur est le colis ouvert et au travail — on en lance autant qu'on veut
    à partir d'une seule image.

---

## 📄 ACTE IV — LA CHAÎNE ÉCRITE DANS LE DÉPÔT *(≈ 8 min)*

> **Mercredi, 15 h 40.** Premier essai de la chaîne. Thomas pousse une petite
> modification du rapport, et l'onglet **Actions** de GitHub s'allume :
>
> ```
> ● Livrer le rapport   #1   main   push par thomas
>   ✓ tester › build            42 s
>   ✗ tester › tests            1 test en échec : test_page_accueil
>   ⏸ livrer                    non lancé — « tester » a échoué
> ```
>
> Rouge. Personne n'est content — et pourtant c'est la meilleure nouvelle de la
> semaine : l'erreur a été vue **sur une machine de test, à 15 h 41**, pas
> **par le client, à 17 h 52**. Thomas corrige, repousse : tout passe au vert.

Un pipeline n'est pas un logiciel qu'on achète : c'est **un fichier**, rangé dans
le dépôt, à côté du code. Sur GitHub, ces fichiers vivent dans le dossier
`.github/workflows/` et s'appellent des **workflows**. Le service qui les exécute
s'appelle **GitHub Actions**.

Voici celui que l'équipe de Noah a écrit mercredi matin :

```yaml
name: Livrer le rapport

on:                          # QUAND la chaîne se lance
  push:
    branches: [main]         #   → à chaque push sur main

jobs:
  tester:                    # PREMIER travail
    runs-on: ubuntu-latest   #   → sur une machine neuve, prêtée par GitHub
    steps:
      - uses: actions/checkout@v4          # récupérer le code
      - run: docker build -t rapport .     # build : fabriquer l'image
      - run: docker run rapport pytest     # test : lancer les tests DANS l'image

  livrer:                    # DEUXIÈME travail
    needs: tester            #   → seulement si « tester » est vert
    runs-on: ubuntu-latest
    steps:
      - run: ./deployer.sh preproduction
      - run: ./reconstruire_index.sh       # l'oubli de l'assistant, réglé
      - run: ./deployer.sh production
```

!!! fil "Au fil de l'heure"
    **À quel moment le workflow de l'équipe de Noah se lance-t-il ?**<span class="fil-cle" hidden>f11</span>

    `A` chaque nuit à minuit · `B` quand Noah clique sur un bouton · `C` à chaque modification du wiki · `D` à chaque push sur la branche main

Quatre mots suffisent pour le lire :

| Mot | Il répond à |
|---|---|
| **on** | *quand* ? — l'événement qui déclenche (ici, un push sur main) |
| **jobs** | *quoi* ? — les grands travaux (tester, livrer) |
| **steps** | *comment* ? — les commandes, une par ligne, dans l'ordre |
| **needs** | *dans quel ordre* ? — livrer attend que tester soit vert |

Les lignes 1, 2, 3, 9 et 11 de la check-list de Noah sont là ; la 4 — la
version de Python — est portée par l'image.

!!! fil "Au fil de l'heure"
    **Dans le workflow, que veut dire « needs: tester » sous le travail livrer ?**<span class="fil-cle" hidden>f07</span>

    `A` livrer et tester tournent en même temps · `B` livrer attend qu'un testeur humain valide · `C` tester attend que livrer soit terminé · `D` livrer ne démarre que si tester est vert

> 🎯 **Le twist** : le pipeline est lui-même du code. Il se commite, se relit en
> pull request, et se défait par un revert. **La façon de livrer se versionne
> comme ce qu'on livre.** Mardi, la check-list vivait dans un wiki ; mercredi,
> elle vit dans le dépôt.

### 🧪 Indice n° 4 — lisez le workflow

| # | Question | Votre réponse |
|---|---|---|
| a | Thomas pousse sur sa branche **correctif**. Le workflow se lance-t-il ? | ? |
| b | Un test échoue. La production est-elle mise à jour ? | ? |
| c | Quelle ligne aurait évité que l'assistant répète 47 ? | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Réponse | Pourquoi |
    |---|---|---|
    | a | **Non** | `on: push: branches: [main]` — seulement sur main. Pour tester aussi les branches, on ajouterait un déclencheur sur les pull requests. |
    | b | **Non** | `needs: tester` : le travail « livrer » ne démarre que si « tester » est vert. Au premier rouge, la chaîne s'arrête. |
    | c | **reconstruire_index.sh** | L'index est fabriqué par un script : on le met dans la chaîne, et personne n'a plus à s'en souvenir. |

    **Le piège** : croire que le workflow tourne sur le poste du développeur. Il
    tourne sur une **machine neuve** prêtée par GitHub, à chaque fois. C'est
    justement ce qui le rend fiable : rien ne traîne d'une fois sur l'autre.

---

> **Vendredi, 17 h 52.** Trois jours plus tard, à la minute près. Une nouvelle
> version part en production. Personne n'est connecté au serveur, Noah est
> déjà dans le train. L'assistant de Léa répond enfin **60 %** : son index a
> été reconstruit par la chaîne, comme le reste.

---

## 🧭 ACTE V — OUVREZ LE CAPOT *(≈ 2 min)*

Sur GitHub, ouvrez un projet public connu et cliquez sur l'onglet **Actions**.

1. Combien d'exécutions **vertes** et **rouges** voyez-vous sur la première page ?
2. Ouvrez-en une : combien de **jobs** compte-t-elle ?
3. Cherchez dans le dépôt un fichier nommé **Dockerfile** : par quelle image
   commence-t-il ?

> C'est le geste n° 6 du métier : **on ne livre pas à la main ce qu'une machine
> peut livrer à l'identique** — et la recette se range dans le dépôt.

---

## ✅ ÉPILOGUE — DANS L'APPLICATION

> Comme les semaines précédentes : dix questions, la correction s'affiche dès
> l'envoi, et le tableau de la classe se construit en direct.
>
> **Pas de note. Pas de copie à rendre.**

---

## 📚 Réviser après la séance

Les dix questions, pour vous re-tester chez vous. **Répondez d'abord, ouvrez les
réponses ensuite** — dans cet ordre, sinon ça ne sert à rien.

**1.** Pourquoi une mise en production faite à la main est-elle risquée ?
`A` elle consomme plus d'énergie sur le serveur · `B` elle est interdite par le règlement européen · `C` chaque geste repose sur la mémoire de quelqu'un · `D` elle n'est possible qu'après les heures de cours

**2.** Que fait l'intégration continue ?
`A` elle construit et teste le code à chaque push · `B` elle livre le code au client à la fin du projet · `C` elle fusionne toutes les branches à minuit · `D` elle évite de relire les pull requests

**3.** Dans un pipeline, une étape de test échoue. Que se passe-t-il ?
`A` le déploiement continue, avec un avertissement · `B` les tests sont relancés jusqu'à ce qu'ils passent · `C` le code fautif est effacé du dépôt · `D` la chaîne s'arrête et rien n'est déployé

**4.** Un test qui vérifie une seule fonction, isolée du reste, est un test :
`A` de bout en bout · `B` unitaire · `C` de charge · `D` d'intégration

**5.** À quoi sert la préproduction ?
`A` à garder une sauvegarde de la base de données · `B` à héberger le site les jours de panne · `C` à essayer la version sans les vrais utilisateurs · `D` à ranger les anciennes versions du code

**6.** Quelle est la différence entre une image et un conteneur ?
`A` l'image est le modèle figé, le conteneur l'image en marche · `B` l'image tourne sous Linux, le conteneur sous Windows · `C` l'image contient le code, le conteneur contient les tests · `D` aucune, ce sont deux noms pour la même chose

**7.** Que décrit un Dockerfile ?
`A` la liste des utilisateurs autorisés · `B` le réseau de l'entreprise · `C` le planning des mises en production · `D` les étapes pour fabriquer l'image

**8.** Pourquoi un conteneur règle-t-il la panne de Python de mardi ?
`A` il rend le code plus rapide à exécuter · `B` il emporte la bonne version de Python avec le code · `C` il interdit d'installer Python sur le serveur · `D` il traduit le code dans une version plus ancienne

**9.** Dans un workflow GitHub Actions, que dit la partie **on** ?
`A` sur quelle machine la chaîne tourne · `B` quelles commandes la chaîne lance · `C` quel événement déclenche la chaîne · `D` qui a le droit de modifier la chaîne

**10.** L'assistant répétait 47. Qu'est-ce qui l'en empêche désormais ?
`A` la reconstruction de l'index fait partie de la chaîne · `B` un second assistant vérifie le premier · `C` Léa reçoit une alerte chaque matin · `D` un test interdit d'afficher le chiffre 47

??? question "🔓 Vérifier mes réponses"

    | Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
    |---|---|---|---|---|---|---|---|---|---|----|
    | **Rép.** | C | A | D | B | C | A | D | B | C | A |

    - **8 à 10** — Vous savez dessiner la chaîne et ce qu'elle transporte. En S6,
      vous en construirez une, en binôme, sur un vrai petit projet.
    - **5 à 7** — Image, conteneur, Dockerfile se mélangent encore. Reprenez le
      tableau du port de l'acte III : la recette, le colis plombé, le colis au
      travail.
    - **0 à 4** — Retenez **deux** choses : un pipeline construit, teste et livre à
      chaque push, et s'arrête au premier rouge ; un conteneur emporte le code avec
      tout ce dont il a besoin, pour tourner pareil partout. Le reste s'accroche là.

### Le test de la check-list

Reprenez les douze lignes de Noah. Pour chacune, écrivez **où elle vit**
désormais : dans le workflow, dans le Dockerfile, ou nulle part.

??? question "🔓 Comparer"

    **Dans le Dockerfile** : 2 (installer les dépendances), 4 (la version de
    Python, dans la ligne FROM). **Dans le workflow** : 1, 3, 9, 11, et
    l'ouverture de la page d'accueil (10) devient un test de bout en bout.
    **À ajouter au workflow** : 6, 7, 8, 12 — sauvegarde, configuration,
    migration, version notée. **Nulle part** : la 5, remplacée par la
    notification d'Actions. Il ne reste aucune ligne qui dépende de la mémoire
    de Noah.

---

## 📝 À retenir de la séance 5

> Une **mise en production à la main** repose sur la mémoire de quelqu'un : on
> oublie, on ne fait jamais deux fois pareil. Un **pipeline CI/CD** fait la
> check-list à sa place, à chaque push : **build**, **tests**, **préproduction**,
> **production** — et **s'arrête au premier rouge**. Les **tests automatisés** ont
> trois tailles : **unitaire** (une fonction), **d'intégration** (des morceaux qui se
> parlent), **de bout en bout** (le parcours d'un utilisateur). Un **conteneur**
> emporte le code avec tout ce dont il a besoin : le **Dockerfile** est la recette,
> l'**image** le modèle figé et numéroté, le **conteneur** l'image en marche. Sur
> GitHub, le pipeline est un **workflow** écrit dans le dépôt — **on** dit quand,
> **jobs** et **steps** disent quoi et comment — et il se versionne comme le code.

Mardi, 17 h 52 : trois oublis, trois humains, dix-sept minutes de page blanche.
Personne n'avait mal travaillé — la check-list était bonne, et Noah l'avait
presque suivie. Désormais, quand quelqu'un proposera « une check-list de plus »,
vous saurez quoi répondre : **écris-la dans le workflow, et laisse la machine
s'en souvenir.**

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **Déployer à la main** — chaque geste repose sur la mémoire de quelqu'un : on
   oublie, on ne refait jamais pareil ; ce qui se répète se confie à une machine. [1 10]
2. **Le pipeline CI/CD** — build, tests, préproduction, production, enchaînés à
   chaque push ; au premier rouge, rien n'est livré. [2 3 5]
3. **Les tests automatisés** — unitaire pour une fonction, intégration pour des
   morceaux qui se parlent, bout en bout pour le parcours d'un utilisateur. [4]
4. **Le conteneur** — le Dockerfile est la recette, l'image le modèle figé, le
   conteneur l'image en marche : le code tourne pareil partout. [6 7 8]
5. **Le workflow** — le pipeline écrit dans le dépôt : on dit quand, jobs et steps
   disent quoi et comment ; il se versionne comme le code. [9 10]

---

## ⏭️ TEASER — SÉANCE 6

Vous savez lire une chaîne. La semaine prochaine, vous en construisez une : un
petit projet, un dépôt, un workflow — et votre premier pipeline vert. Ou rouge.
Dans les deux cas, vous saurez pourquoi.

**Séance 6 : atelier — votre premier pipeline, en binôme.**
