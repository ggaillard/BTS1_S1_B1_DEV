---
title: "SÉANCE 6 — « Rouge, puis vert »"
seance: 6
duree: "1 h"
notee: false
---

# SÉANCE 6 — « Rouge, puis vert »
### Atelier : votre premier pipeline, de la croix rouge à la coche verte

> **Séance 6 / 14** · Acte 1 — DevOps : industrialiser le code · **Durée : 1 h** · **100 % en ligne** · **TP formatif noté**
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

**Aujourd'hui, vous faites.** Les points de passage portent sur **votre**
dépôt : on n'y répond qu'en ayant fait l'étape. Répondre faux ne coûte rien ;
ne pas répondre, si — la suite reste fermée.

**Il vous faut un compte GitHub.** Pas encore de compte ? Créez-le maintenant
sur github.com, avec une adresse que vous consultez : deux minutes.

> Cette page-ci est la **trace écrite** de la séance : elle sert à **réviser après**,
> ou à rattraper si vous étiez absent.

---

## 🎬 COLD OPEN — lundi, 9 h, le chiffre de la direction

Lundi matin, la direction de DevSecure ouvre son rapport :

```
Avancement de la refonte du site : 47 %
```

Léa secoue la tête. *« C'est faux. Le calcul compte les tâches annulées comme
des tâches à faire. La règle de l'équipe dit le contraire, et le test qui le
prouve existe déjà. »* Maya ouvre le dépôt : le test est bien là. Il est rouge
depuis trois semaines. Personne ne le lance.

Mardi dernier, vous avez lu le pipeline de Maya. Aujourd'hui, Maya vous tend
le clavier : *« À vous de l'écrire. »*

**Le test sait déjà que le chiffre est faux. Ce qui manque, c'est une machine
qui le lance à chaque changement — et quelqu'un qui sache lire ce qu'elle
dit.** C'est l'objet de cette heure.

!!! info "Votre rôle aujourd'hui"
    Vous écrivez le pipeline, vous le voyez **rouge**, vous lisez pourquoi, vous
    corrigez le **code** sans toucher au test, et vous faites entrer la
    correction dans main par une pull request — jusqu'au **vert**.

---

## 🎯 Ce que vous saurez faire en sortant

| | Vous saurez… | Preuve |
|---|---|---|
| 📦 | Créer **votre** dépôt depuis un dépôt modèle | Point de passage I |
| 📄 | Écrire un fichier de **workflow** et le déclencher | Point de passage II |
| 🔴 | Lire une **croix rouge** : l'étape, le test, l'obtenu et l'attendu | Point de passage III |
| 🛠️ | Corriger le **code**, pas le test | Indice n° 2 |
| ✅ | Faire entrer une correction par une **pull request vérifiée** | Point de passage IV |

*Compétence visée : **B1C2** — développer des solutions applicatives, testées et livrées par une chaîne automatisée. TP formatif noté : grille du Bloc 1.*
*Prérequis : la séance 5. Si vous étiez absent, lisez d'abord « Mardi, 14 h 02 ».*

---

## 📦 ACTE I — VOTRE DÉPÔT *(≈ 6 min)*

Maya ne vous donne pas son dépôt : elle vous donne un **modèle**. Un dépôt
modèle se recopie en un clic, avec tous ses fichiers, dans un dépôt neuf **à
vous** : votre historique, vos commits, votre pipeline. Le modèle, lui, ne
bouge pas — trente étudiants peuvent partir du même.

1. Ouvrez le dépôt modèle :
   **[github.com/ggaillard/BTS1-Atelier-Pipeline](https://github.com/ggaillard/BTS1-Atelier-Pipeline)**.
2. Bouton vert **Use this template → Create a new repository**.
3. Propriétaire : **votre compte**. Nom : `atelier-pipeline-<prenom>`. Cochez **Public**.
   Puis **Create repository**.
4. Dans **votre** dépôt, ouvrez le dossier `tests`, puis `test_avancement.py`.

Chaque fonction qui commence par `test_` est une règle. Lisez la troisième :
3 tâches faites sur 4 qui comptent, l'annulée mise de côté — 75 %.

> 🔑 **Un dépôt à soi, créé depuis un modèle** : on part de la même base que
> tout le monde, et tout ce qu'on y fait — commits, pipeline, pull request —
> reste dans **son** historique, visible et daté.

<div class="tdc-ici" data-q="1"></div>

??? info "Pas de compte GitHub, ou GitHub inaccessible ? Le pipeline sur table"
    Faites l'atelier **sur papier**, en lisant cette page : écrivez le fichier de
    l'acte II à la main, prédisez quelle étape sera rouge et pourquoi (le code de
    l'acte III est dans la page), écrivez la correction. Envoyez une photo à la
    place du lien. Les questions de la page restent les mêmes.

---

## 📄 ACTE II — LE FICHIER DU PIPELINE *(≈ 12 min)*

Il manque au dépôt la seule chose qui compte aujourd'hui : le fichier qui dit à
GitHub **quand** lancer **quoi**. Il vit dans le dossier `.github/workflows`.

1. Dans votre dépôt : **Add file → Create new file**.
2. Nom du fichier — tapez-le tel quel, les dossiers se créent seuls :
   `.github/workflows/verifier.yml`
3. Collez ce contenu :

```yaml
name: Vérifier et livrer
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verifier:
    runs-on: ubuntu-latest
    steps:
      - name: Récupérer le code
        uses: actions/checkout@v4
      - name: Installer Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Installer les dépendances
        run: pip install -r requirements.txt
      - name: Lancer les tests
        run: pytest
      - name: Calculer l'avancement de la refonte
        run: python -m devsecure.rapport
```

4. **Commit changes…**, message : `Ajoute le pipeline de vérification`, puis
   **Commit changes**.

Vous reconnaissez le fichier de Maya, avec deux différences. Le bloc **on**
déclenche aussi le pipeline sur une **pull_request** : on teste une correction
**avant** qu'elle n'entre dans main. Et la dernière étape **affiche le chiffre**
que lit la direction.

> 🔑 **Le fichier de workflow** : on dit **quand** (un push sur main, une pull
> request), runs-on dit **sur quelle machine** — neuve à chaque fois —, steps
> dit **quoi, dans l'ordre**. Il est versionné avec le code.

<div class="tdc-ici" data-q="2"></div>

Votre commit vient d'arriver sur main : c'est un push. Ouvrez l'onglet
**Actions** de votre dépôt. Une exécution « Vérifier et livrer » tourne — un
rond jaune —, puis s'arrête. Cliquez dessus, puis sur le job **verifier**.

<div class="tdc-ici" data-q="3"></div>

Les étapes défilent, une coche verte chacune… jusqu'à une **croix rouge**. Ce
qui la suit est grisé : **pas lancé**.

<div class="tdc-ici" data-q="4"></div>

---

## 🔴 ACTE III — LIRE LA CROIX ROUGE *(≈ 9 min)*

Une croix rouge n'est pas une panne : c'est une **information**. Elle dit
toujours trois choses, et il faut les lire dans cet ordre.

| Ce qu'on lit | Où | Ce que ça dit |
|---|---|---|
| **L'étape** | la ligne marquée ❌ | ce qui a échoué : ici, les tests |
| **Le test** | la ligne `FAILED tests/…::test_…` | quelle règle n'est pas respectée |
| **L'écart** | la ligne `AssertionError: assert … == …` | à gauche ce que le **code a calculé**, à droite ce que le **test attendait** |

Ouvrez l'étape rouge. Descendez jusqu'à la ligne `AssertionError`.

<div class="tdc-ici" data-q="5"></div>

Maintenant, le code. Ouvrez `devsecure/avancement.py` dans votre dépôt :

```python
def avancement(taches):
    """Pourcentage de tâches faites, arrondi à l'unité.

    Règle de l'équipe : une tâche ANNULÉE ne compte pas — elle ne sera
    jamais faite, elle ne doit ni aider ni pénaliser l'avancement.
    Un projet sans tâche à compter est à 0 %.
    """
    if not taches:
        return 0
    faites = sum(1 for t in taches if t == "fait")
    return round(100 * faites / len(taches))
```

La règle est écrite en toutes lettres dans le commentaire. Et la dernière ligne
divise par **toutes** les tâches, annulées comprises. Faites le calcul à la
main sur les cinq tâches du test : vous retrouvez le nombre de gauche du journal.

> 🔑 **Lire une croix rouge** : l'étape, puis le test, puis l'écart entre ce que
> le code a **obtenu** et ce que le test **attendait**. L'écart dit presque
> toujours où chercher.

<div class="tdc-ici" data-q="6"></div>

### 🧪 Indice n° 1 — trouvez la correction

Sans encore rien modifier : quelles lignes faut-il changer pour que l'annulée
ne compte plus, ni dans le nombre de faites ni dans le total ?

??? question "🔓 Ouvrir le rapport d'expertise"

    On met d'abord de côté les tâches annulées, puis on calcule sur celles qui
    restent :

    ```python
        comptees = [t for t in taches if t != "annulee"]
        if not comptees:
            return 0
        faites = sum(1 for t in comptees if t == "fait")
        return round(100 * faites / len(comptees))
    ```

    **Le piège** : remplacer 75 par 60 dans le test. Le pipeline passerait au
    vert… et la direction continuerait de lire un faux chiffre. Le test dit la
    règle de l'équipe : c'est au code de la respecter.

---

## ✅ ACTE IV — CORRIGER PAR UNE PULL REQUEST *(≈ 13 min)*

En séance 4, on a vu qu'on ne modifie pas main directement : on travaille sur
une **branche** et on fait **relire** par une pull request. Aujourd'hui, le
premier relecteur est une machine.

1. Ouvrez `devsecure/avancement.py`, puis le crayon ✏️ **Edit this file**.
2. Faites la correction de l'indice n° 1 — **et rien d'autre**. Ne touchez pas
   au dossier `tests`.
3. **Commit changes…** Message : `Ne compte plus les tâches annulées dans l'avancement`.
   Choisissez **Create a new branch for this commit and start a pull request**,
   puis **Propose changes**.
4. Sur la page qui s'ouvre : **Create pull request**.

Regardez le bas de la pull request : « Some checks haven't completed yet », puis
**All checks have passed** et une coche verte. Le pipeline a tourné **sur votre
branche**, grâce au `pull_request` du bloc on — avant toute fusion.

<div class="tdc-ici" data-q="7"></div>

5. **Merge pull request**, puis **Confirm merge**.

La fusion est un push sur main : le pipeline repart. Ouvrez **Actions**, la
dernière exécution, l'étape **Calculer l'avancement de la refonte**.

> 🔑 **Corriger le code, pas le test, et par une pull request vérifiée** : le
> test dit la règle ; la pull request montre la coche verte **avant** la
> fusion. On ne fusionne que du vert.

<div class="tdc-ici" data-q="8"></div>

### 🧪 Indice n° 2 — et si Thomas modifiait le test ?

Thomas, pressé, propose une autre pull request : il remplace `== 75` par
`== 60` dans le test. Le pipeline est vert. Que répondez-vous en relecture ?

??? question "🔓 Ouvrir le rapport d'expertise"

    **On refuse la fusion.** Le pipeline est vert parce que la règle a été
    effacée, pas parce que le code la respecte. Le vert ne prouve que ce que
    les tests vérifient : modifier un test, c'est changer la règle — cela se
    discute avec l'équipe, cela ne se fait pas pour faire taire une croix rouge.

    C'est pour cela que la relecture humaine reste : la machine vérifie, la
    personne juge **ce qui** est vérifié.

<div class="tdc-ici" data-q="9"></div>

---

## 🧭 ACTE V — RENDRE *(≈ 3 min)*

Votre dépôt est votre rendu. Envoyez **par e-mail**, à l'adresse habituelle de
votre enseignant :

- objet : `[BTS1 Atelier pipeline] NOM Prénom` ;
- le **lien de votre dépôt** ;
- **trois phrases** : quelle étape était rouge et pourquoi ; ce que vous avez
  changé ; ce que vous feriez autrement.

> C'est le geste n° 7 du métier : **une correction ne vaut que si une machine
> l'a vérifiée et que tout le monde peut voir la coche** — sur main, pas sur
> son poste.

<div class="tdc-ici" data-q="10"></div>

---

## ✅ ÉPILOGUE — DANS L'APPLICATION

> Les points de passage de cette séance portaient sur **votre** dépôt. Le
> tableau de la classe s'est construit en direct ; votre dépôt, lui, sera relu
> pour la grille du TP.
>
> **TP formatif : il compte dans la moyenne de suivi, pas dans la note du BTS.**

---

## 📚 Réviser après la séance

Les dix questions de l'heure, pour vous re-tester chez vous. **Répondez sans
regarder plus haut**, puis relisez le passage de chaque question hésitante. La
correction n'est pas dans cette page : la révision de la séance vous est
proposée **sur le portail**, après l'heure.

**1.** Pourquoi créer votre dépôt depuis le modèle plutôt que travailler dans celui de l'enseignant ?
`A` pour ne pas avoir à écrire de message de commit · `B` parce que le dépôt modèle interdit de lire ses fichiers sans compte · `C` pour avoir votre propre historique et votre propre pipeline · `D` pour que vos commits partent dans le dépôt de l'enseignant

**2.** Dans votre fichier de workflow, quel bloc dit QUAND le pipeline se lance ?
`A` le bloc on, avec push et pull_request · `B` le bloc steps, avec la liste des étapes · `C` la ligne runs-on, avec la machine · `D` la ligne name, avec le titre du pipeline

**3.** Pourquoi le pipeline installe-t-il les dépendances à chaque exécution ?
`A` parce que pytest change de version à chaque commit · `B` parce que GitHub efface votre dépôt après chaque test · `C` parce que l'installation rend le code plus rapide · `D` parce que la machine est neuve et ne contient que le dépôt

**4.** Votre premier pipeline porte une croix rouge. Qu'est-ce que cela veut dire ?
`A` que GitHub a rencontré une panne sur ses serveurs · `B` qu'une étape a échoué et que la suite n'a pas été lancée · `C` que le fichier de workflow contient une faute de frappe · `D` que le dépôt doit être supprimé puis recréé

**5.** Dans une ligne « assert X == Y » d'un journal de tests, que représente X ?
`A` ce que la fonction a calculé pour les tâches du test · `B` ce que le test attendait comme résultat pour ces tâches-là · `C` le numéro de la ligne où se trouve l'erreur · `D` le temps mis par le pipeline, en secondes

**6.** Le test attend 75 % pour trois tâches faites, une annulée et une à faire. Quelle règle exprime-t-il ?
`A` une tâche annulée compte comme une tâche faite, pour encourager · `B` un projet n'atteint jamais cent pour cent · `C` les tâches annulées ne comptent pas dans le calcul · `D` le résultat est toujours arrondi à la dizaine

**7.** Où le pipeline a-t-il tourné quand vous avez proposé la correction ?
`A` sur votre poste, avant l'envoi · `B` sur main uniquement, une fois la correction fusionnée · `C` sur le dépôt modèle de l'enseignant · `D` sur votre branche, avant toute fusion

**8.** Pourquoi passer par une pull request plutôt que modifier main directement ?
`A` parce que GitHub ne permet pas de modifier main · `B` pour voir la coche verte avant que la correction n'entre dans main · `C` pour que la correction soit faite par une autre personne · `D` parce qu'une pull request lance les tests plus vite

**9.** Thomas rend le pipeline vert en remplaçant 75 par 60 dans le test. Que faire en relecture ?
`A` fusionner, puisque le pipeline est vert · `B` relancer le pipeline pour vérifier qu'il reste vert · `C` refuser : il a changé la règle au lieu de corriger le code · `D` supprimer le test, qui gênait depuis trois semaines

**10.** Au fond, qu'avez-vous construit aujourd'hui ?
`A` une machine qui vérifie chaque changement à partir du dépôt seul · `B` un programme qui trouve et corrige tout seul les erreurs dans le code · `C` une sauvegarde automatique du dépôt chaque nuit · `D` un rapport que la direction remplit elle-même

### Le test du fichier vide

Sans regarder plus haut, écrivez de mémoire les six premières lignes d'un
fichier de workflow qui lance les tests à chaque push sur main et à chaque pull
request. Puis comparez avec l'acte II.

??? question "🔓 Comparer"

    Un **name**, un bloc **on** avec push (branches main) et pull_request, un
    bloc **jobs**, un job, son **runs-on**, puis ses **steps**. Si votre version
    oublie pull_request, relisez l'acte IV : c'est lui qui teste la correction
    avant la fusion.

---

## 📝 À retenir de la séance 6

> On crée **son** dépôt depuis un **modèle** : même départ pour tous, un
> historique à soi. Le **fichier de workflow**, dans `.github/workflows`, dit
> **quand** lancer (on : push, pull_request), **sur quelle machine** (runs-on,
> neuve à chaque fois) et **quoi** (steps, dans l'ordre). Une **croix rouge** se
> lit dans l'ordre : l'étape, le test, puis l'écart entre ce que le code a
> **obtenu** et ce que le test **attendait**. On corrige le **code**, pas le
> test : le test dit la règle. La correction passe par une **pull request** sur
> laquelle le pipeline tourne **avant** la fusion : on ne fusionne que du vert.

Lundi, la direction lisait 47 %. Personne n'avait menti : le test le disait
depuis trois semaines, mais personne ne le lançait. Aujourd'hui, une machine le
lance à chaque changement, et vous savez la lire : **rouge, puis vert** — et
cette fois, le chiffre est le bon : 60 %.

---

## 🎓 Concepts à connaître

*La liste qu'on projette à la fin de l'heure. Pour chacun, une seule question :
**sauriez-vous l'expliquer à voix haute, sans regarder ?** C'est aussi sur ces
concepts que portera le contrôle d'entrée de la séance suivante.*

1. **Son dépôt depuis un modèle** — même départ pour tous, un historique et un
   pipeline à soi. [1]
2. **Le fichier de workflow** — on dit quand, runs-on sur quelle machine, steps
   quoi et dans quel ordre ; il est versionné avec le code. [2 3]
3. **Lire une croix rouge** — l'étape, le test, puis l'écart entre l'obtenu et
   l'attendu. [4 5]
4. **Corriger le code, pas le test** — le test dit la règle ; on ne le change
   que si la règle change. [6 9]
5. **La pull request vérifiée** — le pipeline tourne sur la branche avant la
   fusion : on ne fusionne que du vert. [7 8 10]

---

## ⏭️ TEASER — SÉANCE 7

Le pipeline est vert, le chiffre est juste, la refonte part en production.
Mercredi, Sami ouvre les journaux du serveur et pâlit : quelqu'un a tapé, dans
le champ de recherche du site, une phrase qui n'était pas une recherche — et la
base lui a répondu. Tous les tests étaient verts.

**Séance 7 : quand le code fait exactement ce qu'on lui demande — et que c'est
le problème.**
