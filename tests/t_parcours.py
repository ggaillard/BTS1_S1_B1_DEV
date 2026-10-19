#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Le parcours guidé de la page de séance, joué comme un étudiant.

    python -m mkdocs build --strict
    pip install playwright && python -m playwright install chromium
    python tests/t_parcours.py site            # le dossier construit

Né le 19/10/2026. Jusque-là, sur la page de la séance 4 à 390 px, la PREMIÈRE
chose qu'un étudiant voyait était « Question 1 / 10 » du quiz de fin — avant
le cold open — et rien ne l'empêchait de faire défiler au-delà des points de
passage. Ce contrôle tient ce qui a été promis à sa place :

  · LA QUESTION ARRIVE APRÈS LA NOTION. Aucune carte avant le cold open ; la
    première est la question 1, posée dans l'acte I.
  · LA SUITE ATTEND LA RÉPONSE. Tout ce qui suit l'étape en cours est masqué,
    et se découvre quand on a répondu — faux compris.
  · UNE ERREUR SE LIT AVANT DE PASSER. « J'ai compris » reste grisé le temps
    de lire l'explication.
  · LE RAPPORT D'EXPERTISE ATTEND L'ESSAI. Il ne s'ouvre pas avant le point
    de passage de son acte.
  · QUITTER LA PAGE PENDANT UNE QUESTION SE VOIT — d'abord par l'étudiant,
    sur la carte, puis par l'enseignant (signaler_sortie).
  · LE REPLI EST PERMISSIF. Séance close, élève non identifié, séance close
    pendant qu'on répond : tout redevient lisible, rien ne reste verrouillé.
  · CE QUI EST MASQUÉ EST MASQUÉ. Material donne un display aux details et
    aux hr : sans `.md-typeset [hidden] { display: none !important }`, la
    grille de la séance 4 restait visible pendant l'heure.
  · ON ATTEINT TOUT AU POUCE. Pas de débordement horizontal à 360 et 390 px,
    pas de cible sous 44 px dans les cartes.

Il ne touche à aucune base : supabase-js est remplacé au passage par
tests/faux-supabase.js, qui répond comme la base répondrait.
"""
import functools
import http.server
import json
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
SITE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ICI, '..', 'site')
PAGE = 'seances/seance-05/'
FAUX = open(os.path.join(ICI, 'faux-supabase.js'), encoding='utf-8').read()

POINTS = [
    {"acte": 1, "titre": "La chaîne qui ne dort pas", "fin_min": 14, "intitule": "Dans un pipeline, où se placent les tests ?",
     "options": ["après le déploiement en production", "entre l'installation des dépendances et le déploiement",
                 "avant même de récupérer le code poussé", "à la place de la préproduction"],
     "bonne": "B", "explication": "On teste avant de déployer."},
    {"acte": 2, "titre": "Trois étages de tests", "fin_min": 23, "intitule": "Quel test aurait vu la page en erreur 500 ?",
     "options": ["unitaire", "base seule", "bout en bout", "aucun"], "bonne": "C", "explication": "Le bout en bout."},
    {"acte": 3, "titre": "La boîte qui voyage", "fin_min": 35, "intitule": "Quelle ligne fixe la version de Python ?",
     "options": ["4", "6", "5", "1"], "bonne": "D", "explication": "FROM."},
    {"acte": 4, "titre": "Lire un pipeline", "fin_min": 44, "intitule": "Le pipeline se lance-t-il sur une branche ?",
     "options": ["oui", "non, main seulement", "oui sans tests", "à la main"], "bonne": "B", "explication": "on: main."},
    {"acte": 5, "titre": "Ouvrez le capot", "fin_min": 46, "intitule": None, "options": None, "bonne": None, "explication": None},
]
BASE = {
    "seance": {"id": 5, "notee": False, "ouverte": True},
    "seances": [{"numero": n, "publiee": True} for n in range(1, 6)],
    "corriges": {"q1": {"bonne": "B", "explication": "La CI reconstruit le projet depuis le dépôt seul, sur une machine propre."},
                 "q2": {"bonne": "C", "explication": "Rouge veut dire stop."}},
    "points": POINTS,
}

rates = []


def scenario(**k):
    s = json.loads(json.dumps(BASE))
    s.update(k)
    return s


class Silencieux(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def servir():
    srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Silencieux, directory=SITE))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def ouvrir(nav, port, scen, largeur=390):
    ctx = nav.new_context(viewport={'width': largeur, 'height': 844})
    p = ctx.new_page()
    erreurs = []
    p.on('pageerror', lambda e: erreurs.append(str(e)))
    p.add_init_script('window.__scenario = ' + json.dumps(scen) + ';')
    p.route('**/supabase-js@2/**', lambda r: r.fulfill(status=200, content_type='application/javascript', body=FAUX))
    p.goto('http://127.0.0.1:%d/%s' % (port, PAGE), wait_until='networkidle')
    p.wait_for_timeout(600)
    return ctx, p, erreurs


ETAT = '''() => {
  const art = document.querySelector('article');
  const enfants = [...art.children];
  const cartes = [...document.querySelectorAll('.tdc-etape')];
  const cold = [...art.querySelectorAll('h2')].find(h => /COLD OPEN/.test(h.textContent));
  const avantCold = cartes.filter(c => cold && (c.compareDocumentPosition(cold) & Node.DOCUMENT_POSITION_FOLLOWING)).length;
  const petits = [];
  document.querySelectorAll('.tdc-etape button, .tdc-etape label, .tdc-fil button').forEach(b => {
    const r = b.getBoundingClientRect();
    if (r.width && r.height && r.height < 44) petits.push((b.textContent || '').trim().slice(0, 20) + ' ' + Math.round(r.height));
  });
  return {
    cartes: cartes.length,
    premiere: cartes[0] && cartes[0].dataset.cle,
    avantCold,
    masques: document.querySelectorAll('[data-tdc-verrou]').length,
    statiquesVisibles: [...art.querySelectorAll('p')].filter(p => /^\\d+\\.$/.test(((p.querySelector('strong')||{}).textContent||'').trim()) && p.querySelector('code') && !p.closest('[hidden]') && !p.hidden).length,
    fil: (document.querySelector('.tdc-fil-ou') || {}).textContent || null,
    suite: !!document.querySelector('.tdc-suite'),
    debord: document.documentElement.scrollWidth - innerWidth,
    // Un élément marqué hidden mais affiché quand même : Material donne un
    // display aux details et aux hr, et hidden ne les masquait pas.
    fuites: [...art.querySelectorAll('[hidden]')].filter(x => getComputedStyle(x).display !== 'none').length,
    petits,
  };
}'''


def courante(p):
    return p.locator('.tdc-etape:not([data-fait])').first


def attendre_valider(p):
    p.wait_for_function("() => { const c = document.querySelector('.tdc-etape:not([data-fait])');"
                        " const b = c && c.querySelector('button[type=submit]'); return b && !b.disabled; }",
                        timeout=40000)


def verifier(cond, msg):
    if not cond:
        rates.append(msg)


with sync_playwright() as pw:
    srv = servir()
    port = srv.server_address[1]
    nav = pw.chromium.launch()

    # ── 1. Séance ouverte, élève identifié ─────────────────────────────────
    for largeur in (360, 390):
        ctx, p, erreurs = ouvrir(nav, port, scenario(), largeur)
        e = p.evaluate(ETAT)
        print('── %d px · ouverture : %s' % (largeur, e))
        verifier(e['cartes'] == 15, '%d px : %d étapes, attendu 15 (10 questions + 5 points)' % (largeur, e['cartes']))
        verifier(e['avantCold'] == 0, '%d px : %d carte(s) avant le cold open' % (largeur, e['avantCold']))
        verifier(e['premiere'] == 'q1', '%d px : la première étape est %s, pas la question 1' % (largeur, e['premiere']))
        verifier(e['masques'] > 20, '%d px : %d bloc(s) masqué(s) — la suite n\'attend pas la réponse' % (largeur, e['masques']))
        verifier(e['statiquesVisibles'] == 0, '%d px : %d question(s) statique(s) encore visibles' % (largeur, e['statiquesVisibles']))
        verifier(e['fil'] and e['fil'].startswith('Étape 1 / 15'), '%d px : le fil dit « %s »' % (largeur, e['fil']))
        verifier(e['debord'] <= 0, '%d px : la page déborde de %d px' % (largeur, e['debord']))
        verifier(e['fuites'] == 0, '%d px : %d bloc(s) masqué(s) mais affiché(s) — hidden ne gagne pas sur le display de Material' % (largeur, e['fuites']))
        verifier(not e['petits'], '%d px : cible(s) sous 44 px — %s' % (largeur, ', '.join(e['petits'])))
        verifier(not erreurs, '%d px : erreur JS — %s' % (largeur, erreurs[:1]))
        ctx.close()

    ctx, p, erreurs = ouvrir(nav, port, scenario())
    c = courante(p)
    c.scroll_into_view_if_needed()
    verifier(c.locator('button[type=submit]').is_disabled(), 'q1 : « Valider » actif avant le temps de lecture')
    attendre_valider(p)

    # Sortir de la page pendant la question.
    p.evaluate("window.dispatchEvent(new Event('blur'))")
    p.wait_for_timeout(3100)
    p.evaluate("window.dispatchEvent(new Event('focus'))")
    p.wait_for_timeout(200)
    sorties = json.loads(p.evaluate('JSON.stringify(window.__etat.sorties)'))
    verifier(c.locator('.tdc-sortie').count() == 1, 'sortie : la carte ne le dit pas à l\'étudiant')
    verifier(len(sorties) == 1 and sorties[0]['p_cle'] == 'q1' and sorties[0]['p_secondes'] >= 2,
             'sortie : signaler_sortie mal appelée — %s' % sorties)

    # Répondre faux : l'explication, et « J'ai compris » grisé le temps de lire.
    c.locator('input[value="A"]').check()
    c.locator('button[type=submit]').click()
    p.wait_for_timeout(400)
    c = p.locator('.tdc-etape[data-cle="q1"]')   # la carte répondue garde sa clé
    suite = p.locator('.tdc-etape button.tdc-bouton-principal:not([type=submit])').first
    verifier('La bonne réponse' in c.inner_text(), 'q1 faux : la bonne réponse n\'est pas dite')
    verifier(suite.is_disabled(), 'q1 faux : « J\'ai compris » actif avant d\'avoir lu l\'explication')
    masques_avant = p.evaluate("document.querySelectorAll('[data-tdc-verrou]').length")
    p.wait_for_function("() => { const b = [...document.querySelectorAll('.tdc-etape button.tdc-bouton-principal')]"
                        ".find(x => x.type !== 'submit'); return b && !b.disabled; }", timeout=40000)
    suite.click()
    p.wait_for_timeout(600)
    e = p.evaluate(ETAT)
    print('── après q1 : %s' % e)
    verifier(e['masques'] < masques_avant, 'q1 : la suite ne s\'est pas découverte')
    verifier(e['fil'].startswith('Étape 2 / 15'), 'q1 : le fil dit « %s »' % e['fil'])
    verifier(p.locator('.tdc-etape[data-cle="q2"]').is_visible(), 'q1 : la question 2 n\'est pas visible')

    # Le rapport d'expertise de l'acte I attend le point de passage.
    c = courante(p)
    c.scroll_into_view_if_needed()
    attendre_valider(p)
    c.locator('input[value="C"]').check()
    c.locator('button[type=submit]').click()
    p.wait_for_timeout(300)
    p.locator('.tdc-etape button.tdc-bouton-principal:not([type=submit])').first.click()
    p.wait_for_timeout(600)
    rapport = p.locator('article details.tdc-verrouille').first
    verifier(rapport.count() == 1, 'rapport : aucun rapport d\'expertise verrouillé avant le point de passage')
    if rapport.count():
        rapport.locator('summary').click()
        p.wait_for_timeout(200)
        verifier(rapport.get_attribute('open') is None, 'rapport : il s\'ouvre avant le point de passage')
    verifier(not erreurs, 'parcours : erreur JS — %s' % erreurs[:1])
    ctx.close()

    # ── 2. Rechargement : on reprend où l'on en était ──────────────────────
    ctx, p, erreurs = ouvrir(nav, port, scenario(dejaRepondu=[
        {"question": "q1", "reponse": "B", "correct": True},
        {"question": "q2", "reponse": "A", "correct": False}]))
    e = p.evaluate(ETAT)
    print('── rechargement : %s' % e)
    verifier(e['fil'].startswith('Étape 3 / 15'), 'rechargement : le fil dit « %s », attendu étape 3' % e['fil'])
    verifier(p.locator('.tdc-etape[data-fait]').count() == 2, 'rechargement : les deux étapes faites ne sont pas repliées')
    ctx.close()

    # ── 3. Le repli permissif ──────────────────────────────────────────────
    for nom, scen in (('séance close', scenario(seance={"id": 5, "notee": False, "ouverte": False})),
                      ('non identifié', scenario(anonyme=True))):
        ctx, p, erreurs = ouvrir(nav, port, scen)
        e = p.evaluate(ETAT)
        print('── %s : %s' % (nom, e))
        verifier(e['cartes'] == 0 and e['masques'] == 0 and not e['suite'],
                 '%s : la page est verrouillée (%s)' % (nom, e))
        if nom == 'séance close':
            verifier(e['statiquesVisibles'] == 10, 'séance close : %d question(s) de révision visibles, attendu 10'
                     % e['statiquesVisibles'])
        verifier(not erreurs, '%s : erreur JS — %s' % (nom, erreurs[:1]))
        ctx.close()

    # Close pendant qu'on répond : tout se rouvre.
    ctx, p, erreurs = ouvrir(nav, port, scenario(fermeAuRepondre=True))
    c = courante(p)
    c.scroll_into_view_if_needed()
    attendre_valider(p)
    c.locator('input[value="B"]').check()
    c.locator('button[type=submit]').click()
    p.wait_for_timeout(500)
    e = p.evaluate(ETAT)
    print('── close en cours de route : %s' % e)
    verifier(e['masques'] == 0 and not e['suite'], 'close en cours de route : la page reste verrouillée')
    verifier(e['statiquesVisibles'] == 10, 'close en cours de route : la trace de révision ne revient pas')
    ctx.close()

    nav.close()
    srv.shutdown()

print()
if rates:
    for r in rates:
        print('  ✗ ' + r)
    sys.exit(1)
print('  ✓ Parcours guidé : la question arrive après la notion, la suite attend')
print('    la réponse, une erreur se lit avant de passer, le rapport attend')
print('    l\'essai, la sortie de page se voit, et rien ne reste verrouillé à tort.')
