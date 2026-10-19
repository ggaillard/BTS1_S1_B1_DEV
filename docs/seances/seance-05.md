---
title: "SÉANCE 5 — « Mardi, 14 h 02 »"
seance: 5
duree: "1 h"
notee: false
---

# SÉANCE 5 — « Mardi, 14 h 02 »
### La machine qui teste et qui livre — et la boîte qui fait tourner le code partout pareil

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
3. Avancez **acte par acte**. Une question arrive **juste après la notion
   qu'elle vérifie** ; la suite de la page s'affiche quand vous avez répondu.

**Aucune note ne sera mise.** Répondre faux ne coûte rien : l'explication
s'affiche, et vous continuez. Ne pas répondre, si — la suite reste fermée.

**Vos réponses viennent de vous.** Les questions portent sur ce que montre
cette page : une IA qui ne l'a pas lue répond à côté. Et quitter la page
pendant une question est signalé à l'enseignant.

> Cette page-ci est la **trace écrite** de la séance : elle sert à **réviser après**,
> ou à rattraper si vous étiez absent.

---

## 🎬 COLD OPEN — 14 h 02, la page d'accueil tombe

La correction de Thomas est enfin dans main. Mardi, à 13 h 55, Maya la met
en production. À la main, comme d'habitude : elle copie les fichiers sur le
serveur, puis redémarre l'application. Voici le journal du serveur :

```
13:55  copie des fichiers sur le serveur ............ ok
13:58  redémarrage de l'application ................. ok
14:02  GET /accueil  →  500 Internal Server Error
14:02  ModuleNotFoundError: No module named 'pandas'
```

Un **500** : la séance 2 vous l'a appris, c'est le serveur qui a échoué.
Thomas jure qu'il n'a rien cassé : *« Chez moi, tout passe. »* Personne n'a
relancé les tests avant de livrer — *« on n'avait pas le temps »*. Et
personne ne savait que Thomas avait installé, sur son poste seulement, une
bibliothèque nommée **pandas**.

Pendant ce temps, l'assistant de Léa répond toujours 47. Personne n'a
reconstruit son index.

**Deux oublis, et chaque fois un humain qui devait s'en souvenir. Et si ce
n'était pas à un humain de s'en souvenir ?** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    La direction vous demande ce qui aurait empêché **le 14 h 02**. À la fin
    de l'heure, vous saurez décrire la machine qui teste et qui livre à la
    place des humains — et la boîte qui fait tourner le code partout pareil.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 🔁 | Dire ce que fait l'**intégration continue** à chaque push | Indice n° 1 |
| 🚦 | Expliquer pourquoi une étape **rouge** arrête toute la livraison | Acte I |
| 🧪 | Distinguer tests **unitaires**, d'**intégration** et **de bout en bout** | Indice n° 2 |
| 📦 | Expliquer la différence entre une **image** et un **conteneur** | Indice n° 3 |
| 📄 | Lire un fichier de **pipeline** et dire ce qui le déclenche | Indice n° 4 |

*Compétence visée : **B1C2** — développer des solutions applicatives, en les testant et en les livrant sans s'en remettre à la mémoire de quelqu'un. Prépare le dossier de choix d'architecture (**A1.3.2**).*
*Prérequis : la séance 4. Si vous étiez absent, lisez d'abord « Ça marche sur mon poste ».*

---

## 🔁 ACTE I — LA CHAÎNE QUI NE DORT PAS *(≈ 11 min)*

En séance 4, vous avez vu le trajet d'une correction : branche, commit, push,
pull request, merge. Le défaut du mardi est **après** le merge : entre main et
la production, il n'y avait que la mémoire de Maya.

### L'intégration continue

L'**intégration continue** — on dit souvent **CI**, pour *continuous
integration* — confie ce passage à une machine. **À chaque push**, un serveur
récupère le code, l'**installe** sur une machine propre, et lance **tous les
tests**. Personne ne décide de le faire : le push suffit.

La machine propre est le point décisif. Elle ne contient que ce que le dépôt
déclare. Si pandas n'est écrit nulle part dans le projet, elle ne l'a pas, et
le test casse **sur la machine de la CI**, mardi à 13 h 40 — pas sur la page
d'accueil à 14 h 02.

> 🔑 **La CI ne fait pas confiance au poste du développeur.** Elle reconstruit
> le projet à partir du dépôt seul, à chaque push : ce qui manque au dépôt
> manque aussi à la CI, et cela se voit tout de suite.

<div class="tdc-ici" data-q="1"></div>

### Le pipeline : des étapes, et un feu rouge

La suite de ce que fait la machine s'appelle un **pipeline**. Chaque étape
attend que la précédente ait réussi. Voici celui que Maya installe le
lendemain, avec son tableau de bord :

```
push de Thomas
   │
   ├─ 1. installer       ✅  12 s
   ├─ 2. tests unitaires  ❌  ModuleNotFoundError: No module named 'pandas'
   ├─ 3. construire l'image      ⏸  pas lancé
   └─ 4. déployer en préproduction  ⏸  pas lancé
```

Une étape **rouge arrête tout** : rien de ce qui suit n'est lancé, donc rien
n'arrive en production. C'est voulu. Un pipeline qui continuerait malgré un
test rouge livrerait exactement le mardi qu'on veut éviter.

Après la CI viennent deux mots proches. La **livraison continue** prépare une
version prête à partir, qu'un humain envoie en production d'un clic. Le
**déploiement continu** va jusqu'au bout tout seul, dès que tout est vert. On
dit **CI/CD** pour l'ensemble.

> 🔑 **Rouge veut dire « stop », pas « attention ».** L'étape qui échoue arrête
> la chaîne, et le développeur l'apprend en quelques minutes — avec le message
> d'erreur sous les yeux.

<div class="tdc-ici" data-q="2"></div>

### 🧪 Indice n° 1 — remettez dans l'ordre

Cinq étapes d'un pipeline, mélangées. Remettez-les dans l'ordre où la machine
les fait.

`déployer en production` · `lancer les tests` · `récupérer le code poussé` · `déployer en préproduction` · `installer les dépendances`

??? question "🔓 Ouvrir le rapport d'expertise"

    1. **Récupérer le code poussé** — exactement celui du dépôt, rien d'autre.
    2. **Installer les dépendances** — celles que le projet déclare.
    3. **Lancer les tests** — un seul rouge, et tout s'arrête ici.
    4. **Déployer en préproduction** — une copie de la production, pour vérifier.
    5. **Déployer en production** — seulement si tout est vert.

    **Le piège** : mettre les tests après la préproduction. On teste avant de
    déployer, jamais après : c'est l'erreur du mardi.

---

## 🧪 ACTE II — TROIS ÉTAGES DE TESTS *(≈ 9 min)*

« Lancer les tests », mais lesquels ? Une équipe en écrit de trois sortes, et
elles ne coûtent pas le même prix.

| Étage | Ce qu'il vérifie | Exemple chez DevSecure | Durée |
|---|---|---|---|
| **Test unitaire** | une seule fonction, isolée | le calcul de l'avancement rend 60 % | quelques millisecondes |
| **Test d'intégration** | plusieurs morceaux ensemble | le calcul lit vraiment la base des projets | quelques secondes |
| **Test de bout en bout** | le parcours d'un utilisateur, dans un navigateur piloté | ouvrir l'accueil, voir le bon chiffre | quelques minutes |

On en écrit **beaucoup** d'unitaires, rapides et précis ; **moins**
d'intégration ; **peu** de bout en bout, lents et fragiles. On parle de la
**pyramide des tests** : la base large, la pointe étroite.

Le test unitaire du calcul de Thomas tient en quatre lignes :

```python
def test_avancement_ignore_les_taches_annulees():
    taches = [fait, fait, fait, annulee, a_faire]
    assert avancement(taches) == 75
```

Ce test dit ce qu'on attend, il le vérifie à chaque push, et il ne se lasse
jamais. Mardi, aucun test n'a été lancé : la machine l'aurait fait.

> 🔑 **Un test est une phrase qui dit ce qu'on attend, et que la machine vérifie
> à chaque push.** Le bout en bout voit ce que voit l'utilisateur — mais il est
> lent : on en garde peu, pour les parcours qui comptent.

<div class="tdc-ici" data-q="3"></div>

### La préproduction

Reste un endroit entre la CI et les clients : la **préproduction** — on dit
aussi *staging*. C'est une **copie** de la production, avec de fausses données.
On y déploie d'abord, on y lance les tests de bout en bout, et on regarde. Si
quelque chose casse, cela casse là, pas devant 9 400 utilisateurs.

<div class="tdc-ici" data-q="4"></div>

### 🧪 Indice n° 2 — quel étage ?

| # | Test | Unitaire, intégration ou bout en bout ? |
|---|---|---|
| a | Vérifier que la fonction d'arrondi transforme 74,6 en 75 | ? |
| b | Ouvrir l'accueil dans un navigateur piloté et lire le chiffre affiché | ? |
| c | Vérifier que le calcul retrouve bien les tâches enregistrées en base | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Étage | Pourquoi |
    |---|---|---|
    | a | **Unitaire** | Une seule fonction, aucune base, aucun écran : millisecondes. |
    | b | **Bout en bout** | Le parcours de l'utilisateur, tel qu'il le voit. Lent, mais c'est le seul qui aurait vu la page d'accueil en 500. |
    | c | **Intégration** | Deux morceaux ensemble : le code et la base. |

    **Le piège** : croire que le bout en bout suffit. Il dit *que* ça casse,
    rarement *où*. L'unitaire dit où, en une ligne.

---

## 📦 ACTE III — LA BOÎTE QUI VOYAGE *(≈ 12 min)*

Même avec des tests, une question reste ouverte : la machine de la CI, celle de
la préproduction et celle de la production sont-elles **pareilles** que le poste
de Thomas ? Une autre version de Python, une bibliothèque en trop, et « ça
marche sur mon poste » revient par la fenêtre.

### Le conteneur : un colis standardisé

Pensez aux conteneurs des cargos. Le port ne sait pas ce qu'il y a dedans — des
bananes ou des vélos — mais il sait le **soulever, l'empiler, le transporter**,
parce que la boîte a toujours la même forme.

Un **conteneur** logiciel, c'est la même idée : on emballe l'application **avec
tout ce dont elle a besoin** — la version de Python, pandas, les fichiers — dans
une boîte qui tourne de la même façon sur le poste, sur la CI et en production.
L'outil le plus répandu s'appelle **Docker**.

### L'image et le conteneur

Deux mots à ne pas confondre :

| | Ce que c'est | L'analogie |
|---|---|---|
| **Image** | le modèle figé, fabriqué une fois, avec un nom et une version | la recette, ou le moule |
| **Conteneur** | une exécution de cette image, qui tourne en ce moment | le gâteau sorti du moule |

D'une seule image, on lance autant de conteneurs qu'on veut, tous identiques.
Et l'image porte une **étiquette de version**, comme un commit porte son
identifiant : *devsecure-accueil:1.4.2* désigne une boîte précise, jamais
« la dernière ».

> 🔑 **On ne livre plus des fichiers, on livre une image.** Celle qu'on a testée
> en CI est exactement celle qui tourne en production : il n'y a plus de
> « chez moi » et de « chez eux ».

<div class="tdc-ici" data-q="5"></div>

### Le Dockerfile : la recette, écrite

L'image se fabrique à partir d'un fichier texte, le **Dockerfile**, versionné
dans Git avec le code. Voici celui de DevSecure :

```dockerfile
FROM python:3.12-slim                          # 1. la base : un système et Python 3.12
WORKDIR /app                                   # 2. le dossier de travail dans la boîte
COPY requirements.txt .                        # 3. la liste des dépendances…
RUN pip install -r requirements.txt            # 4. …installées DANS l'image
COPY . .                                       # 5. le code de l'application
CMD ["python", "-m", "devsecure.serveur"]      # 6. ce qui se lance au démarrage
```

La ligne 4 est celle qui manquait mardi. Les dépendances sont écrites dans
**requirements.txt**, installées dans l'image, et voyagent avec elle. Si pandas
n'est pas dans ce fichier, l'image ne l'a pas — et le test de la CI le dit.

<div class="tdc-ici" data-q="6"></div>

### Ce n'est pas une machine virtuelle

Une **machine virtuelle** embarque un système d'exploitation entier : elle pèse
des gigaoctets et démarre en une minute. Un conteneur **partage le noyau** du
système qui l'accueille : il pèse souvent quelques dizaines de mégaoctets et
démarre en une seconde. C'est ce qui permet d'en lancer à chaque push.

<div class="tdc-ici" data-q="7"></div>

### 🧪 Indice n° 3 — lisez la recette

Dans le Dockerfile ci-dessus, trouvez :

| # | Question | Ligne ? |
|---|---|---|
| a | Où choisit-on la version de Python ? | ? |
| b | Où les dépendances entrent-elles dans l'image ? | ? |
| c | Quelle ligne dit ce qui tourne quand le conteneur démarre ? | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Ligne | Pourquoi |
    |---|---|---|
    | a | **1** — `FROM python:3.12-slim` | La base de l'image fixe la version : 3.12 partout, sur tous les postes. |
    | b | **4** — `RUN pip install` | L'installation se fait en fabriquant l'image, une fois pour toutes. |
    | c | **6** — `CMD` | La commande lancée par chaque conteneur créé depuis l'image. |

    **Le piège** : croire que `COPY . .` suffit à apporter pandas. Elle copie
    **le code**, pas les bibliothèques installées sur le poste de Thomas.

---

## 📄 ACTE IV — LIRE UN PIPELINE *(≈ 9 min)*

Un pipeline s'écrit, lui aussi, dans un fichier versionné. Sur GitHub, il vit
dans le dossier **.github/workflows** du dépôt, et c'est **GitHub Actions** qui
l'exécute. Voici celui que Maya a commité le mercredi :

```yaml
name: Vérifier et livrer          # 1
on:                               # 2  QUAND le lancer
  push:                           # 3    à chaque push…
    branches: [main]              # 4    …sur la branche main
jobs:                             # 5
  verifier:                       # 6
    runs-on: ubuntu-latest        # 7  une machine propre, neuve à chaque fois
    steps:                        # 8
      - uses: actions/checkout@v4                   # 9  récupérer le code
      - run: pip install -r requirements.txt        # 10 installer les dépendances
      - run: pytest                                 # 11 lancer les tests
      - run: docker build -t devsecure-accueil .    # 12 construire l'image
```

Ligne par ligne : **on** dit ce qui déclenche le pipeline — ici, un push sur
main. **runs-on** choisit la machine, neuve à chaque fois. **steps** liste les
étapes, dans l'ordre. Si **pytest** échoue à la ligne 11, la ligne 12 n'est
jamais exécutée : pas d'image, pas de livraison.

Sur GitHub, chaque commit porte alors une petite marque : une **coche verte**
si le pipeline est passé, une **croix rouge** sinon. La pull request l'affiche
avant le merge : on ne fusionne plus sans savoir.

<div class="tdc-ici" data-q="8"></div>

### Et l'assistant qui répond 47 ?

Le même mécanisme règle le second oubli. Léa ajoute au dépôt un deuxième
pipeline, déclenché **chaque fois qu'un compte rendu ou le fichier du modèle
change** : il recalcule l'index vectoriel, avec le modèle noté dans le dépôt, et
date le résultat. La séance 4 disait que l'index se versionne ; ici, il se
**reconstruit tout seul**.

> 🔑 **Ce qui doit être refait à chaque changement ne dépend plus de la mémoire
> de quelqu'un.** C'est le geste « automatiser » de la séance 4, écrit dans un
> fichier que toute l'équipe peut lire.

<div class="tdc-ici" data-q="9"></div>

### 🧪 Indice n° 4 — lisez le fichier

| # | Question | Votre réponse |
|---|---|---|
| a | Thomas pousse sur sa branche **correctif**, pas sur main. Le pipeline se lance-t-il ? | ? |
| b | Le test de la ligne 11 échoue. Que devient la ligne 12 ? | ? |
| c | Pourquoi la machine est-elle neuve à chaque fois ? | ? |

??? question "🔓 Ouvrir le rapport d'expertise"

    | # | Réponse | Pourquoi |
    |---|---|---|
    | a | **Non** | Les lignes 3 et 4 ne déclenchent le pipeline que sur main. Beaucoup d'équipes ajoutent donc **pull_request** à la ligne 2, pour tester avant le merge. |
    | b | **Elle n'est pas exécutée** | Une étape rouge arrête la suite : aucune image n'est construite. |
    | c | **Pour ne rien hériter d'un poste** | Ce qui n'est pas dans le dépôt n'existe pas pour elle — exactement ce qui a manqué mardi. |

    **Le piège** : croire que le fichier est « de la configuration » à part.
    Il est versionné avec le code, relu en pull request, et il a un historique.

---

## 🧭 ACTE V — OUVREZ LE CAPOT *(≈ 2 min)*

Sur GitHub, ouvrez un projet public connu et cliquez sur l'onglet **Actions**.

1. Combien de pipelines ont tourné aujourd'hui ?
2. Trouvez une **croix rouge** : quelle étape a échoué ?
3. Ouvrez le dossier **.github/workflows** : qu'est-ce qui déclenche le pipeline ?

> C'est le geste n° 6 du métier : **ce qui se répète à chaque changement est
> écrit dans un fichier, et c'est une machine qui le fait.**

<div class="tdc-ici" data-q="10"></div>

---

## ✅ ÉPILOGUE — DANS L'APPLICATION

> Cette semaine, les questions sont venues **au fil des actes**, juste après la
> notion qu'elles vérifient. Le tableau de la classe s'est construit en direct.
>
> **Pas de note. Pas de copie à rendre.**

---

## 📚 Réviser après la séance

Les dix questions de l'heure, pour vous re-tester chez vous. **Répondez sans
regarder plus haut**, puis relisez le passage de chaque question hésitante. La
correction n'est pas dans cette page : la révision de la séance vous est
proposée **sur le portail**, après l'heure, avec l'explication de chaque
réponse.

**1.** Mardi, qu'aurait fait l'intégration continue au moment du push de Thomas ?
`A` elle aurait recopié tel quel le poste de Thomas sur le serveur de production · `B` elle aurait reconstruit le projet sur une machine propre et lancé les tests · `C` elle aurait envoyé un courriel à Maya pour lui rappeler de tester · `D` elle aurait attendu la fin de la journée pour tout livrer ensemble

**2.** Dans le pipeline du lendemain, les tests unitaires sont rouges. Que deviennent les étapes suivantes ?
`A` elles se lancent quand même, mais en affichant un avertissement · `B` elles se lancent seulement si Thomas confirme par un clic · `C` elles ne sont pas lancées, et rien n'arrive en production · `D` elles sont rejouées automatiquement jusqu'à devenir vertes

**3.** Quel test vérifie une seule fonction, isolée, en quelques millisecondes ?
`A` le test unitaire · `B` le test de bout en bout · `C` le test d'intégration · `D` le test en préproduction

**4.** À quoi sert la préproduction ?
`A` à stocker les anciennes versions qui ne servent plus · `B` à faire tourner les tests unitaires plus vite que sur le poste du développeur · `C` à remplacer la production pendant la nuit · `D` à essayer la version sur une copie de la production avant les clients

**5.** Quelle est la différence entre une image et un conteneur ?
`A` l'image est le modèle figé, le conteneur une exécution de ce modèle · `B` l'image est une capture d'écran, le conteneur une archive · `C` l'image tourne seulement sur le poste, le conteneur seulement en production · `D` aucune, ce sont deux noms pour la même chose

**6.** Dans le Dockerfile de DevSecure, quelle ligne aurait évité l'erreur de pandas, à condition que pandas soit dans requirements.txt ?
`A` la ligne 1, qui sélectionne la version de Python à utiliser · `B` la ligne 5, qui copie le code de l'équipe dans l'image · `C` la ligne 6, qui démarre l'application au lancement · `D` la ligne 4, qui installe les dépendances dans l'image

**7.** Pourquoi peut-on lancer un conteneur à chaque push, alors qu'on ne le ferait pas avec une machine virtuelle ?
`A` parce qu'un conteneur n'a besoin d'aucun système pour tourner · `B` parce qu'il partage le noyau de l'hôte : léger, il démarre en une seconde · `C` parce qu'un conteneur ne peut contenir qu'un seul fichier · `D` parce que GitHub interdit les machines virtuelles dans ses pipelines

**8.** Dans le fichier de Maya, que dit le bloc on, avec push et branches main ?
`A` le système d'exploitation de la machine sur laquelle le pipeline tourne · `B` la liste des étapes, dans l'ordre où elles s'exécutent · `C` ce qui déclenche le pipeline : un push sur la branche main · `D` le nom de l'image construite à la fin

**9.** L'assistant répondait toujours 47. Qu'est-ce qui règle ce second oubli ?
`A` un pipeline qui reconstruit l'index dès qu'un document ou le modèle change · `B` un message de Léa à l'équipe chaque lundi matin · `C` un assistant plus puissant, qui devine les nouveaux chiffres · `D` la suppression des anciens comptes rendus de la base

**10.** Au fond, qu'est-ce qui a manqué mardi à 14 h 02 ?
`A` un serveur plus puissant pour la page d'accueil · `B` un développeur plus prudent que Thomas · `C` une machine qui teste et livre à partir du dépôt seul · `D` une sauvegarde de la base faite chaque soir

### Le test des trois lignes

Sans regarder plus haut, écrivez les trois premières lignes du Dockerfile d'une
application Python qui a besoin de pandas. Puis comparez avec l'acte III.

??? question "🔓 Comparer"

    Une base qui fixe la version (`FROM python:3.12-slim`), un dossier de travail,
    puis **la liste des dépendances copiée et installée dans l'image** — avant le
    code. Si votre version installe pandas « sur le poste », relisez la ligne 4 :
    ce qui n'est pas dans l'image ne voyage pas.

---

## 📝 À retenir de la séance 5

> L'**intégration continue** reconstruit le projet sur une machine propre à chaque
> push et lance les tests : ce qui manque au dépôt se voit tout de suite. Le
> **pipeline** enchaîne les étapes, et une étape **rouge arrête tout**. On teste à
> trois étages — **unitaire**, **intégration**, **bout en bout** — beaucoup en bas
> de la pyramide, peu en haut, et l'on essaie d'abord en **préproduction**. Un
> **conteneur** emballe l'application avec ses dépendances : l'**image** est le
> modèle figé et versionné, le conteneur son exécution ; le **Dockerfile** en est la
> recette. Le pipeline lui-même s'écrit dans un fichier versionné, que **GitHub
> Actions** exécute à chaque push.

Personne n'a menti, mardi. Thomas avait raison sur son poste, Maya avait bien
copié les fichiers. Ce qui a manqué à 14 h 02, c'est une machine qui ne fait
confiance qu'au dépôt, et qui n'oublie jamais de tester. Désormais, quand
quelqu'un dira « on n'avait pas le temps de relancer les tests », vous saurez
quoi répondre : **ce n'est plus à toi de t'en souvenir — c'est écrit dans le
pipeline.**

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **L'intégration continue** — à chaque push, une machine propre reconstruit le
   projet depuis le dépôt seul et lance les tests. [1 10]
2. **Le pipeline** — des étapes enchaînées ; une étape rouge arrête la suite, et rien
   n'arrive en production. [2 8]
3. **Les étages de tests** — unitaire, intégration, bout en bout ; on essaie d'abord en
   préproduction. [3 4]
4. **Image et conteneur** — l'image est le modèle figé et versionné, le conteneur son
   exécution ; le Dockerfile en est la recette. [5 6 7]
5. **Automatiser ce qui se répète** — tests, images, index : ce qui doit être refait à
   chaque changement est écrit dans un fichier et fait par une machine. [9 10]

---

## ⏭️ TEASER — SÉANCE 6

La semaine prochaine, c'est vous qui écrivez le pipeline. Un petit projet, un
dépôt, un test qui doit passer au vert — et une croix rouge que vous devrez
faire disparaître sans toucher au test.

**Séance 6 : atelier — votre premier pipeline.**
