// Fausse couche supabase-js pour tests/t_parcours.py — état en mémoire.
// Elle répond comme la base répondrait à un étudiant identifié, d'après le
// scénario posé dans window.__scenario. Rien ne part sur le réseau.
(function(){
  var S = window.__scenario || {};
  var etat = { reponses: [], passages: S.passagesFaits || {}, sorties: [], appels: [] };
  window.__etat = etat;
  function corrige(q){ return (S.corriges||{})[q]; }
  function rpc(nom, a){
    etat.appels.push({nom:nom, args:a});
    if (nom === 'qui_suis_je') return S.anonyme ? null : { eleve_id: 7, numero: '07', avatar: '🦊', classe_code: 'BTS1-DEV-2026' };
    if (nom === 'repondre') {
      if (S.fermeAuRepondre) return { __erreur: 'Seance fermee' };
      var c = corrige(a.p_question) || {bonne:'A', explication:'Explication.'};
      etat.reponses.push({question:a.p_question, reponse:a.p_reponse});
      return { correct: a.p_reponse === c.bonne, bonne_reponse: c.bonne, explication: c.explication };
    }
    if (nom === 'mes_points_passage') {
      if (S.sansPassages) return null;
      return { ok: true, ouverte: S.ouverte !== false, points: (S.points||[]).map(function(p){
        var f = etat.passages[p.acte];
        return Object.assign({}, p, { bonne: f ? p.bonne : undefined, explication: f ? p.explication : undefined,
          fait: !!f, reponse: f && f.reponse, correct: f && f.correct });
      }), main: null, demarree_le: S.demarree_le || null };
    }
    if (nom === 'passer_acte') {
      var p = (S.points||[]).filter(function(x){return x.acte===a.p_acte;})[0];
      var r = { reponse: a.p_reponse || 'fait', correct: p.bonne ? a.p_reponse === p.bonne : null };
      etat.passages[a.p_acte] = r;
      return { ok: true, reponse: r.reponse, correct: r.correct, bonne: p.bonne, explication: p.explication };
    }
    if (nom === 'signaler_sortie') { etat.sorties.push(a); return { ok: true }; }
    if (nom === 'lever_main') return { ok: true, id: 1 };
    return { ok: true };
  }
  function table(nom){
    if (nom === 'seances') return { lignes: (S.seances || []), une: S.seance };
    if (nom === 'reponses') return { lignes: (S.dejaRepondu || []).concat(etat.reponses.map(function(r){return {question:r.question, reponse:r.reponse};})) };
    return { lignes: [] };
  }
  window.supabase = { createClient: function(){ return {
    auth: { getSession: function(){ return Promise.resolve({ data: { session: { user: { id: 'u' } } } }); },
            signInAnonymously: function(){ return Promise.resolve({ data: {}, error: null }); } },
    rpc: function(n, a){
      var d = rpc(n, a);
      if (d && d.__erreur) return Promise.resolve({ data: null, error: { message: d.__erreur } });
      return Promise.resolve({ data: d, error: null });
    },
    from: function(nom){
      var t = table(nom), seul = false;
      var ch = { then: function(ok, ko){ return Promise.resolve({ data: seul ? (t.une || null) : t.lignes, error: null }).then(ok, ko); } };
      ['select','eq','order','in','limit','neq'].forEach(function(m){ ch[m] = function(){ return ch; }; });
      ch.maybeSingle = function(){ seul = true; return ch; };
      ch.single = ch.maybeSingle;
      return ch;
    }
  }; } };
})();
