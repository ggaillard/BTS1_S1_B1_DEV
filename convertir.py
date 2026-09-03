import re, pathlib, shutil

RACINE = pathlib.Path(".")
DOCS   = RACINE / "docs"
ANCIEN = "suivi.gaillard42.workers.dev"
NOUVEAU = "ggaillard.github.io/BTS1_S1_B1_DEV"

(DOCS / "seances").mkdir(parents=True, exist_ok=True)
(DOCS / "assets").mkdir(exist_ok=True)


def convertir(txt, numero):
    # 1. <details><summary>X</summary>  ->  ??? question "X"
    def bloc(m):
        titre = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        corps = m.group(2).strip("\n")
        corps = "\n".join("    " + l if l.strip() else "" for l in corps.split("\n"))
        return f'??? question "{titre}"\n\n{corps}\n'
    txt = re.sub(r"<details>\s*<summary>(.*?)</summary>(.*?)</details>",
                 bloc, txt, flags=re.S)

    # 2. Citations 💡 / ⚠️ / 🔑 / 🕵️  ->  admonitions
    for emoji, genre in (("💡", "tip"), ("⚠️", "warning"),
                        ("🔑", "note"), ("🕵️", "info")):
        txt = re.sub(
            rf"^> {emoji} \*\*(.+?)\*\*[ :—-]*(.*?)(?=\n(?!>))",
            lambda m, g=genre: f'!!! {g} "{m.group(1)}"\n\n    ' +
                m.group(2).replace("\n> ", "\n    ").strip(),
            txt, flags=re.M | re.S)

    # 3. Ancienne adresse -> nouvelle
    txt = txt.replace(ANCIEN, NOUVEAU)

    # 4. Front-matter
    titre = re.search(r"^# (.+)$", txt, re.M)
    titre = titre.group(1).strip() if titre else f"Seance {numero}"
    entete = (f'---\ntitle: "{titre}"\nseance: {numero}\n'
              f'duree: "1 h"\nnotee: false\n---\n\n')
    return entete + txt


for src in sorted(RACINE.glob("seances/SEANCE_*.md")):
    n = int(re.search(r"SEANCE_(\d+)", src.name).group(1))
    dst = DOCS / "seances" / f"seance-{n:02d}.md"
    dst.write_text(convertir(src.read_text(encoding="utf-8"), n), encoding="utf-8")
    print(f"  {src.name}  ->  {dst.relative_to(RACINE)}")

if (RACINE / "README.md").exists():
    t = (RACINE / "README.md").read_text(encoding="utf-8").replace(ANCIEN, NOUVEAU)
    # Remap des liens relatifs vers les fichiers sources -> emplacements docs/
    for src in sorted(RACINE.glob("seances/SEANCE_*.md")):
        n = int(re.search(r"SEANCE_(\d+)", src.name).group(1))
        t = t.replace(f"seances/{src.name}", f"seances/seance-{n:02d}.md")
    for p in RACINE.glob("progression/*.md"):
        t = t.replace(f"progression/{p.name}", "progression.md")
    (DOCS / "index.md").write_text(t, encoding="utf-8")
    print("  README.md  ->  docs/index.md")

for p in RACINE.glob("progression/*.md"):
    shutil.copy(p, DOCS / "progression.md")
    print(f"  {p.name}  ->  docs/progression.md")

print("\nTermine. Verifiez avec :  mkdocs serve")
