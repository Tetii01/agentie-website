import type { CSSProperties } from "react";
import { logoSymbolShapes, logoViewBox, logoWordmarkShapes } from "@/components/brand/logo-shapes";
import { InlineScript } from "@/components/ui/InlineScript";

/**
 * Intro-ul de la prima intrare pe site, scurt (~2,6 s), doar cu logo-ul pe fundal închis:
 * simbolul (bucla cu săgeata) crește în centru, face un tur complet și se fixează la locul lui cu un mic
 * recul → simbolul se mută la stânga și literele „creos" urcă pe rând
 * → logo-ul zboară exact pe logo-ul din header, panoul se ridică și apare site-ul, iar animația din
 * hero pornește abia acum.
 *
 * Toată mișcarea e din CSS (blocul „INTRO" din app/globals.css), doar transform și opacity. Scriptul
 * de mai jos rulează înainte de prima afișare și decide dacă intro-ul apare: doar o dată pe sesiune,
 * nu la prefers-reduced-motion și nu când adresa duce direct la o secțiune (#…). Tot el măsoară unde
 * aterizează logo-ul și închide intro-ul la final sau imediat ce vizitatorul derulează, atinge ecranul
 * sau apasă o tastă. Stările sunt pe <html data-intro>: playing → leaving (logo-ul a aterizat, hero-ul
 * pornește) → gol. Fără JavaScript, intro-ul nu apare deloc.
 */

/** Când aterizează logo-ul și când a plecat tot (ms); la fel ca întârzierile din CSS. */
const LANDED = 2600;
const DONE = 3000;
const SKIP = 450;

const SCRIPT = `(function(){try{
var d=document.documentElement;
if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("creos-intro"))return;
sessionStorage.setItem("creos-intro","1");
d.setAttribute("data-intro","playing");
var events=["wheel","touchstart","keydown","pointerdown"],timers=[];
function measure(){
var s=document.getElementById("intro-logo"),t=document.querySelector("[data-intro-target]");
if(!s||!t)return;
var a=s.getBoundingClientRect(),b=t.getBoundingClientRect();
if(!a.width||!b.width)return;
d.style.setProperty("--fly-x",(b.left+b.width/2-(a.left+a.width/2))+"px");
d.style.setProperty("--fly-y",(b.top+b.height/2-(a.top+a.height/2))+"px");
d.style.setProperty("--fly-s",String(b.width/a.width));
}
function finish(){
timers.forEach(clearTimeout);
events.forEach(function(e){removeEventListener(e,skip)});
removeEventListener("resize",measure);
d.removeAttribute("data-intro");
}
function skip(){
if(d.getAttribute("data-intro")!=="playing")return;
timers.forEach(clearTimeout);
d.setAttribute("data-intro","skip");
timers=[setTimeout(finish,${SKIP})];
}
measure();
addEventListener("resize",measure);
events.forEach(function(e){addEventListener(e,skip,{passive:true})});
timers=[setTimeout(function(){d.setAttribute("data-intro","leaving")},${LANDED}),setTimeout(finish,${DONE})];
}catch(e){}})();`;

const { width, height } = logoViewBox;

/**
 * Geometria logo-ului, dată CSS-ului: proporția logo-ului și cât e mutat simbolul spre dreapta
 * ca să stea în centru la început (în % din lățimea lui; simbolul e un pătrat cât înălțimea logo-ului).
 */
const geometry = {
  aspectRatio: `${width} / ${height}`,
  "--intro-mark-offset": `${((width / 2 - height / 2) / height) * 100}%`,
} as CSSProperties;

/** Simbolul e pătrat, cu centrul inelului în mijloc: se rotește în jurul lui. */
const symbolBox = `0 0 ${height} ${height}`;

export function Intro() {
  return (
    <>
      <div aria-hidden className="intro">
        <div className="intro-panel" />

        <div id="intro-logo" className="intro-fly" style={geometry}>
          {/* Literele „creos": fiecare într-un SVG cât tot logo-ul, ca să urce separat (intro-letter). */}
          <div className="intro-word text-foreground">
            {logoWordmarkShapes.map((d, index) => (
              <svg
                key={d}
                viewBox={`0 0 ${width} ${height}`}
                className="intro-letter"
                style={{ "--intro-letter": index } as CSSProperties}
              >
                <path d={d} fill="currentColor" />
              </svg>
            ))}
          </div>

          {/* Simbolul: se mută din centru la stânga (intro-mark) → crește, face un tur și pulsează la aterizare (intro-pop). */}
          <div className="intro-mark text-accent">
            <div className="intro-pop">
              <svg viewBox={symbolBox} className="intro-symbol">
                {logoSymbolShapes.map((d) => (
                  <path key={d} d={d} fill="currentColor" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* După markup: scriptul are nevoie de el ca să măsoare unde aterizează logo-ul. */}
      <InlineScript html={SCRIPT} />
    </>
  );
}
