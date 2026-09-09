# BTS SIO 1 — Bloc 1 « DEV » — Semestre 1

Support de cours de Guillaume Gaillard, année 2026-2027.
14 séances d'1 h, 100 % en ligne. Fil rouge : *Du code au service — les 4 cultures Ops*
(DevOps → DevSecOps → DataOps → MLOps).

Répondre en **français**. Modifier directement les fichiers, ne pas se contenter de suggérer.

---

## Architecture

| Couche | Technologie | Où |
|---|---|---|
| Contenu | MkDocs Material | `docs/`, publié par GitHub Actions sur GitHub Pages |
| Suivi élève | Supabase (région Frankfurt) | projet `pjuymnnblbydpjlpnoeh` |
| Interactivité | `docs/assets/suivi.js`, sans framework | vanilla JS |

Ancienne plateforme : `suivi.gaillard42.workers.dev` (Cloudflare Worker). **Décommissionnée.**
Ne plus jamais référencer cette adresse dans un contenu.

**L'entrée étudiante est le portail**, jamais ce site : `https://ggaillard.github.io/portail-bts/`.
C'est le passage par le portail qui enregistre la présence et la progression ; on
arrive ici depuis « Vos projets ». Ne jamais annoncer l'adresse du site comme
point d'entrée, même si c'est la page qu'ils ont sous les yeux.

**`docs/` est la source de vérité.** Les fichiers hors de `docs/` (`README.md` mis à
part, qui est la page d'accueil GitHub) sont des archives : ne pas les faire vivre
en parallèle.

```
docs/
├── index.md              page d'accueil (ex-README élève)
├── progression.md        compétences séance par séance
├── rgpd.md               mention légale
├── seances/seance-NN.md  une séance par fichier
└── assets/
    ├── config.js         url + clé anon + code classe
    ├── suivi.js          composant de suivi élève
    └── extra.css         surcharges du thème
```

---

## Le quiz et le suivi

Chaque séance se termine par « Réviser après la séance » : dix questions numérotées
`**1.**` à `**10.**`, chacune suivie d'une ligne d'options `` `A` libellé · `B` … ``.
Ce n'est pas une mise en forme, c'est un **contrat** : `docs/assets/suivi.js` lit ce
bloc dans le HTML rendu et en fabrique les clés `q1` à `q10`, puis appelle
`repondre(seance_id, 'q7', 'C')`.

Trois règles qui en découlent :

1. **Pas de `code` dans l'énoncé d'une question.** Le parseur prend le premier
   `<code>` du paragraphe comme début des options : un `` `truc` `` dans la question
   tronque l'énoncé et ajoute une fausse option. Mettre l'élément en **gras**.
2. **Quatre options, dans cet ordre A B C D**, séparées par ` · `.
3. **Les bonnes réponses vivent en base**, pas dans la page : `BTS1_SEANCES.sql` du
   dépôt `portail-bts`. Changer l'ordre des options ici oblige à changer la
   `bonne_reponse` là-bas — l'un ne se déduit pas de l'autre.

Répartir les bonnes réponses sur A, B, C et D : une classe repère très vite un motif.

La séance doit exister en base (`seances`, numéro = le NN du nom de fichier) **avant**
le cours, sinon `repondre()` échoue et rien n'est enregistré.

## Format d'une séance

C'est l'atout du cours : chaque séance est un **récit d'enquête**, pas un chapitre.
Toute nouvelle séance reprend cette trame.

1. **Titre marquant** entre guillemets français (ex. « 03 h 47 »)
2. **Cold open** — une scène concrète, souvent des logs bruts en bloc de code
3. **Objectifs** en tableau : « Vous saurez… » / « Preuve »
4. **Actes numérotés** (I, II, III…) avec durée indicative en minutes
5. **Indices** — exercices intercalés, corrigés en bloc replié `??? question`
6. **Épilogue** — auto-évaluation, renvoi vers le suivi en ligne
7. **Quiz de révision** — 10 questions à 4 options (A/B/C/D)
8. **À retenir** — synthèse courte
9. **Teaser** de la séance suivante

### Personnages récurrents

Ne pas en inventer d'autres sans raison : leur récurrence est ce qui tient le semestre.

| Personnage | Rôle | Culture |
|---|---|---|
| **DevSecure** | PME de 40 personnes, SaaS de gestion de projets, 9 400 utilisateurs | le terrain |
| **Thomas** | lead dev, réflexe « c'est forcément le code » | l'erreur type |
| **Maya** | ingénieure DevOps | DevOps |
| **Sami** | expert sécurité | DevSecOps |
| **Léa** | data engineer | DataOps |
| **Noah** | ML engineer | MLOps |

### Ton

Tutoiement du lecteur proscrit, vouvoiement partout. Phrases courtes.
Chiffres concrets plutôt que généralités. Aucune promesse sur les salaires :
toujours « fourchettes indicatives ».

### Syntaxe MkDocs à utiliser

```markdown
!!! tip "Ce qui vient de se jouer"
    Texte indenté de 4 espaces.

??? question "🔓 Ouvrir le rapport d'expertise"
    Corrigé masqué par défaut.
```

Ne plus écrire de `<details><summary>` : la conversion est faite, on reste en admonitions.

### Front-matter obligatoire

```yaml
---
title: "Séance 5 — « titre »"
seance: 5
duree: "1 h"
notee: false
---
```

---

## Portail d'authentification

**L'élève ne s'identifie plus sur ce site.** Il passe par le portail commun :
<https://ggaillard.github.io/portail-bts/> (dépôt `ggaillard/portail-bts`).

Tous les sites vivent sous `ggaillard.github.io`, donc **même origine** : la session
Supabase ouverte sur le portail est partagée. Ce site appelle `qui_suis_je()` au
chargement, reprend l'identité s'il en trouve une, et affiche « Connecté, numéro NN ».
Sinon il renvoie vers le portail.

- L'élève saisit **numéro + code PIN à 4 chiffres**, une fois par poste.
- Le **choix de l'avatar** se fait sur le portail, plus ici.
- `ecranIdentification()` subsiste dans `suivi.js` mais n'est plus appelé.
  Ne pas le rebrancher : l'identification doit rester centralisée.

## Base de données

Tables : `classes`, `eleves`, `seances`, `corriges`, `reponses`, `enseignants`, `projets`.
RLS actif partout. Fonctions : `rejoindre()`, `repondre()`, `avatars_pris()`,
`qui_suis_je()`, `choisir_avatar()`, `est_enseignant()`, `purger_annee()`.

`rejoindre(p_classe_code, p_numero, p_avatar, p_pin)` exige le PIN **seulement si
l'élève en a un**. Les élèves sans PIN restent acceptés sans code.

**Règle absolue :** la table `eleves` ne contient **ni nom, ni prénom, ni adresse**.
Numéro + avatar uniquement. Ne jamais proposer d'y ajouter un champ nominatif.

### Ajouter le corrigé d'une séance

```sql
insert into public.corriges (seance_id, question, bonne_reponse, explication)
select s.id, v.q, v.r, v.e
  from public.seances s join public.classes c on c.id = s.classe_id,
       (values ('q1','B','Explication courte.')) as v(q,r,e)
 where c.code = 'BTS1-DEV-2026' and s.numero = 5;
```

### Le jour de la séance

```sql
update public.seances set ouverte = true  where numero = 5;  -- au début
update public.seances set ouverte = false where numero = 5;  -- à la fin, fige les réponses
```

Les séances sont créées **fermées**. Une séance fermée refuse toute réponse.
Une séance `notee = true` enregistre sans renvoyer la bonne réponse à l'élève.

---

## L'appel et le suivi en direct

**L'appel se fait au portail, pas ici.** Séance **numéro 99** de la classe,
intitulée « Appel - question du jour » (99 et non 0 : le BTS2 utilise déjà la séance 0 pour son TP0), ouverte en permanence et non notée.
Avant chaque séance, ajouter une question nommée `appel-AAAA-MM-JJ` : script
`APPEL.sql` du dépôt `portail-bts`, section 2. Y répondre, c'est être présent :
l'appel est fait sans le faire.

Cette question ouvre la séance. Simple, dix secondes, elle réactive la séance
précédente. Elle ne fait **pas** partie du quiz de révision de 10 questions :
celui-ci reste en fin de séance, sur la séance numérotée.

Pendant l'heure : portail → espace enseignant → classe `BTS1-DEV-2026` → la
séance du jour. Progression, Classement et Répartition se mettent à jour au fil
des réponses ; c'est là que se voit un étudiant qui décroche.

Après l'heure : vue `v_appel` pour le jour même, vue `v_absences` pour le cumul
des absences depuis la rentrée, avec les dates manquées.

## Une séance n'est visible que si elle est publiée

Le 09/09, la séance 1 faite avec le BTS1 — et la séance 2 déjà lisible ici.
Le sommaire de MkDocs liste les quatorze séances dès qu'elles sont écrites,
et rien ne l'en empêchait.

**C'est le portail qui décide, ce site obéit.** La colonne `seances.publiee`
(base Supabase) dit si les étudiants ont le droit de LIRE une séance. À ne pas
confondre avec `ouverte`, qui dit s'ils peuvent y RÉPONDRE.

`docs/assets/suivi.js` fait deux choses au chargement, et il faut les deux :

1. **`elaguerSommaire()`** retire du menu les séances non publiées. Il tourne
   sur *toutes* les pages du site, pas seulement celles de séance : c'est dans
   le menu qu'on clique pour aller voir trop loin. Sans lui, la page serait
   bien vide mais son titre resterait affiché — autant annoncer ce qu'on
   voulait cacher.
2. **`pageNonPubliee()`** masque le contenu, titre excepté, et affiche
   « Cette séance n'a pas encore eu lieu ». **Ne pas reprendre la formule de la
   séance fermée** — « le contenu ci-dessous reste consultable » — qui
   dévoilerait exactement ce qu'on protège.

**La session anonyme est établie AVANT la lecture** (`assurerSession()`). Sans
elle la requête peut échouer, `seancesPubliees()` rend `null`, rien n'est
élagué, et le défaut revient à l'identique sans que rien ne le signale.

Le repli est volontairement permissif : si la colonne `publiee` n'existe pas
encore sur la base, on ne cache rien. Un site vide par accident coûterait plus
cher qu'une séance vue une semaine trop tôt — mais c'est bien un repli, pas
l'état normal.

Publier une séance : portail → **Vue d'ensemble** → « Le semestre » → bouton
**Visible / Cachée**. « Démarrer la séance » publie aussi, ce qui suffit le
jour J.

---

## Points de vigilance

- **`extra_javascript` : l'ordre compte.** Librairie Supabase, puis `config.js`, puis `suivi.js`. Si `config.js` disparaît de la liste, le suivi se désactive en silence et la séance tombe à plat en classe.
- **Ne pas réintroduire de saisie de numéro sur ce site.** L'identification appartient au portail. Un formulaire local recréerait un second point d'entrée et contournerait le code PIN.
- **Ne jamais committer la clé `service_role`.** Seule la clé `anon` va dans `config.js`, et c'est prévu : les règles RLS la rendent inoffensive.
- **Vérifier avant de pousser** : `python -m mkdocs build --strict`, puis `python -m mkdocs serve` pour regarder le rendu sur `localhost:8000`.
- **Dupliquer pour une autre classe** : seule la valeur `classeCode` de `config.js` change, plus la ligne `insert into public.classes`.

---

## Workflow

```bash
python -m mkdocs serve          # vérifier en local
git add .
git commit -m "Seance 5 : CI/CD et conteneurisation"
git push                        # le site se reconstruit tout seul
```

Le dépôt est **public**. Demander confirmation avant tout `git push`.
