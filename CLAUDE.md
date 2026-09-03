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
