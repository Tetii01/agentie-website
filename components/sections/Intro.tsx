import { Logo } from "@/components/brand/Logo";
import { InlineScript } from "@/components/ui/InlineScript";
import { getContent } from "@/content";

/**
 * Intro-ul de la prima intrare pe site (după loader-ul de pe lircle.co, în stilul nostru):
 * fundal închis cu linii fine și o lumină în accent → o bandă de lumină metalică trece peste ecran
 * și dezvăluie logo-ul → o linie și două etichete jos → logo-ul
 * pulsează → un panou acoperă fundalul → logo-ul zboară exact pe logo-ul din header → panoul pleacă
 * spre dreapta și apare site-ul, iar animația din hero pornește abia acum.
 *
 * Toată mișcarea e din CSS (blocul „INTRO" din app/globals.css). Scriptul de mai jos rulează înainte
 * de prima afișare și decide dacă intro-ul apare: doar o dată pe sesiune, nu la prefers-reduced-motion
 * și nu când adresa duce direct la o secțiune (#…). Tot el măsoară unde aterizează logo-ul și închide
 * intro-ul la final sau imediat ce vizitatorul derulează, atinge ecranul sau apasă o tastă.
 * Stările sunt pe <html data-intro>: playing → leaving (logo-ul a aterizat, hero-ul pornește) → gol.
 * Fără JavaScript, intro-ul nu apare deloc.
 */

/** Când aterizează logo-ul și când a plecat tot (ms); la fel ca întârzierile din CSS. */
const LANDED = 3450;
const DONE = 4150;
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

export async function Intro() {
  const { ui } = await getContent();

  return (
    <>
      <div aria-hidden className="intro">
        <div className="intro-panel">
          <div className="intro-field" />
          <div className="intro-glow" />
          <div className="intro-scan" />
          <div className="intro-line" />
          <p className="intro-label left-6 text-muted md:left-14">{ui.intro.left}</p>
          <p className="intro-label right-6 text-accent md:right-14">{ui.intro.right}</p>
          <div className="intro-shutter" />
        </div>

        {/* Logo-ul: zboară (intro-fly) → urcă și apare (intro-rise) → pulsează (intro-pulse) → se dezvăluie (intro-wipe). */}
        <div id="intro-logo" className="intro-fly">
          <div className="intro-rise">
            <div className="intro-pulse">
              <Logo size="fill" className="intro-wipe" />
            </div>
          </div>
        </div>
      </div>
      {/* După markup: scriptul are nevoie de el ca să măsoare unde aterizează logo-ul. */}
      <InlineScript html={SCRIPT} />
    </>
  );
}
