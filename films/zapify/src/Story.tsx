import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, DEPART, Iris, LIN, Line, MOVE, POP, Roll, W, centred, lerp, measure, off, track } from "./kinetic";
import { C, GOLD, SHADOW } from "./lib";
import { AutoPill, Avatar, Bubble, Chip, Ico, LinkCard, Logo, PHONE, Phone, StoryArt, Typing } from "./parts";

// Zapify · one continuous stage. The thread is their logo's bolt: Instagram's interactions stream into the logo,
// the bolt zaps comments, DMs and story replies into automated conversations, one phone carries their four real
// example chats (links, emails, comments, story reactions), each in a pastel field from their feature cards, the
// bolt answers creators, brands and agencies, copy-paste collapses, conversations fill a week on their yellow,
// and the logo builds again for the sign-off.

const k = (g: number, pos: string | number, s = 0.4, e = ARRIVE) => T.k(g, pos, s, e);
/** In on `a`, out on `b` (a block of the phone's screen, or anything that swaps). */
const span = (g: number, a: string, b?: string) => ({ in: k(g, a, 0.35), out: b ? k(g, b, 0.3, DEPART) : 0 });
const swap = (v: { in: number; out: number }): React.CSSProperties => ({ opacity: Math.min(1, v.in * 1.6) * (1 - v.out), transform: `translateY(${(1 - v.in) * 40 - v.out * 60}px)` });

/** The hero's black, tilted block behind a word: it sweeps in, the word rises white on it. */
const Block: React.FC<{ g: number; at: string; text: string; x: number; y: number; size: number; out?: string }> = ({ g, at, text, x, y, size, out }) => {
  const m = k(g, off(at, -0.05), 0.35, MOVE), w = k(g, at, 0.4), o = out ? k(g, out, 0.3, DEPART) : 0;
  const W = measure(text, size, 800, -0.04);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - o, transform: `translateY(${-o * 30}px)` }}>
      <div style={{ position: "absolute", left: -size * 0.14, top: size * 0.02, width: W + size * 0.28, height: size * 1.12, background: C.ink, borderRadius: size * 0.06,
        transformOrigin: "0 50%", transform: `rotate(-2deg) scaleX(${m})` }} />
      <div style={{ position: "relative", fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: "-0.04em", color: "#fff", whiteSpace: "nowrap",
        opacity: Math.min(1, w * 1.7), transform: `translateY(${(1 - w) * size * 0.3}px)`, filter: w < 1 ? `blur(${(1 - w) * 8}px)` : undefined }}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------- 1 · every Instagram interaction, into momentum
const BITS: [string, number, number][] = [["heart", 1180, 300], ["comment", 1420, 230], ["send", 1660, 330], ["story", 1300, 470], ["fire", 1560, 520], ["heart", 1760, 600],
  ["comment", 1150, 640], ["eyes", 1420, 720], ["story", 1680, 820], ["send", 1240, 850], ["love", 1530, 900], ["comment", 1800, 430], ["heart", 1360, 1000], ["fire", 1100, 480]];
const Bit: React.FC<{ kind: string }> = ({ kind }) => {
  const base: React.CSSProperties = { width: 96, height: 96, borderRadius: 30, background: C.white, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 };
  if (kind === "heart") return <div style={{ ...base, background: C.like }}><Ico k="heart" s={50} c="#fff" fill="#fff" /></div>;
  if (kind === "comment") return <div style={base}><Ico k="comment" s={50} /></div>;
  if (kind === "send") return <div style={base}><Ico k="send" s={46} /></div>;
  if (kind === "story") return <div style={{ ...base, borderRadius: 99, background: "transparent", boxShadow: "none" }}><Avatar t="" s={96} bg={C.butter} /></div>;
  return <div style={base}>{kind === "fire" ? "🔥" : kind === "eyes" ? "😍" : "💬"}</div>;
};
const Hook: React.FC<{ g: number }> = ({ g }) => {
  if (g > T.f("sources")) return null;
  return (
    <>
      <Line g={g} x={140} y={240} size={124} weight={800} ls={-0.04} out="zap-0.2" words={[{ t: "Turn", at: "w:turn" }, { t: "every", at: "w:every" }]} />
      <Line g={g} x={140} y={380} size={124} weight={800} ls={-0.04} out="zap-0.16" words={[{ t: "Instagram", at: "w:instagram" }]} />
      <Block g={g} at="w:interaction" text="interaction" x={150} y={530} size={124} out="zap-0.12" />
      <Line g={g} x={140} y={720} size={104} weight={800} ls={-0.04} out="zap-0.08" words={[{ t: "into", at: "w:into" }, { t: "momentum.", at: "w:momentum", color: "#B45309", under: "w:momentum+0.25" }]} />
      {BITS.map(([kind, x, y], i) => {
        const p = k(g, off("w:every", -0.1 + i * 0.075), 0.4, POP);
        if (p <= 0) return null;
        // momentum: they peel off one after another into a stream that curls into the logo's point
        const s = k(g, off("w:momentum", 0.2 + i * 0.045), 0.95, Easing2);
        const a = (1 - s) * (Math.PI * 1.2) + i * 0.5;
        const R = lerp(Math.hypot(x - 960, y - 520), 0, s);
        const sx = lerp(x, 960 + Math.cos(a) * R, Math.min(1, s * 1.5)), sy = lerp(y, 520 + Math.sin(a) * R * 0.6, Math.min(1, s * 1.5));
        const dx = Math.sin(g / 23 + i) * 8 * (1 - s), dy = Math.cos(g / 19 + i * 2) * 8 * (1 - s);
        if (s >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sx - 48 + dx}px, ${sy - 48 + dy}px) scale(${p * lerp(1, 0.25, s)}) rotate(${(i % 2 ? 1 : -1) * (8 - s * 40)}deg)`,
          opacity: 1 - Math.max(0, s - 0.85) / 0.15, willChange: "transform" }}><Bit kind={kind} /></div>;
      })}
    </>
  );
};
const Easing2 = (t: number) => t * t * t;                         // accelerating: momentum

// ---------------------------------------------------------------- 2 · with Zapify: the logo builds out of the stream
const Brand: React.FC<{ g: number; lx: number; ly: number; ls: number }> = ({ g, lx, ly, ls }) => {
  const flash = k(g, "w:zapify+0.12", 0.6);
  const glow = k(g, "w:with-0.1", 0.6) * (1 - k(g, "sources-0.05", 0.5));
  const W = measure("Zapify", 110, 800, -0.04);
  return (
    <>
      {glow > 0 && <div style={{ position: "absolute", left: 960 - 450, top: 470 - 450, width: 900, height: 900, borderRadius: 999, background: C.yellow, filter: "blur(120px)", opacity: glow * 0.55 }} />}
      {flash > 0 && flash < 1 && <div style={{ position: "absolute", left: lx - 200, top: ly - 200, width: 400, height: 400, borderRadius: 999, border: `10px solid ${C.gold}`, transform: `scale(${0.3 + flash * 1.6})`, opacity: 1 - flash }} />}
      {g < T.f("sources+0.3") && <Line g={g} x={960 - W / 2} y={680} size={110} weight={800} ls={-0.04} out="sources-0.1" words={[{ t: "Zapify", at: "w:zapify" }]} />}
    </>
  );
};

// ---------------------------------------------------------------- 3 · comments, DMs and story replies; the bolt automates them
const CARD = { w: 440, h: 640, y: 290 };
const CX = [150, 740, 1330];
const Sources: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("sources") || g > T.f("links+0.3")) return null;
  const merge = k(g, "w:conversations-0.15", 0.55, MOVE);
  const bolt = k(g, "w:instantly-0.05", 0.55, LIN);
  const bx = lerp(-200, 2100, bolt);
  const ats = ["w:comments", "w:dms", "w:story"];
  const card = (i: number, body: React.ReactNode) => {
    const e = k(g, off(ats[i], -0.12), 0.5, ARRIVE);
    if (e <= 0) return null;
    const auto = Math.min(1, Math.max(0, (bx - CX[i] - CARD.w * 0.5) / 160));
    const x = lerp(CX[i], 745 + 0 * i, merge), y = lerp(CARD.y + (1 - e) * 160, 110, merge);
    return (
      <div key={i} style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transform: `translate(${x}px, ${y}px) scale(${lerp(1, 0.9, merge)})`, opacity: Math.min(1, e * 1.6) * (1 - merge),
        willChange: "transform" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: C.white, boxShadow: auto > 0 && auto < 1 ? `0 0 0 ${8 * (1 - auto)}px ${C.yellow}, ${SHADOW}` : SHADOW, overflow: "hidden" }}>{body}</div>
        <div style={{ position: "absolute", right: 20, top: -22 }}><AutoPill k={Math.min(1, auto * 1.5)} /></div>
      </div>
    );
  };
  const chip = (i: number, t: string, c: string) => {
    const e = k(g, off(ats[i], -0.05), 0.45, POP);
    return e > 0 && <div key={t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${CX[i] + 20}px, ${180 + (1 - e) * 20}px) scale(${e})`, opacity: 1 - merge, transformOrigin: "0 50%" }}><Chip c={c} s={34}>{t}</Chip></div>;
  };
  const comments = [["user_one", "Link Please"], ["user_two", "Where can I get it?"], ["user_three", "Can you send me the link?"]];
  return (
    <>
      {chip(0, "Comments", C.cPink)}{chip(1, "DMs", C.cPurple)}{chip(2, "Story replies", C.cOrange)}
      {card(0, <>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px" }}><Avatar t="Y" s={46} bg={C.butter} /><b style={{ fontSize: 24 }}>your_brand</b></div>
        <div style={{ height: 250, margin: "0 20px", borderRadius: 18, background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 38, lineHeight: 1.1, textAlign: "center" }}>
          Comment<br /><span style={{ color: C.cPurple }}>“LINK”</span><span style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>to get access</span></div>
        <div style={{ display: "flex", gap: 18, padding: "14px 22px" }}><Ico k="heart" s={32} /><Ico k="comment" s={32} /><Ico k="send" s={30} /></div>
        <div style={{ padding: "0 22px" }}>{comments.map(([u, t], j) => { const v = k(g, off("w:comments", 0.1 + j * 0.18), 0.35, POP);
          return v > 0 && <div key={u} style={{ fontSize: 23, marginTop: 10, transform: `scale(${v})`, transformOrigin: "0 50%", opacity: Math.min(1, v * 2) }}><b>{u}</b> {t}</div>; })}</div>
      </>)}
      {card(1, <>
        <div style={{ padding: "22px 24px 8px", fontWeight: 800, fontSize: 28 }}>Messages</div>
        {[["sarah.styles", "SS", C.pink], ["mike.reviews", "MR", C.sky], ["jess.fitness", "JF", C.mint], ["alex.travels", "AT", C.peach]].map(([n, ini, bg], j) => {
          const v = k(g, off("w:dms", 0.05 + j * 0.12), 0.35, POP);
          return v > 0 && <div key={n} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", transform: `translateX(${(1 - v) * 40}px)`, opacity: Math.min(1, v * 2) }}>
            <Avatar t={ini} s={64} bg={bg} /><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 24 }}>{n}</div><div style={{ fontWeight: 700, fontSize: 21 }}>Sent you a message</div></div>
            <span style={{ width: 14, height: 14, borderRadius: 9, background: C.dm }} /></div>;
        })}
      </>)}
      {card(2, <StoryArt w={CARD.w} h={CARD.h} t={k(g, "w:story", 3, LIN)}>
        {[0, 1, 2].map((j) => { const v = k(g, off("w:replies", j * 0.12), 1.1, LIN); return v > 0 && v < 1 &&
          <div key={j} style={{ position: "absolute", left: 60 + j * 40, bottom: 90 + v * 320, fontSize: 56, opacity: 1 - v, transform: `scale(${0.6 + v * 0.8}) rotate(${(j - 1) * 12}deg)` }}>🔥</div>; })}
        {k(g, "w:replies+0.2", 0.35) > 0 && <div style={{ position: "absolute", left: 18, bottom: 90, padding: "12px 18px", borderRadius: 22, background: "#fff", fontSize: 24, fontWeight: 600, transform: `scale(${k(g, "w:replies+0.2", 0.35, POP)})`, transformOrigin: "0 100%" }}>🔥🔥🔥</div>}
      </StoryArt>)}
      {/* the bolt zaps across all three on "instantly" */}
      {bolt > 0 && bolt < 1 && <Img src={staticFile("img/bolt.png")} style={{ position: "absolute", left: 0, top: 180, width: 240, height: 234, transform: `translateX(${bx - 120}px) rotate(${-10}deg)`, willChange: "transform", filter: "drop-shadow(0 20px 30px #EAB30899)" }} />}
      {(() => { const v = k(g, "w:instantly-0.05", 0.4); const W2 = [{ t: "Instantly", at: "w:instantly" }, { t: "automated.", at: "w:automated", mark: "w:automated+0.2" }] as W[];
        return v > 0 && <Line g={g} x={centred(W2, 64, 960, 800)} y={70} size={64} weight={800} ls={-0.04} out="w:conversations-0.1" words={W2} />; })()}
    </>
  );
};

// ---------------------------------------------------------------- the phone that carries the four example chats
const Hero: React.FC<{ g: number }> = ({ g }) => {
  const at = (d: number) => k(g, off("w:conversations", d), 0.35, POP);
  return (
    <div>
      <div style={{ textAlign: "center", fontSize: 19, color: C.muted, marginTop: 4, opacity: at(-0.05) }}>zapify.pro messaged you about a comment that you made on their post.</div>
      <Bubble k={at(0.05)}>✨ <b>Want the free access link?</b><br />Tap below and I'll send it instantly.<div style={{ marginTop: 10, height: 46, borderRadius: 12, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>Send the Link</div></Bubble>
      <Bubble k={at(0.35)} me>Send the Link</Bubble>
      <Bubble k={at(0.6)}>🔒 <b>Quick check 👀</b><br />Follow the profile to unlock the content.<div style={{ marginTop: 10, height: 46, borderRadius: 12, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>Follow Profile</div></Bubble>
      <Bubble k={at(0.85)} me>Done Following</Bubble>
    </div>
  );
};
const Screen: React.FC<{ g: number }> = ({ g }) => {
  const hero = span(g, "w:conversations-0.1", "links+0.15"), mike = span(g, "links+0.25", "emails+0.1"), jess = span(g, "emails+0.2", "comments+0.1"),
    post = span(g, "comments+0.2", "story+0.1"), story = span(g, "story+0.2", "w:into2"), alex = span(g, "w:into2+0.1");
  const typed = "jess@gmail.com";
  const tn = Math.round(typed.length * k(g, "w:directly-0.05", 0.55, LIN));
  return (
    <>
      {hero.in > 0 && hero.out < 1 && <div style={{ position: "absolute", inset: 0, ...swap(hero) }}><Hero g={g} /></div>}
      {mike.in > 0 && mike.out < 1 && <div style={{ position: "absolute", inset: 0, ...swap(mike) }}>
        <Bubble k={k(g, "w:send+0.05", 0.35, POP)}>Hey! Where can I get that camera you recommended?</Bubble>
        <Typing g={g} k={k(g, "w:asks-0.25", 0.3)} />
        <Bubble k={k(g, "w:asks+0.12", 0.35, POP)} me>Great taste Mike! 📸 Here's the exact camera I use:</Bubble>
        <LinkCard k={k(g, "w:asks+0.35", 0.4, POP)} title="Canon R50 — Amazon" url="amzn.to/3xK9…" />
        <Bubble k={k(g, "emails-0.3", 0.35, POP)}>Perfect, thanks! Adding to cart now 🛒</Bubble>
      </div>}
      {jess.in > 0 && jess.out < 1 && <div style={{ position: "absolute", inset: 0, ...swap(jess) }}>
        <Bubble k={k(g, "w:capture-0.05", 0.35, POP)}>I want your free meal plan! 🥗</Bubble>
        <Bubble k={k(g, "w:emails", 0.35, POP)} me>You'll love it Jess! 🎉 Drop your email and I'll send it right over:</Bubble>
        {tn > 0 && <Bubble k={1}>{typed.slice(0, tn)}<span style={{ opacity: 0 }}>{typed.slice(tn)}</span></Bubble>}
        <Bubble k={k(g, "w:instagram2", 0.35, POP)} me>Sent! Check your inbox 📩</Bubble>
        <LinkCard k={k(g, "w:instagram2+0.25", 0.4, POP)} title="Download Meal Plan" url="zapify.pro/dl/meal…" />
      </div>}
      {post.in > 0 && post.out < 1 && <div style={{ position: "absolute", inset: 0, ...swap(post) }}>
        <div style={{ height: 300, borderRadius: 20, background: `linear-gradient(135deg, ${C.pink}, ${C.peach})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90 }}>👗</div>
        <div style={{ display: "flex", gap: 18, padding: "14px 6px" }}><Ico k="heart" s={32} c={C.like} fill={C.like} /><Ico k="comment" s={32} /><Ico k="send" s={30} /></div>
        {[["sarah.styles", "OMG where is this from?! I need it 😍", "w:respond-0.1"], ["user_one", "Link Please", "w:automatically-0.1"], ["user_two", "Where can I get it?", "w:automatically+0.15"],
          ["user_three", "Can you send me the link?", "w:automatically+0.4"]].map(([u, t, at], j) => {
          const v = k(g, at, 0.35, POP), sent = k(g, off(at, j === 0 ? 0.6 : 0.3), 0.3, POP);
          return v > 0 && <div key={u} style={{ fontSize: 22, marginTop: 12, padding: "0 6px", transform: `scale(${v})`, transformOrigin: "0 50%", opacity: Math.min(1, v * 2) }}>
            <b>{u}</b> {t}
            {sent > 0 && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8, padding: "2px 10px", borderRadius: 99, background: C.ink, color: C.yellow, fontSize: 18, fontWeight: 800, transform: `scale(${sent})` }}><Ico k="bolt" s={16} c={C.yellow} fill={C.yellow} />DM sent</div>}
          </div>;
        })}
      </div>}
      {story.in > 0 && story.out < 1 && <div style={{ position: "absolute", left: -18, right: -18, top: -170, bottom: -96, ...swap(story) }}>
        <StoryArt w={PHONE.w - 24} h={PHONE.h - 24} t={k(g, "story", 2.4, LIN)}>
          {[0, 1, 2].map((j) => { const v = k(g, off("w:reactions", -0.1 + j * 0.12), 1.0, LIN); return v > 0 && v < 1 &&
            <div key={j} style={{ position: "absolute", left: 80 + j * 60, bottom: 100 + v * 420, fontSize: 70, opacity: 1 - v, transform: `scale(${0.6 + v * 0.9}) rotate(${(j - 1) * 14}deg)` }}>🔥</div>; })}
          {k(g, "w:reactions+0.15", 0.35) > 0 && <div style={{ position: "absolute", left: 22, right: 70, bottom: 96, padding: "14px 18px", borderRadius: 22, background: "#fff", fontSize: 24, fontWeight: 600,
            transform: `scale(${k(g, "w:reactions+0.15", 0.35, POP)})`, transformOrigin: "0 100%" }}>🔥🔥🔥 Where is this?! I need to go!</div>}
        </StoryArt>
      </div>}
      {alex.in > 0 && <div style={{ position: "absolute", inset: 0, ...swap(alex) }}>
        <Bubble k={k(g, "w:into2+0.1", 0.3, POP)}>🔥🔥🔥 Where is this?! I need to go!</Bubble>
        <Bubble k={k(g, "w:real", 0.35, POP)} me>Bali! 🌴 So glad you love it Alex! Here's my full travel guide with all the spots:</Bubble>
        <LinkCard k={k(g, "w:engagement", 0.4, POP)} title="Bali Travel Guide" url="zapify.pro/guide/ba…" />
        <div style={{ position: "relative" }}>
          <Bubble k={k(g, "w:engagement+0.45", 0.35, POP)}>Booking flights rn ✈️ thank youuu!</Bubble>
          {k(g, "w:engagement+0.75", 0.35) > 0 && <div style={{ position: "absolute", left: 30, bottom: -18, fontSize: 30, transform: `scale(${k(g, "w:engagement+0.75", 0.4, POP)})` }}>❤️</div>}
        </div>
      </div>}
    </>
  );
};
const PhoneLayer: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("w:conversations-0.2") || g > T.f("who+0.6")) return null;
  const [x, y, s, o] = track(g, [["w:conversations-0.15", 745, 140, 0.9, 0], ["w:conversations+0.3", 745, 110, 1, 1, ARRIVE], ["links-0.1", 745, 110, 1, 1],
    ["links+0.5", 190, 110, 1, 1, MOVE], ["who-0.1", 190, 110, 1, 1], ["who+0.5", -600, 110, 1, 0, MOVE]]);
  const who = g < T.f("links+0.2") ? ["your_brand", "Y", C.butter] : g < T.f("emails+0.15") ? ["mike.reviews", "MR", C.sky] : g < T.f("comments+0.15") ? ["jess.fitness", "JF", C.mint]
    : g < T.f("story+0.15") ? ["your_brand", "Y", C.butter] : ["alex.travels", "AT", C.peach];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%", opacity: o, willChange: "transform" }}>
      <Phone who={who[0]} ini={who[1]} tint={who[2]}><Screen g={g} /></Phone>
    </div>
  );
};

// ---------------------------------------------------------------- 4–7 · the four features, the words beside the phone
const Feature: React.FC<{ g: number }> = ({ g }) => {
  const X = 760;
  const chip = (t: string, c: string, icon: React.ReactNode, a: string, b: string) => {
    const e = k(g, a, 0.45, POP), o = k(g, b, 0.25, DEPART);
    return e > 0 && o < 1 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${X}px, ${160 - o * 20}px) scale(${e})`, transformOrigin: "0 50%", opacity: 1 - o }}><Chip c={c} s={30} icon={icon}>{t}</Chip></div>;
  };
  // emails: the address flies out of the phone into their list
  const fly = k(g, "w:through-0.05", 0.6, MOVE);
  const listIn = k(g, "w:emails+0.2", 0.5);
  const listOut = k(g, "comments-0.1", 0.3, DEPART);
  // comments: the reply DM lands beside the phone
  const dmIn = k(g, "w:comments2+0.05", 0.5, POP), dmOut = k(g, "story-0.1", 0.3, DEPART);
  return (
    <>
      {chip("Link Delivery", C.cPurple, <Ico k="link" s={30} c={C.cPurple} />, "links+0.15", "emails-0.1")}
      <Line g={g} x={X} y={250} size={136} weight={800} ls={-0.045} out="emails-0.12" words={[{ t: "Send", at: "w:send" }, { t: "links", at: "w:links", accent: true }]} />
      <Line g={g} x={X} y={430} size={92} weight={800} ls={-0.04} out="emails-0.09" words={[{ t: "the", at: "w:the" }, { t: "moment", at: "w:moment" }]} />
      <Line g={g} x={X} y={550} size={92} weight={800} ls={-0.04} out="emails-0.06" words={[{ t: "someone", at: "w:someone" }, { t: "asks.", at: "w:asks", mark: "w:asks+0.1" }]} />

      {chip("Email Collection", C.cOrange, <Ico k="mail" s={30} c={C.cOrange} />, "emails+0.15", "comments-0.1")}
      <Line g={g} x={X} y={250} size={120} weight={800} ls={-0.045} out="comments-0.12" words={[{ t: "Capture", at: "w:capture" }, { t: "emails", at: "w:emails", accent: true }]} />
      <Line g={g} x={X + 6} y={395} size={56} weight={700} ls={-0.03} color={C.muted} out="comments-0.09" words={[{ t: "directly", at: "w:directly" }, { t: "through", at: "w:through" }, { t: "Instagram.", at: "w:instagram2" }]} />
      {listIn > 0 && listOut < 1 && <div style={{ position: "absolute", left: X, top: 500, width: 860, height: 400, borderRadius: 30, background: C.white, boxShadow: SHADOW, padding: "26px 32px",
        opacity: Math.min(1, listIn * 1.6) * (1 - listOut), transform: `translateY(${(1 - listIn) * 40 + listOut * -30}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 32 }}><Ico k="mail" s={34} />Subscribers</div>
        {[0, 1, 2, 3].map((j) => {
          const isNew = j === 0, land = isNew ? k(g, "w:through+0.45", 0.4, POP) : 1;
          const shift = k(g, "w:through+0.4", 0.4, MOVE);
          return <div key={j} style={{ position: "absolute", left: 32, right: 32, top: 100 + (isNew ? 0 : (j - 1 + shift) * 72), height: 60, borderRadius: 14, background: isNew ? "#FFFBEB" : C.page,
            border: `1.5px solid ${isNew ? C.yellow : C.line}`, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", opacity: isNew ? land : 1, transform: isNew ? `scale(${0.9 + 0.1 * land})` : undefined }}>
            {isNew ? <><Avatar t="JF" s={40} bg={C.mint} ring={false} /><b style={{ fontSize: 26 }}>jess@gmail.com</b><span style={{ marginLeft: "auto", padding: "4px 14px", borderRadius: 99, background: GOLD, fontWeight: 800, fontSize: 20 }}>New</span><Ico k="check" s={30} c={C.cGreen} /></>
              : <><span style={{ width: 40, height: 40, borderRadius: 99, background: C.line }} /><span style={{ width: 260 - j * 30, height: 14, borderRadius: 7, background: C.line }} /></>}
          </div>;
        })}
      </div>}
      {fly > 0 && fly < 1 && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(290, X + 100, fly)}px, ${lerp(560, 600, fly) - Math.sin(fly * Math.PI) * 160}px) scale(${lerp(1, 1.15, fly)})`,
        padding: "12px 20px", borderRadius: 22, background: "#EFEFEF", fontSize: 26, fontWeight: 600, boxShadow: SHADOW }}>jess@gmail.com</div>}

      {chip("Comment to DM", C.cPink, <Ico k="comment" s={30} c={C.cPink} />, "comments+0.15", "story-0.1")}
      <Line g={g} x={X} y={250} size={96} weight={800} ls={-0.045} out="story-0.12" words={[{ t: "Respond", at: "w:respond" }, { t: "to", at: "w:to" }, { t: "comments", at: "w:comments2", accent: true }]} />
      <Line g={g} x={X} y={370} size={96} weight={800} ls={-0.045} out="story-0.09" words={[{ t: "automatically.", at: "w:automatically", mark: "w:automatically+0.15" }]} />
      {dmIn > 0 && dmOut < 1 && <div style={{ position: "absolute", left: X, top: 530, width: 600, borderRadius: 30, background: C.white, boxShadow: SHADOW, padding: "22px 24px",
        opacity: Math.min(1, dmIn * 2) * (1 - dmOut), transform: `translateX(${(1 - Math.min(1, dmIn)) * -120}px) scale(${0.85 + 0.15 * Math.min(1, dmIn)})`, transformOrigin: "0 50%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, color: C.muted }}><Avatar t="SS" s={40} bg={C.pink} />to sarah.styles<span style={{ marginLeft: "auto" }}><AutoPill k={1} s={18} /></span></div>
        <Bubble k={1} me size={24}>Hey Sarah! Thanks for the love 🤍 Here's the link you asked for 👇</Bubble>
        <LinkCard k={k(g, "w:comments2+0.35", 0.4, POP)} title="Shop the Look" url="shopmy.bio/link" />
      </div>}

      {chip("Story Automation", C.cGreen, <span style={{ fontSize: 28 }}>🔥</span>, "story+0.15", "who-0.1")}
      <Roll g={g} at="w:into2-0.05" h={150} style={{ position: "absolute", left: X, top: 230, width: 1150, opacity: 1 - k(g, "who-0.12", 0.3) }}
        a={<Line g={g} x={0} y={14} size={112} weight={800} ls={-0.045} words={[{ t: "Story", at: "w:story2" }, { t: "reactions", at: "w:reactions", accent: true }]} />}
        b={<Line g={g} x={0} y={14} size={112} weight={800} ls={-0.045} words={[{ t: "Real", at: "w:into2" }, { t: "engagement.", at: "w:real", mark: "w:engagement+0.1" }]} />} />
    </>
  );
};

// ---------------------------------------------------------------- 8–9 · creators, brands, agencies; the bolt keeps them responsive, opportunities moving
const WHO = [["Creators", C.cPink, "@yourcreator", "w:creator", C.pink], ["Brands", C.cBlue, "@yourbrand", "w:brand", C.sky], ["Agencies", C.cGreen, "@youragency", "w:agency", C.mint]] as const;
const OPPS = ["Lead captured 🎉", "Link clicked", "New subscriber", "New follower"];
const Who: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("who") || g > T.f("more+0.4")) return null;
  const out = k(g, "less-0.1", 0.45, DEPART);
  return (
    <>
      <Roll g={g} at="w:zapify2-0.1" h={110} style={{ position: "absolute", left: 0, top: 110, width: 1920, opacity: 1 - out }}
        a={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Line g={g} x={0} y={14} size={72} weight={800} ls={-0.04} style={{ position: "relative" }} words={[{ t: "Whether", at: "w:whether" }, { t: "you’re", at: "w:you're" }, { t: "a…", at: "w:a" }]} /></div>}
        b={<div style={{ width: 1920, display: "flex", justifyContent: "center" }}><Roll g={g} at="w:and3-0.05" h={110} style={{ width: 1400 }}
          a={<div style={{ width: 1400, display: "flex", justifyContent: "center", opacity: 1 - k(g, "w:and3-0.05", 0.3) }}><Line g={g} x={0} y={14} size={72} weight={800} ls={-0.04} style={{ position: "relative" }} words={[{ t: "Stay", at: "w:stay" }, { t: "responsive.", at: "w:responsive", mark: "w:responsive+0.15" }]} /></div>}
          b={<div style={{ width: 1400, display: "flex", justifyContent: "center" }}><Line g={g} x={0} y={14} size={72} weight={800} ls={-0.04} style={{ position: "relative" }} words={[{ t: "Keep", at: "w:keep" }, { t: "opportunities", at: "w:opportunities" }, { t: "moving.", at: "w:moving", accent: true }]} /></div>} /></div>} />
      {WHO.map(([t, c, h, at, bg], i) => {
        const e = k(g, off(at, -0.1), 0.5, POP);
        if (e <= 0) return null;
        const x = 190 + i * 540, y = 300;
        // ping → reply, three times each: the bolt answers
        const pings = [0, 1, 2].map((n) => T.s("w:helps") + i * 0.18 + n * 0.55);
        return (
          <div key={t} style={{ position: "absolute", left: 0, top: 0, width: 460, height: 470, transform: `translate(${x}px, ${y + (1 - Math.min(1, e)) * 60 + out * 40}px) scale(${Math.min(1, e)})`, opacity: 1 - out, willChange: "transform" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: C.white, boxShadow: SHADOW }} />
            <div style={{ position: "absolute", left: 30, top: -26 }}><Chip c={c} s={32}>{t}</Chip></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              {i < 2 ? <Avatar t={t[0]} s={130} bg={bg} /> : <div style={{ display: "flex" }}>{[C.mint, C.lavender, C.peach].map((b, j) => <span key={j} style={{ marginLeft: j ? -40 : 0 }}><Avatar t={["A", "B", "C"][j]} s={110} bg={b} /></span>)}</div>}
              <b style={{ fontSize: 30 }}>{h}</b>
            </div>
            {pings.map((p, n) => {
              const a = k(g, p, 0.3, POP), r = k(g, p + 0.22, 0.3, POP), gone = k(g, p + 0.5, 0.25, DEPART);
              return a > 0 && gone < 1 && <div key={n} style={{ position: "absolute", left: 34, right: 34, top: 300, opacity: 1 - gone, transform: `translateY(${-gone * 30}px)` }}>
                <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: 18, background: "#EFEFEF", fontSize: 22, fontWeight: 600, transform: `scale(${a})`, transformOrigin: "0 50%" }}>💬 New message</div>
                {r > 0 && <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 18, background: C.ink, color: C.yellow, fontSize: 22, fontWeight: 800, transform: `scale(${r})`, transformOrigin: "100% 50%" }}><Ico k="bolt" s={20} c={C.yellow} fill={C.yellow} />Replied</span></div>}
              </div>;
            })}
          </div>
        );
      })}
      {/* opportunities keep moving: a stream of what their dashboard tracks, along a gold track */}
      {g >= T.f("w:keep-0.2") && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
          <div style={{ position: "absolute", left: -100, right: -100, top: 860, height: 0, borderTop: `5px dashed ${C.gold}`, opacity: k(g, "w:keep-0.1", 0.4) }} />
          {Array.from({ length: 9 }, (_, n) => {
            const t0 = T.s("w:keep") + n * 0.22, p = (g / 30 - t0) / 1.5;
            if (p <= 0 || p >= 1) return null;
            const src = n % 3, sx = 190 + src * 540 + 230;
            const x = lerp(sx, 2100, Math.max(0, (p - 0.2) / 0.8)), y = lerp(770, 860, Math.min(1, p / 0.2));
            return <div key={n} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 130}px, ${y - 30}px) scale(${Math.min(1, p * 6)})`, willChange: "transform" }}>
              <span style={{ display: "inline-flex", padding: "12px 20px", borderRadius: 999, background: C.white, boxShadow: SHADOW, fontSize: 24, fontWeight: 800, whiteSpace: "nowrap", border: `2px solid ${C.yellow}` }}>{OPPS[n % 4]}</span>
            </div>;
          })}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 10 · less manual messaging: the copy-paste stack, struck out
const Less: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("less-0.2") || g > T.f("more+0.6")) return null;
  const strike = k(g, "w:manual+0.05", 0.35, MOVE), collapse = k(g, "w:messaging+0.15", 0.5, MOVE), out = k(g, "more-0.05", 0.4, DEPART);
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const e = k(g, off("less", -0.05 + i * 0.07), 0.3, POP);
        if (e <= 0) return null;
        const y = lerp(250 + i * 104, 520, collapse);
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${200 + (i % 2) * 30}px, ${y}px) scale(${e * lerp(1, i === 5 ? 1 : 0.7, collapse)})`, opacity: (i === 5 ? 1 : 1 - collapse) * (1 - out), transformOrigin: "0 50%" }}>
          <div style={{ position: "relative", padding: "18px 26px", borderRadius: 28, borderBottomRightRadius: 8, background: "linear-gradient(135deg, #7C3AED, #3797F0)", color: "#fff", fontSize: 34, fontWeight: 600, whiteSpace: "nowrap" }}>
            Here’s the link! 🔗 <span style={{ opacity: 0.7, fontSize: 24 }}>(copy, paste)</span>
            <div style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 6, borderRadius: 6, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${Math.min(1, Math.max(0, strike * 6 - i * 0.9))}) rotate(-2deg)` }} />
          </div>
        </div>;
      })}
      <Line g={g} x={960} y={360} size={128} weight={800} ls={-0.045} out="more-0.12" words={[{ t: "Less", at: "w:less" }, { t: "manual", at: "w:manual", strike: "w:manual+0.12" }]} />
      <Line g={g} x={960} y={510} size={128} weight={800} ls={-0.045} out="more-0.08" words={[{ t: "messaging.", at: "w:messaging" }]} />
    </>
  );
};

// ---------------------------------------------------------------- 11 · more conversations, working for you every day (their yellow)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const More: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("more-0.1") || g > T.f("sign+0.8")) return null;
  const out = k(g, "sign-0.35", 0.4, DEPART);
  const AV = [C.pink, C.sky, C.mint, C.peach, C.lavender, C.lilac, C.lime];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Line g={g} x={140} y={150} size={124} weight={800} ls={-0.045} words={[{ t: "More", at: "w:more" }, { t: "conversations", at: "w:conversations2" }]} />
      <Line g={g} x={146} y={300} size={60} weight={700} ls={-0.03} words={[{ t: "working", at: "w:working" }, { t: "for", at: "w:for" }, { t: "you", at: "w:you2" }, { t: "every", at: "w:every2" }, { t: "day.", at: "w:day", under: "w:day+0.2" }]} />
      {DAYS.map((d, i) => {
        const x = 150 + i * 240, n = [3, 4, 3, 5, 4, 5, 4][i];
        const dk = k(g, off("w:working", -0.2 + i * 0.12), 0.35);
        return (
          <React.Fragment key={d}>
            <div style={{ position: "absolute", left: x, top: 980, width: 210, textAlign: "center", fontSize: 32, fontWeight: 800, opacity: dk }}>{d}</div>
            {Array.from({ length: n }, (_, j) => {
              const e = k(g, off("w:working", -0.1 + i * 0.12 + j * 0.13), 0.35, POP);
              if (e <= 0) return null;
              return <div key={j} style={{ position: "absolute", left: 0, top: 0, width: 210, height: 72, transform: `translate(${x}px, ${900 - j * 86 - (1 - e) * 30}px) scale(${e})`, borderRadius: 20, background: C.white,
                boxShadow: "0 16px 30px -18px rgba(10,10,10,.35)", display: "flex", alignItems: "center", gap: 12, padding: "0 14px", willChange: "transform" }}>
                <Avatar t="" s={44} bg={AV[(i + j) % 7]} ring={false} /><div style={{ flex: 1 }}><div style={{ height: 10, borderRadius: 5, background: C.ink, width: "75%" }} /><div style={{ height: 8, borderRadius: 4, background: C.line, width: "55%", marginTop: 8 }} /></div>
                <Ico k="bolt" s={22} c={C.gold} fill={C.gold} />
              </div>;
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- 12 · Zapify. Automate your Instagram DMs and grow on autopilot.
const Sign: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("sign")) return null;
  const l1: W[] = [{ t: "Automate", at: "w:automate" }, { t: "your", at: "w:your" }, { t: "Instagram", at: "w:instagram3" }, { t: "DMs", at: "w:dms2" }];
  const l2: W[] = [{ t: "and", at: "w:and4" }, { t: "grow", at: "w:grow" }, { t: "on", at: "w:on" }, { t: "autopilot.", at: "w:autopilot", mark: "w:autopilot+0.2" }];
  const W0 = measure("Zapify", 96, 800, -0.04);
  const btn = k(g, "w:autopilot+0.45", 0.5), foot = k(g, "w:autopilot+0.8", 0.5);
  const flash = k(g, "w:zapify3+0.1", 0.6);
  return (
    <>
      {flash > 0 && flash < 1 && <div style={{ position: "absolute", left: 960 - 200, top: 320 - 200, width: 400, height: 400, borderRadius: 999, border: `10px solid ${C.gold}`, transform: `scale(${0.3 + flash * 1.6})`, opacity: 1 - flash }} />}
      <Line g={g} x={960 - W0 / 2} y={470} size={96} weight={800} ls={-0.04} words={[{ t: "Zapify", at: "w:zapify3+0.05" }]} />
      <Line g={g} x={centred(l1, 72, 960, 800)} y={600} size={72} weight={800} ls={-0.04} words={l1} />
      <Line g={g} x={centred(l2, 72, 960, 800)} y={690} size={72} weight={800} ls={-0.04} words={l2} />
      <div style={{ position: "absolute", left: 0, top: 810, width: 1920, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 52px", borderRadius: 999, background: GOLD, fontSize: 40, fontWeight: 800, boxShadow: "0 24px 40px -20px rgba(234,179,8,.9)" }}>Start free <Ico k="arrow" s={34} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 940, width: 1920, textAlign: "center", fontSize: 30, fontWeight: 600, color: C.muted, opacity: foot }}>No credit card required · Cancel anytime</div>
      {BITS.map(([kind], i) => {
        // the callback: the opening's interactions return on "grow" and keep circling the card on their own (autopilot)
        const p = k(g, off("w:grow", -0.1 + i * 0.05), 0.5, POP);
        if (p <= 0) return null;
        const a = (i / BITS.length) * Math.PI * 2 + (g - T.f("w:grow")) / 150;
        const sx = 960 + Math.cos(a) * 840, sy = 545 + Math.sin(a) * 485;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sx - 48}px, ${sy - 48}px) scale(${p * 0.78}) rotate(${(i % 2 ? 1 : -1) * 8}deg)`,
          willChange: "transform" }}><Bit kind={kind} /></div>;
      })}
    </>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  // the logo: builds out of the stream, rides in the corner like their nav, returns for the sign-off
  const [lx, ly, ls, lo] = track(g, [["hook", 960, 470, 300, 0], ["w:with-0.12", 960, 470, 300, 1], ["sources-0.05", 960, 470, 300, 1], ["sources+0.55", 110, 90, 84, 1, MOVE],
    ["sign-0.1", 110, 90, 84, 1], ["sign+0.65", 960, 320, 250, 1, MOVE], ["end", 960, 320, 256, 1]]);
  const bubble = k(g, "w:with-0.1", 0.55), bolt = k(g, "w:zapify-0.05", 0.4, POP);
  // bright fields, each opening out of the phone or the thing that leads the next beat
  const PH = { x: 745 + PHONE.w / 2, y: 540 };
  const lav = 2300 * k(g, "links-0.08", 0.7, MOVE), peach = 2300 * k(g, "emails-0.08", 0.7, MOVE), pink = 2300 * k(g, "comments-0.08", 0.7, MOVE), mint = 2300 * k(g, "story-0.08", 0.7, MOVE);
  const white = 2300 * k(g, "who-0.08", 0.7, MOVE), yellow = 2300 * k(g, "more-0.1", 0.7, MOVE), white2 = 2300 * k(g, "sign-0.1", 0.7, MOVE);
  const px = g < T.f("links+0.5") ? PH.x : 190 + PHONE.w / 2;
  return (
    <>
      {lav > 0 && g < T.f("emails+0.7") && <Iris x={px} y={PH.y} r={lav} bg={C.lavender} />}
      {peach > 0 && g < T.f("comments+0.7") && <Iris x={405} y={PH.y} r={peach} bg={C.peach} />}
      {pink > 0 && g < T.f("story+0.7") && <Iris x={405} y={PH.y} r={pink} bg={C.pink} />}
      {mint > 0 && g < T.f("who+0.7") && <Iris x={405} y={PH.y} r={mint} bg={C.mint} />}
      {white > 0 && g < T.f("more+0.7") && <Iris x={405} y={PH.y} r={white} bg={C.page} />}
      {yellow > 0 && g < T.f("sign+0.7") && <Iris x={480} y={560} r={yellow} bg={C.yellowField} />}
      {white2 > 0 && <Iris x={960} y={320} r={white2} bg={C.white} />}

      <Hook g={g} />
      <Brand g={g} lx={lx} ly={ly} ls={ls} />
      <Sources g={g} />
      <PhoneLayer g={g} />
      <Feature g={g} />
      <Who g={g} />
      <Less g={g} />
      <More g={g} />
      <Sign g={g} />
      {lo > 0 && <Logo x={lx} y={ly} s={ls} bubble={bubble} bolt={bolt} style={{ opacity: lo }} />}
    </>
  );
};
