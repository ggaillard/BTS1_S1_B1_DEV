# BTS SIO 1re année — Bloc 1 « DEV » — Semestre 1

> ## 👉 On entre toujours par le portail
>
> # **[ggaillard.github.io/portail-bts](https://ggaillard.github.io/portail-bts/)**
>
> Identifiez-vous là-bas — code classe, numéro, code à quatre chiffres — puis
> ouvrez la séance depuis « Vos projets ». C'est ce passage qui enregistre
> votre présence et votre progression : arriver ici par un autre chemin, c'est
> travailler sans que rien ne soit compté.

---

## 🗓️ Aujourd'hui — séance 5 : « Mardi, 14 h 02 »

La correction de Thomas part en production… et la page d'accueil tombe à
14 h 02. Personne n'avait relancé les tests, et le serveur n'avait pas la
bibliothèque installée sur son poste. Une heure pour découvrir la machine qui
teste et qui livre à la place des humains — l'intégration continue — et la
boîte qui fait tourner le code partout pareil : le conteneur.

> Séance précédente : [« Ça marche sur mon poste »](seances/seance-04.md) — cycles de
> vie, culture DevOps, Git, et l'index de la base vectorielle.
> **Si vous étiez absent, lisez-la d'abord** : la séance 5 en part.

- **Rien à installer.** Tout se passe dans le navigateur.
- **Les questions arrivent au fil de la lecture**, juste après la notion qu'elles
  vérifient. La suite de la page s'affiche quand vous avez répondu.
- **Aucune note ne sera mise.** Répondre faux ne coûte rien : l'explication
  s'affiche et vous continuez. Ne pas répondre, si.
- **Vos réponses viennent de vous.** Quitter la page pendant une question est
  signalé à l'enseignant.
- **Vos réponses sont enregistrées à chaque étape** : si le poste plante, vous
  reprenez là où vous en étiez.

La **trace écrite** de la séance — à relire après, ou à lire si vous étiez absent —
est ici : [« Mardi, 14 h 02 »](seances/seance-05.md).

### Si ça coince

| Vous voyez… | Faites… |
|---|---|
| « Chargement de la liste de classe… » qui ne part pas | Rechargez la page (F5). |
| Votre numéro ou votre code est refusé | Levez la main : votre enseignant vérifie en dix secondes. |
| L'avatar que vous vouliez est grisé | Il est déjà pris. Choisissez-en un autre, il sera à vous toute l'année. |
| 🔒 « La suite de la séance s'affiche dès que vous avez répondu » | Remontez d'un cran : la question est juste au-dessus. La flèche ↓ du bandeau en haut y mène. |
| Vous ne savez pas quoi répondre | Relisez le passage juste avant la question. Toujours coincé : ✋ en bas à droite. |
| Vous avez fermé l'onglet par erreur | Rouvrez le portail : vous reprenez où vous en étiez, rien n'est perdu. |

---

## 🎬 Le semestre en un coup d'œil

**1 h / semaine × 14 semaines**, 100 % en ligne. Fil rouge :
**« Du code au service — les 4 cultures Ops »** : DevOps → DevSecOps → DataOps → MLOps,
avec la sécurité intégrée dès la conception.

| S | Acte | Thème |
|---|------|-------|
| 1 | Cadrage | Panorama des métiers du dev & les 5 composants du SI |
| 2 | Cadrage | Applications web modernes : du statique au temps réel |
| 3 | Cadrage | Données & écosystèmes : SQL, NoSQL, Data Lake/Warehouse |
| 4 | DevOps | Culture DevOps, cycle de vie & versioning Git |
| 5 | DevOps | Intégration continue & conteneurisation (CI/CD, Docker) |
| 6 | DevOps | Atelier : mini-pipeline (TP noté) |
| 7 | DevSecOps | Sécurité applicative : OWASP Top 10, vuln./menace/risque |
| 8 | DevSecOps | Mission audit DevSecure : cartographie des vulnérabilités |
| 9 | DevSecOps | Remédiation & conformité : auth, RGPD, AI Act, NIS2 |
| 10 | Bilan | Évaluation sommative mi-semestre |
| 11 | DataOps | Industrialiser la donnée : pipelines, ETL/ELT, qualité |
| 12 | DataOps | Mission Data (« Sauver Doctolib ») |
| 13 | MLOps | Mettre l'IA en production & IA responsable (AI Act) |
| 14 | Synthèse | Les 4 Ops en miroir + orientation métiers (éval + oral) |

Le détail des compétences visées séance par séance :
[`progression.md`](progression.md).

---

<details>
<summary>💻 Récupérer ce dépôt sur votre machine <i>(facultatif, pour plus tard)</i></summary>

Vous n'en avez **pas besoin pour suivre les séances**. C'est utile si vous voulez
garder les supports hors ligne, ou vous entraîner à Git avant la séance 4 — où l'on
verra justement à quoi il sert.

```bash
git clone https://github.com/ggaillard/BTS1_S1_B1_DEV.git "BTS1 S1 B1 DEV"
```

Pour récupérer les mises à jour ensuite :

```bash
git pull
```

</details>

---

*Année 2026-2027 · contenus ajustables séance par séance.*
