'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from 'react';
import GooeyNav from './GooeyNav';
import StrokeText from './StrokeText';

const numberedSlides = (folder:string,count:number) => Array.from({length:count},(_,index)=>`/projects/case-studies/${folder}/${String(index+1).padStart(2,'0')}.webp`);
const workSlides = {
  grape:numberedSlides('grape',16),
  douyin:numberedSlides('douyin',19),
  huxi:numberedSlides('huxi',10),
  peach:['/projects/case-studies/other/peach-power-family.webp'],
  beauty:['/projects/case-studies/other/path-of-beauty.webp'],
  poster:['/projects/case-studies/other/poster-design.webp'],
};

const projects = [
  { index:'01', title:'吐司官网设计', english:'Tusi Website', type:'WEB DESIGN · BRAND EXPERIENCE', description:'为吐司构建面向创作者与浏览用户的品牌官网体验，在清晰传达产品价值的同时建立鲜明的视觉记忆。', image:'/projects/tencent-toast.png', slides:['/projects/tencent-toast.png'], year:'2026', color:'#F1EEE8', ink:'#111111' },
  { index:'02', title:'外滩黑客松大赛吐司端内设计', english:'Tusi Bund Hackathon', type:'MOBILE UI/UX · ACTIVITY DESIGN', description:'围绕活动信息与多元用户目标，探索吐司端内的活动页面与参与体验。', image:'/projects/demo/tusi-hackathon.jpg', slides:['/projects/demo/tusi-hackathon.jpg'], year:'2026', color:'#18151E', ink:'#FFFFFF' },
  { index:'03', title:'Ggrape 青提音乐APP视觉设计', english:'G·grape Music App', type:'PRODUCT DESIGN · UI/UX', description:'以情绪化视觉语言重新想象移动音乐体验，让界面本身成为听觉氛围的一部分。', image:'/figma/work-grape-card.jpg', slides:workSlides.grape, year:'2024', color:'#C7E52E', ink:'#111111' },
  { index:'04', title:'抖音「文字发布」功能体验升级项目', english:'Douyin 「Text Publishing」', type:'UX OPTIMIZATION · INTERACTION', description:'围绕表达门槛与创作效率，重新梳理文字发布链路与创作辅助体验。', image:'/figma/work-douyin-card.jpg', slides:workSlides.douyin, year:'2024', color:'#161616', ink:'#FFFFFF' },
  { index:'05', title:'「儒释道新说」虎溪三笑 IP形象设计', english:'Huxi Sanxiao', type:'VISUAL DESIGN · CULTURAL IP', description:'从地方文化典故出发，构建角色、视觉体系与可延展的文创产品体验。', image:'/figma/work-huxi-card.jpg', slides:workSlides.huxi, year:'2023', color:'#A53C2D', ink:'#FFFFFF' },
];

const otherWorks = [
  { index:'09', english:'Peach Power Family', title:'桃气能量团IP形象设计', image:workSlides.peach[0], slides:workSlides.peach, type:'IP DESIGN', year:'2023', description:'以年轻、轻松的角色语言构建桃气能量团的 IP 视觉形象与延展应用。', color:'#FF91AD', ink:'#2B1020' },
  { index:'10', english:'The Path of Beauty', title:'《美的历程》书籍装帧设计', image:workSlides.beauty[0], slides:workSlides.beauty, type:'EDITORIAL DESIGN', year:'2022', description:'围绕《美的历程》的文化脉络进行书籍视觉与阅读节奏设计。', color:'#7B211E', ink:'#FFFFFF' },
  { index:'11', english:'Poster Design', title:'海报设计作品', image:workSlides.poster[0], slides:workSlides.poster, type:'VISUAL EXPLORATION', year:'2022—2025', description:'以字体、图形与构成为核心的系列视觉实验。', color:'#202020', ink:'#FFFFFF' },
];

const extendedWorks = [
  { index:'06', title:'吐司互动玩法探索', english:'Tusi Interaction Play', type:'INTERACTION DESIGN · CONCEPT', description:'从“让好作品被看见”出发，探索脑洞集市、星选榜单与创作者激励机制。', image:'/projects/demo/tusi-interaction.jpg', slides:['/projects/demo/tusi-interaction.jpg'], year:'2026', color:'#6047D9', ink:'#FFFFFF' },
  { index:'07', title:'Marvis「扬华寻迹」Skill', english:'「Yanghua Quest」 Skill', type:'AI SKILL · PROTOTYPING', description:'将校园文化探索转化为可调用的 AI Skill 体验。', image:'/projects/demo/marvis-skill.jpg', slides:['/projects/demo/marvis-skill.jpg'], year:'2026', color:'#E6C742', ink:'#17130A' },
  { index:'08', title:'吐司「灵感封面」Skill', english:'「Inspiration Cover」 Skill', type:'AI SKILL · DESIGN WORKFLOW', description:'以可复用的 AI 工作流辅助灵感封面的生成与设计表达。', image:'/projects/demo/ai-workflow.jpg', slides:['/projects/demo/ai-workflow.jpg'], year:'2026', color:'#7C3AED', ink:'#FFFFFF' },
];

const detailWorks = [...projects,...extendedWorks,...otherWorks];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [helloActive, setHelloActive] = useState(false);
  const [helloPhase, setHelloPhase] = useState<'idle'|'enter'|'exit'>('idle');
  const helloText = 'HELLO THERE,';
  const detailTrackRef = useRef<HTMLDivElement>(null);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [workTheme, setWorkTheme] = useState(false);
  const [hoveredWorkIndex, setHoveredWorkIndex] = useState<string | null>(null);
  const [previewReadyIndex, setPreviewReadyIndex] = useState<string | null>(null);
  const workHoverTimerRef = useRef<number | null>(null);
  const detailTargetRef = useRef(0);
  const detailFrameRef = useRef(0);
  const detailDragRef = useRef<{pointerId:number;x:number;left:number}|null>(null);
  const activeWork = activeWorkIndex===null?null:detailWorks[activeWorkIndex];
  const openWork = (index:string)=>{
    const nextIndex=detailWorks.findIndex(work=>work.index===index);
    if(nextIndex>=0)setActiveWorkIndex(nextIndex);
  };
  const closeWork = ()=>setActiveWorkIndex(null);
  const showAdjacentWork = (direction:number)=>setActiveWorkIndex(current=>current===null?null:(current+direction+detailWorks.length)%detailWorks.length);
  const moveDetail = (event:WheelEvent<HTMLDivElement>)=>{
    event.preventDefault();
    const track=event.currentTarget;
    const max=Math.max(0,track.scrollWidth-track.clientWidth);
    const wheelDelta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
    const step=Math.max(-320,Math.min(320,wheelDelta*1.18));
    detailTargetRef.current=Math.max(0,Math.min(max,detailTargetRef.current+step));
    if(detailFrameRef.current)return;
    const glide=()=>{
      const distance=detailTargetRef.current-track.scrollLeft;
      track.scrollLeft+=distance*.14;
      if(Math.abs(distance)>.6)detailFrameRef.current=window.requestAnimationFrame(glide);
      else{track.scrollLeft=detailTargetRef.current;detailFrameRef.current=0}
    };
    detailFrameRef.current=window.requestAnimationFrame(glide);
  };
  const beginDetailDrag = (event:PointerEvent<HTMLDivElement>)=>{
    if(event.pointerType==='touch'||event.button===0){
      event.currentTarget.setPointerCapture(event.pointerId);
      detailDragRef.current={pointerId:event.pointerId,x:event.clientX,left:event.currentTarget.scrollLeft};
      event.currentTarget.classList.add('is-dragging');
    }
  };
  const dragDetail = (event:PointerEvent<HTMLDivElement>)=>{
    const drag=detailDragRef.current;
    if(!drag||drag.pointerId!==event.pointerId)return;
    const track=event.currentTarget;
    const next=drag.left-(event.clientX-drag.x)*1.2;
    track.scrollLeft=next;
    detailTargetRef.current=next;
  };
  const endDetailDrag = (event:PointerEvent<HTMLDivElement>)=>{
    if(detailDragRef.current?.pointerId!==event.pointerId)return;
    detailDragRef.current=null;
    event.currentTarget.classList.remove('is-dragging');
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  useEffect(()=>{
    const section=showcaseRef.current;
    if(!section)return;
    const cards=Array.from(section.querySelectorAll<HTMLElement>('.project-card-stack'));
    const stage=section.querySelector<HTMLElement>('.card-stage');
    let frame=0;
    const clamp=(value:number)=>Math.max(0,Math.min(1,value));
    const smooth=(start:number,end:number,value:number)=>{
      const t=clamp((value-start)/(end-start));
      return t*t*(3-2*t);
    };
    const mix=(from:number,to:number,value:number)=>from+(to-from)*value;
    const render=()=>{
      frame=0;
      const rect=section.getBoundingClientRect();
      const travel=Math.max(1,section.offsetHeight-window.innerHeight);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      // Keep a three-card composition on screen: the previous card exits on
      // the left while the current card lingers in the centre and the next
      // card enters from the right.
      const cardGap=.8;
      const cardDuration=3.3;
      const introDuration=.72;
      const lastCardEnd=introDuration+(cards.length-1)*cardGap+cardDuration;
      const totalDuration=lastCardEnd+1.05;
      const timeline=progress*totalDuration;
      cards.forEach((card,index)=>{
        const start=introDuration+index*cardGap;
        const local=clamp((timeline-start)/cardDuration);
        const visible=smooth(0,.055,local)*(1-smooth(.945,1,local));
        const segment=(from:number,to:number,value:number)=>smooth(from,to,value);
        let x=118;
        if(local<.2)x=mix(118,44,segment(0,.2,local));
        else if(local<.38)x=mix(44,14,segment(.2,.38,local));
        else if(local<.62)x=mix(14,-14,segment(.38,.62,local));
        else if(local<.8)x=mix(-14,-44,segment(.62,.8,local));
        else x=mix(-44,-128,segment(.8,1,local));
        const centerLift=[-7,7,-3,5,-6,4][index%6];
        const startY=index%2===0?-21:20;
        const endY=index%3===0?18:index%3===1?-16:11;
        const path=smooth(0,1,local);
        const y=Math.pow(1-path,2)*startY+2*(1-path)*path*centerLift+path*path*endY;
        const startRotation=index%2===0?-21:17;
        const centerRotation=[-8,7,-4,6,-7,4][index%6];
        const endRotation=index%3===0?14:index%3===1?-18:8;
        const rotation=local<.5?mix(startRotation,centerRotation,smooth(0,.5,local)):mix(centerRotation,endRotation,smooth(.5,1,local));
        card.style.setProperty('--card-x',`${x}vw`);
        card.style.setProperty('--card-y',`${y}vh`);
        card.style.setProperty('--card-r',`${rotation}deg`);
        card.style.setProperty('--card-scale',`${.92+Math.sin(local*Math.PI)*.08}`);
        card.style.setProperty('--card-opacity',visible.toFixed(3));
        card.style.pointerEvents=visible>.35?'auto':'none';
        card.style.zIndex=String(20+index);
      });
      const raw=(timeline-introDuration)/cardGap;
      const next=Math.max(0,Math.min(cards.length-1,Math.round(raw)));
      setShowcaseIndex(current=>current===next?current:next);
      if(stage){
        const outro=smooth(lastCardEnd-.08,lastCardEnd+.48,timeline);
        const slogan=smooth(lastCardEnd+.04,lastCardEnd+.82,timeline);
        stage.style.setProperty('--project-opacity',(1-outro).toFixed(3));
        stage.style.setProperty('--project-y',`${-outro*19}vh`);
        stage.style.setProperty('--work-slogan-opacity',slogan.toFixed(3));
        stage.style.setProperty('--work-slogan-y',`${mix(64,0,slogan)}px`);
        stage.style.setProperty('--work-chrome-opacity',(1-smooth(lastCardEnd+.02,lastCardEnd+.58,timeline)).toFixed(3));
      }
    };
    const request=()=>{if(!frame)frame=window.requestAnimationFrame(render)};
    render();
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    return ()=>{window.removeEventListener('scroll',request);window.removeEventListener('resize',request);if(frame)window.cancelAnimationFrame(frame)};
  },[]);
  useEffect(()=>{
    const syncTheme=()=>{
      const work=document.getElementById('work');
      const footer=document.querySelector('footer');
      if(!work)return;
      const navEdge=window.innerWidth<=760?142:195;
      const workTop=work.getBoundingClientRect().top;
      const footerTop=footer?.getBoundingClientRect().top??Number.POSITIVE_INFINITY;
      const inWork=workTop<=navEdge&&footerTop>navEdge;
      setWorkTheme(current=>current===inWork?current:inWork);
    };
    syncTheme();
    window.addEventListener('scroll',syncTheme,{passive:true});
    window.addEventListener('resize',syncTheme);
    return()=>{window.removeEventListener('scroll',syncTheme);window.removeEventListener('resize',syncTheme)};
  },[]);
  useEffect(()=>{
    const section=document.getElementById('work');
    if(!section)return;
    const loadCovers=()=>detailWorks.forEach(work=>{
      const image=new window.Image();
      image.decoding='async';
      image.loading='eager';
      image.src=work.image;
    });
    if(!('IntersectionObserver' in window)){loadCovers();return}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){loadCovers();observer.disconnect()}
    },{rootMargin:'1200px 0px'});
    observer.observe(section);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(activeWorkIndex===null)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    detailTargetRef.current=0;
    detailTrackRef.current?.scrollTo({left:0,behavior:'auto'});
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')closeWork()};
    window.addEventListener('keydown',onKeyDown);
    return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKeyDown);if(detailFrameRef.current)window.cancelAnimationFrame(detailFrameRef.current);detailFrameRef.current=0};
  },[activeWorkIndex]);
  useEffect(()=>{
    if (!('IntersectionObserver' in window)) {setHelloActive(true);return}
    const sections = document.querySelectorAll<HTMLElement>('.figma-about');
    const reveals = document.querySelectorAll<HTMLElement>('.about-history article,.about-awards');
    sections.forEach(section=>section.classList.add('motion-ready'));
    const sectionObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (entry.isIntersecting) {entry.target.classList.add('entered');setHelloActive(true);sectionObserver.unobserve(entry.target)}
    }),{threshold:.16,rootMargin:'0px 0px -10% 0px'});
    const detailObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (entry.isIntersecting) {entry.target.classList.add('is-visible');detailObserver.unobserve(entry.target)}
    }),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    sections.forEach(section=>sectionObserver.observe(section));
    reveals.forEach(reveal=>detailObserver.observe(reveal));
    return ()=>{sectionObserver.disconnect();detailObserver.disconnect();sections.forEach(section=>section.classList.remove('motion-ready'))};
  },[]);
  useEffect(()=>{
    if (!helloActive) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {setHelloPhase('enter');return}
    const timers:number[]=[];
    const run=()=>{
      setHelloPhase('enter');
      timers.push(window.setTimeout(()=>setHelloPhase('exit'),2800));
    };
    run();
    const loop=window.setInterval(run,5000);
    return ()=>{window.clearInterval(loop);timers.forEach(timer=>window.clearTimeout(timer))};
  },[helloActive]);
  useEffect(()=>{
    const section=document.querySelector<HTMLElement>('.slogan');
    const stage=section?.querySelector<HTMLElement>('.slogan-stage');
    const lines=section?.querySelectorAll<HTMLElement>('.slogan-line');
    if (!section || !stage || !lines?.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const smooth=(a:number,b:number,value:number)=>{
      const t=Math.max(0,Math.min(1,(value-a)/(b-a)));
      return t*t*(3-2*t);
    };
    const phases=[[-.12,.31],[.10,.54],[.34,.78],[.58,1.12]];
    const current=Array.from(lines,()=>({opacity:0,y:44}));
    const target=Array.from(lines,()=>({opacity:0,y:44}));
    let frame=0;
    let initialized=false;
    const calculate=()=>{
      const rect=section.getBoundingClientRect();
      const travel=Math.max(1,section.offsetHeight-stage.offsetHeight);
      const progress=Math.max(0,Math.min(1,(95-rect.top)/travel));
      lines.forEach((line,index)=>{
        const [start,end]=phases[index];
        const entering=smooth(start,start+.16,progress);
        const leaving=1-smooth(end-.16,end,progress);
        const opacity=entering*leaving;
        target[index]={opacity,y:(1-entering)*44-(1-leaving)*44};
      });
    };
    const render=()=>{
      let delta=0;
      lines.forEach((line,index)=>{
        current[index].opacity+=(target[index].opacity-current[index].opacity)*.19;
        current[index].y+=(target[index].y-current[index].y)*.19;
        delta=Math.max(delta,Math.abs(target[index].opacity-current[index].opacity),Math.abs(target[index].y-current[index].y)/44);
        line.style.setProperty('--line-opacity',current[index].opacity.toFixed(3));
        line.style.setProperty('--line-y',`${current[index].y.toFixed(2)}px`);
      });
      frame=delta>.001?window.requestAnimationFrame(render):0;
    };
    const request=()=>{
      calculate();
      if (!initialized) {
        target.forEach((value,index)=>{current[index]={...value}});
        initialized=true;
      }
      if (!frame) frame=window.requestAnimationFrame(render);
    };
    request();
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    return ()=>{window.removeEventListener('scroll',request);window.removeEventListener('resize',request);if(frame)window.cancelAnimationFrame(frame)};
  },[]);
  const trackHero = (event:PointerEvent<HTMLDivElement>)=>{
    if (event.pointerType==='touch') return;
    const frame=event.currentTarget,rect=frame.getBoundingClientRect();
    frame.style.setProperty('--cross-x',`${event.clientX-rect.left+22}px`);
    frame.style.setProperty('--cross-y',`${event.clientY-rect.top+16}px`);
    frame.classList.add('tracking');
  };
  const leaveHero = (event:PointerEvent<HTMLDivElement>)=>event.currentTarget.classList.remove('tracking');
  const trackAbout = (event:PointerEvent<HTMLElement>)=>{
    if (event.pointerType==='touch') return;
    const section=event.currentTarget,rect=section.getBoundingClientRect();
    section.style.setProperty('--cursor-x',`${event.clientX-rect.left+30}px`);
    section.style.setProperty('--cursor-y',`${event.clientY-rect.top-20}px`);
    section.classList.add('cursor-active');
    section.classList.toggle('keyword-hover',event.target instanceof Element && Boolean(event.target.closest('.about-keyword')));
  };
  const leaveAbout = (event:PointerEvent<HTMLElement>)=>{
    event.currentTarget.classList.remove('cursor-active','keyword-hover');
  };
  const movePortrait = (event:PointerEvent<HTMLDivElement>)=>{
    if (event.pointerType==='touch') return;
    const frame=event.currentTarget,rect=frame.getBoundingClientRect();
    frame.style.setProperty('--photo-x',`${((event.clientX-rect.left)/rect.width-.5)*-24}px`);
    frame.style.setProperty('--photo-y',`${((event.clientY-rect.top)/rect.height-.5)*-24}px`);
  };
  const resetPortrait = (event:PointerEvent<HTMLDivElement>)=>{
    event.currentTarget.style.setProperty('--photo-x','0px');
    event.currentTarget.style.setProperty('--photo-y','0px');
    event.currentTarget.closest('.figma-about')?.classList.remove('photo-hover');
  };
  const moveWorkPreview = (event:PointerEvent<HTMLDivElement>)=>{
    if(event.pointerType==='touch')return;
    const menu=event.currentTarget;
    const rect=menu.getBoundingClientRect();
    const previewWidth=Math.min(340,Math.max(190,rect.width*.18));
    const previewHeight=previewWidth*.625;
    const x=Math.max(0,Math.min(rect.width-previewWidth-32,event.clientX-rect.left));
    const y=Math.max(previewHeight/2+10,Math.min(rect.height-previewHeight/2-10,event.clientY-rect.top));
    menu.style.setProperty('--preview-x',`${x}px`);
    menu.style.setProperty('--preview-y',`${y}px`);
  };
  const queueWorkPreview = (index:string)=>{
    if(workHoverTimerRef.current!==null)window.clearTimeout(workHoverTimerRef.current);
    workHoverTimerRef.current=window.setTimeout(()=>{
      setPreviewReadyIndex(null);
      setHoveredWorkIndex(index);
      workHoverTimerRef.current=null;
    },180);
  };
  const clearWorkPreview = ()=>{
    if(workHoverTimerRef.current!==null)window.clearTimeout(workHoverTimerRef.current);
    workHoverTimerRef.current=null;
    setPreviewReadyIndex(null);
    setHoveredWorkIndex(null);
  };
  const hoveredWork=hoveredWorkIndex?detailWorks.find(work=>work.index===hoveredWorkIndex):null;
  const detailDisplayName=activeWork?(activeWork.english.length>24?activeWork.title:activeWork.english):'';
  const navItems = [
    { label:'ABOUT', href:'#about' },
    { label:'WORK', href:'#work' },
    { label:'CONTACT', href:'mailto:812544883@qq.com' },
  ];
  return <main>
    <section className="cover" id="top">
      <nav className={`cover-nav ${workTheme?'work-theme':''}`}>
        <a className="cover-logo" href="#top">PUREGAN</a>
        <div className="cover-links"><GooeyNav items={navItems} particleCount={15} particleDistances={[90,10]} particleR={100} initialActiveIndex={-1} animationTime={600} timeVariance={300} colors={[1,2,3,1,2,3,1,4]}/></div>
        <button className="cover-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="打开导航">{menuOpen?'CLOSE':'MENU'}</button>
      </nav>
      {menuOpen&&<div className="mobile-menu"><a href="#about" onClick={()=>setMenuOpen(false)}>ABOUT</a><a href="#work" onClick={()=>setMenuOpen(false)}>WORK</a><a href="mailto:812544883@qq.com">CONTACT</a></div>}
      <div className="cover-stage">
        <div className="cover-portrait" onPointerMove={trackHero} onPointerLeave={leaveHero}><Image src="/figma/hero-v2.png" fill priority sizes="124vw" alt="甘普尔黑白肖像拼贴" /><span className="hero-crosshair" aria-hidden="true"/></div>
        <div className="hero-lines" aria-hidden="true"><i/><i/><i/><i/><i/></div>
        <h1 className="cover-design"><StrokeText text="DESIGN" strokeColor="#A78BFA" fillColor="#000000" strokeWidth={1.4} drawDuration={1.6} fillDelay={0.2} stagger={0.05} fontSize={140} letterSpacing={-7} viewWidth={700} viewHeight={210}/></h1>
        <div className="cover-caption"><span>個</span><small>（INDIVIDUAL /<br/>-PORTFOLIO）</small><span>人</span><b>設計</b><b>作品集</b></div>
        <div className="cover-portfolio"><StrokeText text="PORTFOLIO" strokeColor="#A78BFA" fillColor="#000000" strokeWidth={1.4} drawDuration={1.6} fillDelay={0.2} stagger={0.05} fontSize={125.33} letterSpacing={-6.27} viewWidth={920} viewHeight={188}/></div>
        <a className="cover-welcome" href="#slogan"><span>WELCOME TO MY WONDERLAND</span><Image src="/figma/hero-arrow-v2.svg" width={270} height={8} alt=""/></a>
      </div>
    </section>

    <section className="slogan" id="slogan">
      <div className="slogan-stage"><div className="slogan-label"><span>VISUAL</span><i/><span>USER EXPERIENCE</span></div>
        <h2><span className="slogan-line">DESIGNING</span><span className="slogan-line slogan-outline">VISUAL STORIES</span><span className="slogan-line slogan-digital">&amp;DIGITAL</span><span className="slogan-line slogan-muted">EXPERIENCES.</span></h2>
        <p>视觉与用户体验设计师，关注品牌表达、产品界面与 AI 增强型设计实践。</p></div>
    </section>

    <section className="figma-about" id="about" onPointerMove={trackAbout} onPointerLeave={leaveAbout}>
      <span className="about-cursor" aria-hidden="true"><i>(</i><i>)</i></span>
      <h2 className={`hello-title hello-${helloPhase}`} aria-label={helloText}>{Array.from(helloText).map((letter,index)=><span className="hello-char" aria-hidden="true" key={`${letter}-${index}`} style={{'--hello-in-delay':`${index*68}ms`,'--hello-out-delay':`${(helloText.length-1-index)*68}ms`} as CSSProperties}>{letter===' '? '\u00A0':letter}</span>)}</h2>
      <div className="about-identity"><span>甘</span><span>普</span><span>尔</span><small>Pure Gan</small></div>
      <p className="about-born">出生 01 DECEMBER 2001 来自中国四川省.</p>
      <p className="about-intro">我是INTJ-A 射手座，兼具理性与感性，也不乏天马行空的想象力——擅长以<span className="about-keyword">视觉设计</span>提升<span className="about-keyword">用户体验</span>，注重细节，随和好沟通，自驱力强。热爱设计行业，乐于突破职能边界，从长期价值的角度思考设计，并持续探索 <span className="about-keyword">AIGC</span> 在设计中的应用。</p>
      <div className="about-art" onPointerMove={movePortrait} onPointerEnter={event=>event.currentTarget.closest('.figma-about')?.classList.add('photo-hover')} onPointerLeave={resetPortrait}><Image className="about-photo" src="/figma/about-v2.png" fill sizes="(max-width: 760px) 70vw, 25vw" alt="Puregan about me 拼贴肖像"/></div>
      <Image className="paren paren-left" src="/figma/paren-left.svg" width={79} height={314} alt=""/>
      <Image className="paren paren-right" src="/figma/paren-right.svg" width={79} height={314} alt=""/>
      <div className="about-history">
        <article><h3>教育经历</h3><div><b>西南交通大学</b><small>2024.09 - Now</small><p>设计（视觉传达设计方向）研三在读</p><b>九江学院</b><small>2019.09 - 2023.06</small><p>视觉传达设计 学士学位</p></div></article>
        <article><h3>实习经历</h3><div><b>腾讯科技（深圳）有限公司</b><em>视觉设计</em><small>2026.04 - 2026.08</small><p>在腾讯 PCG 商业产品部担任视觉设计实习生，参与「吐司」产品及业务项目的视觉/UI设计，覆盖 Web 与移动端场景；协同产品、研发推进方案落地，并探索 AI 在设计生产与工作流提效中的应用。</p></div></article>
        <article><h3>项目经历</h3><div><b>九江市博物馆文创开发项目</b><em>文创产品&amp;品牌形象</em><small>2022.09 - 2023.06</small><p>针对九江博物馆文创 “数量少、设计弱、缺文化底蕴” 痛点，提取本土典故文化元素进行改良设计，让历史故事以实用文创形式融入日常。作品获校优秀毕业设计留校收藏，获 2 项国家级、4 项省级竞赛奖项，相关论文见刊于《地方大学应用型教育研究》。</p></div></article>
        <article className="coffee"><div><b>庐山八月咖啡设计项目</b><em>品牌形象&amp;设计策划</em><small>2022.10 - 2023.03</small><p>该项目以独立咖啡馆品牌升级为核心，探索小众场景视觉符号构建，历时半年独立完成需求访谈、调研分析及 VI 落地设计。方案获店铺采纳落地，成果入选校级优秀设计作品集，验证商业与设计美学的融合价值。</p></div></article>
      </div>
      <div className="about-awards">
        <h3>获奖经历</h3>
        <div><b>三好学生 / 优秀学生干部 / 优秀团干部</b><b>2023届校优秀本科毕业论文（设计）</b><b>校级专业奖学金</b><small>一等 ×3 / 二等 ×1 / 三等 ×2</small></div>
        <div><b>2025米兰设计周中国高校设计学科师生优秀作品展</b><small>省一等奖</small><b>第十届未来设计师·全国高校数字艺术设计大赛</b><small>全国优秀奖/省一等奖</small><b>第十一届未来设计师·全国高校数字艺术设计大赛</b><small>省一等奖</small></div>
        <div><b>第十一届全国大学生数字媒体科技作品及创意竞赛</b><small>全国三等奖/省二等奖</small><b>第四届东方创意之星设计大赛</b><small>全国优秀奖/省金奖</small><b>2023 “井冈之星” 设计艺术创意大赛</b><small>学生组金奖</small></div>
        <div><b>全国大中学生第十届海洋文化创意设计大赛</b><small>佳作奖</small><b>全国高等教育美育教育成果展评</b><small>学生组一等奖</small><b>新生录取通知书设计活动</b><small>二等奖</small></div>
      </div>
    </section>

    <section className="work work-cards" id="work" ref={showcaseRef} style={{'--project-count':detailWorks.length} as CSSProperties}>
      <div className="card-stage">
        <p className="work-manifesto">AESTHETICS = JUDGMENT + INTUITION</p>
        <div className="card-background" aria-hidden="true">PROJECTS</div>
        <div className="project-card-deck" aria-label="全部作品目录">{detailWorks.map((p,index)=><button className="project-card-stack" type="button" onClick={()=>openWork(p.index)} key={p.index} aria-label={`查看${p.title}项目详情`}>
          <figure><Image src={p.image} fill sizes="(max-width: 760px) 78vw, 34vw" priority={index<2} alt={`${p.title}项目封面`}/></figure>
          <div className="project-card-copy"><span>({String(index+1).padStart(2,'0')})</span><h3>{p.english}</h3><h4>{p.title}</h4><div className="project-card-notes"><em>{p.type.split(' · ')[0]}</em><b aria-hidden="true"/><p>{p.description}</p></div><i>↗</i></div>
        </button>)}</div>
        <p className="work-selected">SELECTED WORKS<br/>2023—2026</p>
        <p className="work-outro-slogan">DESIGNING VISUAL STORIES<br/><span>&amp; DIGITAL EXPERIENCES.</span></p>
      </div>
    </section>
    {activeWork&&<div className="project-detail" role="dialog" aria-modal="true" aria-label={`${activeWork.title}项目详情`} style={{'--case-bg':activeWork.color,'--case-ink':activeWork.ink} as CSSProperties}>
      <header className="detail-gallery-nav"><span>PUREGAN</span><strong>[ SCROLL / DRAG TO EXPLORE ]</strong><span>{activeWork.index} / {String(detailWorks.length).padStart(2,'0')}</span></header>
      <div className="detail-track" ref={detailTrackRef} onWheel={moveDetail} onPointerDown={beginDetailDrag} onPointerMove={dragDetail} onPointerUp={endDetailDrag} onPointerCancel={endDetailDrag}>
        {activeWork.slides.map((slide,index)=><figure className="detail-slide" key={slide}><Image src={slide} fill sizes="82vw" priority={index===0} loading={index===0?undefined:'lazy'} style={{objectFit:'contain'}} alt={`${activeWork.title}设计展示第${index+1}页`}/></figure>)}
      </div>
      <aside className="detail-gallery-meta"><h2>{activeWork.english}</h2><p>{activeWork.description}</p><dl><div><dt>DATE</dt><dd>{activeWork.year}</dd></div><div><dt>CATEGORY</dt><dd>{activeWork.type}</dd></div></dl></aside>
      <button className="detail-gallery-close" type="button" onClick={closeWork} aria-label="关闭项目详情">×</button>
      <div className="detail-gallery-switch"><button type="button" onClick={()=>showAdjacentWork(-1)}>← PREV</button><button type="button" onClick={()=>showAdjacentWork(1)}>NEXT →</button></div>
    </div>}
    <footer><p>LET&apos;S MAKE<br/><span>SOMETHING</span><br/>MEMORABLE.</p><div className="footer-contact"><span>GET IN TOUCH</span><a href="mailto:812544883@qq.com">812544883@qq.com ↗</a><small>© 2026 PUREGAN.</small></div></footer>
  </main>;
}
