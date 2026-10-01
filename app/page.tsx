'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent, type WheelEvent } from 'react';
import GooeyNav from './GooeyNav';
import StrokeText from './StrokeText';
import SideRays from './SideRays';

const numberedSlides = (folder:string,count:number) => Array.from({length:count},(_,index)=>`/projects/case-studies/${folder}/${String(index+1).padStart(2,'0')}.webp`);
const workSlides = {
  grape:numberedSlides('grape',16),
  douyin:numberedSlides('douyin',19),
  huxi:numberedSlides('huxi',10),
  aiSkill:Array.from({length:11},(_,index)=>`/projects/ai-skill/${String(index+1).padStart(2,'0')}.jpg`),
  peach:['/projects/case-studies/other/peach-power-family.webp'],
  beauty:['/projects/case-studies/other/path-of-beauty.webp'],
  poster:['/projects/poster-motion/images/cover.jpg'],
};

const marvisDemoVideos = [
  '/projects/ai-skill/videos/marvis-01.mp4',
  '/projects/ai-skill/videos/marvis-02.mp4',
  '/projects/ai-skill/videos/marvis-03.mp4',
  '/projects/ai-skill/videos/marvis-04.mp4',
] as const;

type PosterChapter = {
  id:string;
  title:string;
  english:string;
  category:string;
  year:string;
  description:string;
  award?:string;
  media:readonly ({kind:'image';src:string;alt:string;width?:number;height?:number}|{kind:'video';src:string;poster:string;alt:string;width?:number;height?:number})[];
};

const posterChapters:readonly PosterChapter[] = [
  {id:'zhiying',title:'织影流转',english:'Woven Shadows in Motion',category:'动态交互海报',year:'2025',description:'以土家族非遗西兰卡普织锦纹样为核心，运用 Touchdesigner、AE、AI 等工具重构四方连续图案，融合光影动态与音乐交互，支持粒子、万花筒特效实时切换，打造沉浸式视觉体验，借数字媒介推动非遗年轻化传承。',media:[{kind:'video',src:'/projects/poster-motion/videos/zhiying.mp4',poster:'/projects/poster-motion/videos/zhiying-poster.jpg',alt:'织影流转系列动态海报',width:1920,height:1080}]},
  {id:'yongdian',title:'佣乐大典',english:'Music of the Figurines',category:'动态交互海报',year:'2025',description:'以成都博物馆成汉陶俑为核心，运用 vibe coding 的代码置入 Processing 软件制作交互动态海报，通过粒子解构、陶俑群像动画构建完整交互闭环，以沉浸式数字叙事趣味传递文物历史内涵。',media:[{kind:'video',src:'/projects/poster-motion/videos/yongdian.mp4',poster:'/projects/poster-motion/videos/yongdian-poster.jpg',alt:'成都博物馆佣乐大典动态海报',width:2304,height:1440}]},
  {id:'konghua',title:'空花阳焰',english:'Kūka Yōen',category:'动态交互海报',year:'2025',description:'作品依托鼠标拖尾生成紫蓝色火焰交互效果，消散时伴随波纹节奏变化，让观者在互动过程中感受动态视觉韵律，呼应海报主题。',media:[{kind:'video',src:'/projects/poster-motion/videos/konghua.mp4',poster:'/projects/poster-motion/videos/konghua-poster.jpg',alt:'空花阳焰动态海报',width:960,height:1280}]},
  {id:'qingyuan',title:'遇见青原',english:'Meet in Qingyuan',category:'城市文化海报',year:'2022',award:'第十届未来设计师·全国高校数字艺术设计大赛 全国优秀奖 / 江西省一等奖',description:'以江西省吉安市青原区地域山水、历史地标与人文意象组织画面层次，构建青原文化的当代表达。',media:[{kind:'image',src:'/projects/poster-motion/images/qingyuan.webp',alt:'遇见青原文化海报',width:1697,height:2400}]},
  {id:'mucha',title:'桃坞新笺·穆夏集',english:'Alphonse Mucha × Taohuawu',category:'AIGC 非遗系列海报',year:'2025',award:'2025米兰设计周中国高校设计学科师生优秀作品展 四川赛区一等奖',description:'融合桃花坞木版年画与穆夏新艺术风格，运用 AIGC 转译非遗，结合东方平面美学与欧式流动装饰，打造“东方新艺术”视觉语言，探索非遗数字化传承方式。',media:[
    {kind:'image',src:'/projects/poster-motion/images/mucha-01.webp',alt:'桃坞新笺花开富贵海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/mucha-02.webp',alt:'桃坞新笺鲜桃枇杷满盆海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/mucha-03.webp',alt:'桃坞新笺夏花篮筐海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/mucha-04.webp',alt:'桃坞新笺牡丹双蝶海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/mucha-05.webp',alt:'桃坞新笺蟠桃知了海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/mucha-06.webp',alt:'桃坞新笺八面威风海报',width:1697,height:2400},
  ]},
  {id:'dayi',title:'北京大羿2021',english:'Beijing Dayi 2021',category:'拍卖系列海报',year:'2021',description:'提取器物形态、东方元素与留白美学，打造两套同源视觉，分别对应两场拍卖专场。两组画面彼此呼应，在尽显器物之美的同时，各自承载独立专场主题。',media:[
    {kind:'image',src:'/projects/poster-motion/images/dayi-01.webp',alt:'北京大羿玉堂传器海报',width:1697,height:2400},
    {kind:'image',src:'/projects/poster-motion/images/dayi-02.webp',alt:'北京大羿文人空间海报',width:1697,height:2400},
  ]},
  {id:'yongle',title:'永乐官窑瓷器展',english:'Yongle Imperial Porcelain',category:'展览海报',year:'2021',description:'以克制留白与器物局部建立观看焦点，呈现瓷器展览的安静质感。',media:[{kind:'image',src:'/projects/poster-motion/images/yongle.webp',alt:'永乐官窑瓷器展览海报',width:1697,height:2400}]},
  {id:'sanxingdui',title:'三星伴月',english:'Sanxingdui',category:'文化主题海报',year:'2021',description:'运用文物特写、暗色肌理、金色流沙元素与纵向文字排布，烘托古蜀文明的神秘感、厚重历史感。',media:[{kind:'image',src:'/projects/poster-motion/images/sanxingdui.webp',alt:'三星伴月三星堆主题海报',width:1697,height:2400}]},
  {id:'bencao',title:'本草纲目',english:'Compendium of Materia Medica',category:'字体实验海报',year:'2021',description:'以古籍版式、印章与药材文本为线索，尝试传统文献在现代海报中的信息重组。',media:[{kind:'image',src:'/projects/poster-motion/images/bencao.webp',alt:'本草纲目主题海报',width:1697,height:2400}]},
];

const tusiCaseMedia = [
  { kind:'image', src:'/projects/case-studies/tusi/01.webp', width:2880, height:2742, alt:'吐司官网设计项目封面与项目概览' },
  { kind:'image', src:'/projects/case-studies/tusi/02.webp', width:2880, height:9349, alt:'吐司官网设计关键问题、设计策略、视觉配方与 IP 形象' },
  { kind:'video', src:'/projects/case-studies/tusi/tusi-group.mp4', label:'吐司 IP 角色合照动态展示' },
  { kind:'image', src:'/projects/case-studies/tusi/03.webp', width:2880, height:1482, alt:'吐司官网设计项目进程' },
  { kind:'image', src:'/projects/case-studies/tusi/04.webp', width:2880, height:8067, alt:'吐司官网 PC 端与移动端界面设计' },
  { kind:'image', src:'/projects/case-studies/tusi/05.webp', width:1920, height:4591, alt:'吐司官网动效版本设计' },
  { kind:'video', src:'/projects/case-studies/tusi/tusi-motion.mp4', label:'吐司官网动效版本完整演示' },
] as const;

const verticalSlideDimensions:Record<string,{width:number;height:number}> = {
  '/projects/tusi-hackathon/01.webp':{width:2880,height:2742},
  '/projects/tusi-hackathon/02.webp':{width:2880,height:3409},
  '/projects/tusi-hackathon/03.webp':{width:2880,height:2068},
  '/projects/tusi-hackathon/04.webp':{width:2880,height:8898},
  '/projects/tusi-hackathon/05.webp':{width:2880,height:2973},
  '/projects/tusi-interaction/01.webp':{width:2880,height:4905},
  '/projects/tusi-interaction/02.webp':{width:2880,height:1971},
  '/projects/tusi-interaction/03.webp':{width:2880,height:1111},
  '/projects/tusi-interaction/04.webp':{width:2880,height:2298},
  '/projects/tusi-interaction/05.webp':{width:2880,height:2880},
  '/projects/tusi-interaction/06.webp':{width:2880,height:1620},
  '/projects/tusi-interaction/07.webp':{width:2880,height:1111},
  '/projects/tusi-interaction/08.webp':{width:2880,height:2457},
  '/projects/tusi-interaction/09.webp':{width:1920,height:1649},
};

const verticalCaseIndexes = new Set(['01','02','03']);
const centeredSingleWorkIndexes = new Set(['09','10']);

const projects = [
  { index:'01', title:'吐司官网设计', english:'Tusi Website', type:'WEB DESIGN · BRAND EXPERIENCE', description:'为吐司构建面向创作者与浏览用户的品牌官网体验，在清晰传达产品价值的同时建立鲜明的视觉记忆。', image:'/projects/tusi-website-cover.webp', slides:tusiCaseMedia.filter(item=>item.kind==='image').map(item=>item.src), year:'2026', color:'#F1EEE8', ink:'#111111' },
  { index:'02', title:'外滩黑客松大赛吐司端内设计', english:'Tusi Bund Hackathon', type:'MOBILE UI/UX · ACTIVITY DESIGN', description:'围绕活动信息与多元用户目标，探索吐司端内的活动页面与参与体验。', image:'/projects/tusi-hackathon/cover.webp', slides:['/projects/tusi-hackathon/01.webp','/projects/tusi-hackathon/02.webp','/projects/tusi-hackathon/03.webp','/projects/tusi-hackathon/04.webp','/projects/tusi-hackathon/05.webp'], year:'2026', color:'#18151E', ink:'#FFFFFF' },
  { index:'03', title:'吐司互动玩法探索', english:'Tusi Interaction Play', type:'INTERACTION DESIGN · PRODUCT EXPLORATION', description:'以脑洞集市与星选榜单连接创作前后的体验断点，探索从发现灵感、接招创作到获得投星与贴纸反馈的持续参与循环。', image:'/projects/tusi-interaction/cover.webp', slides:['/projects/tusi-interaction/01.webp','/projects/tusi-interaction/02.webp','/projects/tusi-interaction/03.webp','/projects/tusi-interaction/04.webp','/projects/tusi-interaction/05.webp','/projects/tusi-interaction/06.webp','/projects/tusi-interaction/07.webp','/projects/tusi-interaction/08.webp','/projects/tusi-interaction/09.webp'], year:'2026', color:'#0A0906', ink:'#FFFFFF' },
  { index:'04', title:'Ggrape 青提音乐APP视觉设计', english:'G·grape Music App', type:'PRODUCT DESIGN · UI/UX', description:'以情绪化视觉语言重新想象移动音乐体验，让界面本身成为听觉氛围的一部分。', image:'/figma/work-grape-card.jpg', slides:workSlides.grape, year:'2025', color:'#C7E52E', ink:'#111111' },
  { index:'05', title:'抖音「文字发布」功能体验升级项目', english:'Douyin 「Text Publishing」', type:'UX OPTIMIZATION · INTERACTION', description:'围绕表达门槛与创作效率，重新梳理文字发布链路与创作辅助体验。', image:'/figma/work-douyin-card.jpg', slides:workSlides.douyin, year:'2025', color:'#161616', ink:'#FFFFFF' },
  { index:'06', title:'「儒释道新说」虎溪三笑 IP形象设计', english:'Huxi Sanxiao', type:'VISUAL DESIGN · CULTURAL IP', description:'从地方文化典故出发，构建角色、视觉体系与可延展的文创产品体验。', image:'/figma/work-huxi-card.jpg', slides:workSlides.huxi, year:'2025', color:'#A53C2D', ink:'#FFFFFF' },
];

const otherWorks = [
  { index:'08', english:'Poster & Motion Archive', title:'海报与动态视觉设计', image:workSlides.poster[0], slides:workSlides.poster, type:'POSTER · MOTION DESIGN', year:'2021—2025', description:'以独立项目为单元，收录静态海报、系列视觉与动态海报练习。', color:'#15120E', ink:'#FFFFFF' },
  { index:'09', english:'Peach Power Family', title:'桃气能量团IP形象设计', image:workSlides.peach[0], slides:workSlides.peach, type:'IP DESIGN', year:'2026', description:'以年轻、轻松的角色语言构建桃气能量团的 IP 视觉形象与延展应用。', color:'#FF91AD', ink:'#2B1020' },
  { index:'10', english:'The Path of Beauty', title:'《美的历程》书籍装帧设计', image:workSlides.beauty[0], slides:workSlides.beauty, type:'EDITORIAL DESIGN', year:'2023', description:'围绕《美的历程》的文化脉络进行书籍视觉与阅读节奏设计。', color:'#7B211E', ink:'#FFFFFF' },
];

const extendedWorks = [
  { index:'07', title:'AI Skill 设计探索', english:'AI Skill Design Exploration', type:'AI PRODUCT · SKILL DESIGN · WORKFLOW', description:'以「扬华寻迹」与「吐司灵感封面」为双场景，探索如何将复杂信息与专业判断转化为稳定、可调用的 AI Skill。', image:'/projects/ai-skill/cover.jpg', slides:workSlides.aiSkill, year:'2026', color:'#250A05', ink:'#FFFFFF' },
];

const detailWorks = [...projects,...extendedWorks,...otherWorks];
const portfolioImageSources = Array.from(new Set([
  '/figma/about-redesign/readmore-hero.webp',
  ...detailWorks.map(work=>work.image),
  ...detailWorks.flatMap(work=>work.slides),
]));

function LazyLoopVideo({src,label}:{src:string;label:string}) {
  const videoRef=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const video=videoRef.current;
    if(!video)return;
    const observer=new IntersectionObserver(entries=>{
      const entry=entries[0];
      if(entry.isIntersecting){
        if(!video.src){
          video.src=src;
          video.load();
        }
      }else{
        video.pause();
      }
    },{rootMargin:'320px 0px',threshold:.01});
    observer.observe(video);
    return ()=>observer.disconnect();
  },[src]);
  return <video ref={videoRef} loop playsInline controls preload="none" aria-label={label}/>;
}

function PosterMotionGallery({onClose}:{onClose:()=>void}) {
  const [chapterIndex,setChapterIndex]=useState(0);
  const chapter=posterChapters[chapterIndex];
  return <section className="poster-exhibition detail-reveal" aria-label="海报与动态视觉设计画廊">
    <header className="detail-gallery-nav poster-exhibition-head">
      <span className="detail-gallery-brand">PUREGAN</span>
      <div className="detail-gallery-heading"><strong>POSTER &amp; MOTION ARCHIVE</strong><small>点击左侧作品名称以浏览</small></div>
      <span aria-hidden="true"/>
    </header>
    <nav className="poster-exhibition-index" aria-label="项目章节">
      {posterChapters.map((item,index)=><button className={index===chapterIndex?'is-active':''} type="button" onClick={()=>setChapterIndex(index)} key={item.id}><span>{String(index+1).padStart(2,'0')}</span><b>{item.title}</b></button>)}
    </nav>
    <div className={`poster-exhibition-stage media-count-${chapter.media.length}`} key={chapter.id}>
      <div className="poster-exhibition-viewer">
        <div className="poster-exhibition-media">
          {chapter.media.map(media=>media.kind==='image'?<figure style={{aspectRatio:`${media.width??1697}/${media.height??2400}`}} key={media.src}><Image src={media.src} width={media.width??1697} height={media.height??2400} unoptimized sizes={chapter.media.length>2?'24vw':'64vw'} alt={media.alt}/></figure>:<figure className="is-video" style={{aspectRatio:`${media.width??16}/${media.height??9}`}} key={media.src}><video src={media.src} poster={media.poster} loop playsInline controls preload="metadata" aria-label={media.alt}/></figure>)}
        </div>
        <div className="poster-exhibition-progress" aria-label="画廊进度">{posterChapters.map((item,index)=><button className={index===chapterIndex?'is-active':''} type="button" onClick={()=>setChapterIndex(index)} aria-label={`查看${item.title}`} key={item.id}/>)}</div>
      </div>
      <aside className="poster-exhibition-copy">
        <div><span>{chapter.category}</span><span>{chapter.year}</span></div>
        <h2>{chapter.title}</h2>
        {chapter.award&&<strong>{chapter.award}</strong>}
        <p>{chapter.description}</p>
      </aside>
    </div>
    <button className="poster-exhibition-close" type="button" onClick={onClose} aria-label="关闭海报与动态视觉设计画廊">×</button>
  </section>;
}

function DeferredCaseImage({src,width,height,alt,eager=false}:{src:string;width:number;height:number;alt:string;eager?:boolean}) {
  const hostRef=useRef<HTMLSpanElement>(null);
  const [shouldLoad,setShouldLoad]=useState(eager);
  useEffect(()=>{
    if(eager||shouldLoad)return;
    const host=hostRef.current;
    if(!host)return;
    const observer=new IntersectionObserver(entries=>{
      if(entries[0]?.isIntersecting){setShouldLoad(true);observer.disconnect()}
    },{rootMargin:'900px 0px',threshold:.01});
    observer.observe(host);
    return ()=>observer.disconnect();
  },[eager,shouldLoad]);
  return <span className="deferred-case-image" ref={hostRef}>{shouldLoad&&<Image src={src} width={width} height={height} sizes="(max-width: 1920px) 100vw, 1920px" priority={eager} unoptimized alt={alt}/>}</span>;
}

function DeferredSlideImage({src,alt,eager=false,enabled=true,onLoad}:{src:string;alt:string;eager?:boolean;enabled?:boolean;onLoad?:()=>void}) {
  const hostRef=useRef<HTMLSpanElement>(null);
  const [shouldLoad,setShouldLoad]=useState(eager&&enabled);
  useEffect(()=>{
    if(!enabled||eager||shouldLoad)return;
    const host=hostRef.current;
    if(!host)return;
    const observer=new IntersectionObserver(entries=>{
      if(entries[0]?.isIntersecting){setShouldLoad(true);observer.disconnect()}
    },{rootMargin:'0px 120px',threshold:.01});
    observer.observe(host);
    return ()=>observer.disconnect();
  },[eager,enabled,shouldLoad]);
  return <span className="deferred-slide-image" ref={hostRef}>{shouldLoad&&<Image src={src} fill sizes="82vw" priority={eager} fetchPriority={eager?'high':'auto'} onLoad={onLoad} unoptimized style={{objectFit:'contain'}} alt={alt}/>}</span>;
}

function MarvisDemoSlide({src,alt}:{src:string;alt:string}) {
  const hostRef=useRef<HTMLDivElement>(null);
  const videoRefs=useRef<Array<HTMLVideoElement|null>>([]);
  const [active,setActive]=useState(false);
  useEffect(()=>{
    const host=hostRef.current;
    if(!host)return;
    const observer=new IntersectionObserver(entries=>{
      const visible=Boolean(entries[0]?.isIntersecting);
      setActive(visible);
      videoRefs.current.forEach(video=>{
        if(!video)return;
        if(visible)void video.play().catch(()=>undefined);
        else{video.pause();video.classList.remove('is-ready')}
      });
    },{rootMargin:'160px 0px',threshold:.04});
    observer.observe(host);
    return ()=>observer.disconnect();
  },[]);
  return <div className="marvis-demo-slide" ref={hostRef}>
    <Image src={src} fill sizes="82vw" unoptimized style={{objectFit:'contain'}} alt={alt}/>
    {marvisDemoVideos.map((video,index)=><video
      className={`marvis-phone-video phone-${index+1}`}
      ref={node=>{videoRefs.current[index]=node}}
      src={active?video:undefined}
      autoPlay
      muted
      loop
      playsInline
      preload={active?'auto':'none'}
      onCanPlay={event=>event.currentTarget.classList.add('is-ready')}
      aria-label={`Marvis 扬华寻迹功能录屏 ${index+1}`}
      key={video}
    />)}
  </div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWorkIndex, setActiveWorkIndex] = useState<number | null>(null);
  const [detailMotion, setDetailMotion] = useState<'opening'|'open'|'closing'>('opening');
  const [detailOrigin, setDetailOrigin] = useState({left:0,top:0,width:0,height:0,radius:24});
  const [aboutDetailsOpen, setAboutDetailsOpen] = useState(false);
  const [helloActive, setHelloActive] = useState(false);
  const [helloPhase, setHelloPhase] = useState<'idle'|'enter'|'exit'>('idle');
  const helloText = 'HELLO THERE,';
  const detailTrackRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const aboutDetailsRef = useRef<HTMLDivElement>(null);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const [detailFirstReady,setDetailFirstReady] = useState(false);
  const [workTheme, setWorkTheme] = useState(false);
  const [workEnding, setWorkEnding] = useState(false);
  const [hoveredWorkIndex, setHoveredWorkIndex] = useState<string | null>(null);
  const [previewReadyIndex, setPreviewReadyIndex] = useState<string | null>(null);
  const workHoverTimerRef = useRef<number | null>(null);
  const detailTargetRef = useRef(0);
  const detailFrameRef = useRef(0);
  const detailDragRef = useRef<{pointerId:number;x:number;left:number}|null>(null);
  const detailMotionTimerRef = useRef<number | null>(null);
  const activeWork = activeWorkIndex===null?null:detailWorks[activeWorkIndex];
  const isVerticalCase=Boolean(activeWork&&verticalCaseIndexes.has(activeWork.index));
  const isCenteredSingle=Boolean(activeWork&&centeredSingleWorkIndexes.has(activeWork.index));
  const isPosterExhibition=activeWork?.index==='08';
  const captureCardOrigin = (card:HTMLElement)=>{
    const rect=card.getBoundingClientRect();
    const radius=Number.parseFloat(window.getComputedStyle(card).borderRadius)||24;
    setDetailOrigin({left:rect.left,top:rect.top,width:rect.width,height:rect.height,radius});
  };
  const openWork = (index:string,event?:ReactMouseEvent<HTMLButtonElement>)=>{
    const nextIndex=detailWorks.findIndex(work=>work.index===index);
    if(nextIndex<0)return;
    setDetailFirstReady(false);
    const firstSlide=detailWorks[nextIndex].slides[0];
    if(firstSlide){const image=new window.Image();image.fetchPriority='high';image.src=firstSlide}
    const card=event?.currentTarget??document.querySelector<HTMLElement>(`.project-card-stack[data-work-index="${index}"]`);
    if(card)captureCardOrigin(card);
    setDetailMotion('opening');
    setActiveWorkIndex(nextIndex);
  };
  const closeWork = ()=>{
    if(activeWorkIndex===null||detailMotion==='closing')return;
    setDetailMotion('closing');
    if(detailMotionTimerRef.current)window.clearTimeout(detailMotionTimerRef.current);
    detailMotionTimerRef.current=window.setTimeout(()=>{
      setActiveWorkIndex(null);
      setDetailMotion('opening');
    },720);
  };
  const showAdjacentWork = (direction:number)=>{
    setDetailFirstReady(false);
    setActiveWorkIndex(current=>{
      if(current===null)return null;
      const next=(current+direction+detailWorks.length)%detailWorks.length;
      const nextWork=detailWorks[next];
      const card=document.querySelector<HTMLElement>(`.project-card-stack[data-work-index="${nextWork.index}"]`);
      if(card)captureCardOrigin(card);
      const firstSlide=nextWork.slides[0];
      if(firstSlide){const image=new window.Image();image.fetchPriority='high';image.src=firstSlide}
      return next;
    });
  };

  useEffect(()=>{
    let cancelled=false;
    let startTimer=0;
    const preload=(src:string,priority:'high'|'low'='low')=>new Promise<void>(resolve=>{
      const image=new window.Image();
      image.decoding='async';
      image.fetchPriority=priority;
      image.onload=image.onerror=()=>resolve();
      image.src=src;
    });
    const criticalSources=['/figma/about-redesign/readmore-hero.webp',...detailWorks.map(work=>work.image)];
    criticalSources.forEach(src=>void preload(src,'high'));
    const backgroundSources=portfolioImageSources.filter(src=>!criticalSources.includes(src));
    let cursor=0;
    const worker=async()=>{
      while(!cancelled&&cursor<backgroundSources.length){
        const src=backgroundSources[cursor++];
        await preload(src);
        await new Promise<void>(resolve=>window.setTimeout(resolve,80));
      }
    };
    const begin=()=>{startTimer=window.setTimeout(()=>{void Promise.all([worker(),worker(),worker()])},500)};
    if(document.readyState==='complete')begin();
    else window.addEventListener('load',begin,{once:true});
    return ()=>{cancelled=true;window.clearTimeout(startTimer);window.removeEventListener('load',begin)};
  },[]);
  const syncHorizontalSlides=(track:HTMLDivElement)=>{
    const trackCenter=track.scrollLeft+track.clientWidth/2;
    const range=Math.max(track.clientWidth*.68,1);
    track.querySelectorAll<HTMLElement>('.detail-slide').forEach(slide=>{
      const slideCenter=slide.offsetLeft+slide.offsetWidth/2;
      const distance=Math.min(1,Math.abs(slideCenter-trackCenter)/range);
      slide.style.setProperty('--slide-scale',String(1-distance*.055));
      slide.style.setProperty('--slide-opacity',String(1-distance*.42));
    });
  };
  const moveDetail = (event:WheelEvent<HTMLDivElement>)=>{
    event.preventDefault();
    const track=event.currentTarget;
    const max=Math.max(0,track.scrollWidth-track.clientWidth);
    const wheelDelta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
    const step=Math.max(-240,Math.min(240,wheelDelta*.95));
    detailTargetRef.current=Math.max(0,Math.min(max,detailTargetRef.current+step));
    if(detailFrameRef.current)return;
    const glide=()=>{
      const distance=detailTargetRef.current-track.scrollLeft;
      track.scrollLeft+=distance*.105;
      syncHorizontalSlides(track);
      if(Math.abs(distance)>.4)detailFrameRef.current=window.requestAnimationFrame(glide);
      else{track.scrollLeft=detailTargetRef.current;syncHorizontalSlides(track);detailFrameRef.current=0}
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
    syncHorizontalSlides(track);
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
    const skillLines=Array.from(section.querySelectorAll<HTMLElement>('.work-capabilities h2 span'));
    let frame=0;
    let targetTimeline=0;
    let currentTimeline=0;
    let initialized=false;
    let lastFrame=performance.now();
    let ending=false;
    const clamp=(value:number)=>Math.max(0,Math.min(1,value));
    const smooth=(start:number,end:number,value:number)=>{
      const t=clamp((value-start)/(end-start));
      return t*t*(3-2*t);
    };
    const mix=(from:number,to:number,value:number)=>from+(to-from)*value;
    const calculateTarget=()=>{
      const rect=section.getBoundingClientRect();
      const travel=Math.max(1,section.offsetHeight-window.innerHeight);
      const progress=Math.max(0,Math.min(1,-rect.top/travel));
      targetTimeline=progress*totalDuration;
    };
    const applyTimeline=(timeline:number)=>{
      // Keep a three-card composition on screen: the previous card exits on
      // the left while the current card lingers in the centre and the next
      // card enters from the right.
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
      if(stage){
        const outro=smooth(lastCardEnd-.12,lastCardEnd+.36,timeline);
        const capabilities=smooth(lastCardEnd-.18,lastCardEnd+.58,timeline);
        stage.style.setProperty('--project-opacity',(1-outro).toFixed(3));
        stage.style.setProperty('--project-y',`${-outro*19}vh`);
        stage.style.setProperty('--capabilities-reveal',capabilities.toFixed(4));
        stage.style.setProperty('--work-chrome-opacity',(1-smooth(lastCardEnd+.02,lastCardEnd+.58,timeline)).toFixed(3));
        skillLines.forEach((line,index)=>{
          const reveal=smooth(lastCardEnd+.02+index*.065,lastCardEnd+.38+index*.065,timeline);
          line.style.setProperty('--skill-opacity',reveal.toFixed(3));
          line.style.setProperty('--skill-y',`${mix(62,0,reveal)}px`);
        });
        const nextEnding=capabilities>.72;
        if(nextEnding!==ending){ending=nextEnding;setWorkEnding(nextEnding)}
      }
    };
    const cardGap=.8;
    const cardDuration=3.3;
    const introDuration=.72;
    const lastCardEnd=introDuration+(cards.length-1)*cardGap+cardDuration;
    const totalDuration=lastCardEnd+1.05;
    const render=(now:number)=>{
      frame=0;
      const elapsed=Math.min(64,now-lastFrame);
      lastFrame=now;
      const follow=1-Math.exp(-elapsed/125);
      currentTimeline+=((targetTimeline-currentTimeline)*follow);
      if(Math.abs(targetTimeline-currentTimeline)<.0005)currentTimeline=targetTimeline;
      applyTimeline(currentTimeline);
      if(Math.abs(targetTimeline-currentTimeline)>.0005)frame=window.requestAnimationFrame(render);
    };
    const request=()=>{
      calculateTarget();
      if(!initialized){currentTimeline=targetTimeline;initialized=true;applyTimeline(currentTimeline)}
      else if(!frame){lastFrame=performance.now();frame=window.requestAnimationFrame(render)}
    };
    request();
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
    verticalScrollRef.current?.scrollTo({top:0,behavior:'auto'});
    let secondFrame=0;
    const firstFrame=window.requestAnimationFrame(()=>{
      if(detailTrackRef.current)syncHorizontalSlides(detailTrackRef.current);
      secondFrame=window.requestAnimationFrame(()=>setDetailMotion(current=>current==='opening'?'open':current));
    });
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')closeWork()};
    window.addEventListener('keydown',onKeyDown);
    return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKeyDown);window.cancelAnimationFrame(firstFrame);if(secondFrame)window.cancelAnimationFrame(secondFrame);if(detailMotionTimerRef.current)window.clearTimeout(detailMotionTimerRef.current);if(detailFrameRef.current)window.cancelAnimationFrame(detailFrameRef.current);detailFrameRef.current=0};
  },[activeWorkIndex]);
  useEffect(()=>{
    if(!aboutDetailsOpen)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    aboutDetailsRef.current?.scrollTo({top:0,behavior:'auto'});
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')setAboutDetailsOpen(false)};
    const root=aboutDetailsRef.current;
    const targets=Array.from(root?.querySelectorAll<HTMLElement>('[data-about-reveal]')??[]);
    if(!('IntersectionObserver' in window))targets.forEach(target=>target.classList.add('is-visible'));
    const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer?.unobserve(entry.target)}
    }),{root,threshold:.1,rootMargin:'0px 0px -8% 0px'}):null;
    targets.forEach(target=>observer?.observe(target));
    window.addEventListener('keydown',onKeyDown);
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKeyDown);observer?.disconnect()};
  },[aboutDetailsOpen]);
  useEffect(()=>{
    if (!('IntersectionObserver' in window)) {setHelloActive(true);return}
    const sections = document.querySelectorAll<HTMLElement>('.figma-about');
    sections.forEach(section=>section.classList.add('motion-ready'));
    const sectionObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (entry.isIntersecting) {entry.target.classList.add('entered');setHelloActive(true);sectionObserver.unobserve(entry.target)}
    }),{threshold:.16,rootMargin:'0px 0px -10% 0px'});
    sections.forEach(section=>sectionObserver.observe(section));
    return ()=>{sectionObserver.disconnect();sections.forEach(section=>section.classList.remove('motion-ready'))};
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
    { label:'CONTACT', href:'#contact' },
  ];
  return <main>
    <section className="cover" id="top">
      <nav className={`cover-nav ${workTheme?'work-theme':''} ${workEnding?'capabilities-theme':''}`}>
        <a className="cover-logo" href="#top">PUREGAN</a>
        <div className="cover-links"><GooeyNav items={navItems} particleCount={15} particleDistances={[90,10]} particleR={100} initialActiveIndex={-1} animationTime={600} timeVariance={300} colors={[1,2,3,1,2,3,1,4]}/></div>
        <button className="cover-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="打开导航">{menuOpen?'CLOSE':'MENU'}</button>
      </nav>
      {menuOpen&&<div className="mobile-menu"><a href="#about" onClick={()=>setMenuOpen(false)}>ABOUT</a><a href="#work" onClick={()=>setMenuOpen(false)}>WORK</a><a href="#contact" onClick={()=>setMenuOpen(false)}>CONTACT</a></div>}
      <div className="cover-stage">
        <div className="cover-portrait" onPointerMove={trackHero} onPointerLeave={leaveHero}><Image src="/figma/hero-v2.webp" fill priority sizes="124vw" alt="甘普尔黑白肖像拼贴" /><span className="hero-crosshair" aria-hidden="true"/></div>
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

    <section className="figma-about about-redesign" id="about">
      <h2 className={`hello-title hello-${helloPhase}`} aria-label={helloText}>{Array.from(helloText).map((letter,index)=><span className="hello-char" aria-hidden="true" key={`${letter}-${index}`} style={{'--hello-in-delay':`${index*68}ms`,'--hello-out-delay':`${(helloText.length-1-index)*68}ms`} as CSSProperties}>{letter===' '? '\u00A0':letter}</span>)}</h2>
      <div className="about-collage"><Image src="/figma/about-redesign/about-main.webp" fill sizes="(max-width: 760px) 88vw, 42vw" alt="Puregan 的 About Me 拼贴肖像" priority={false}/></div>
      <Image className="about-emoji about-thought" src="/figma/about-redesign/thought-balloon.png" width={181} height={181} alt="思考气泡"/>
      <Image className="about-emoji about-crystal" src="/figma/about-redesign/crystal-ball.png" width={161} height={161} alt="水晶球"/>
      <Image className="about-emoji about-cat" src="/figma/about-redesign/black-cat.png" width={104} height={104} alt="黑猫"/>
      <div className="about-summary">
        <div className="about-name"><Image src="/figma/about-redesign/artist-emoji.png" width={32} height={32} alt=""/><b>Puregan</b><span>甘普尔</span></div>
        <i aria-hidden="true"/>
        <div><p>我是INTJ-A 射手座，兼具理性与感性，也不乏天马行空的想象力——擅长以视觉设计提升用户体验，注重细节，随和好沟通，自驱力强。热爱设计行业，乐于突破职能边界，从长期价值的角度思考设计，并持续探索 AIGC 在设计中的应用。</p><button type="button" onClick={()=>setAboutDetailsOpen(true)}>Read More<span>↗</span></button></div>
      </div>
    </section>

    {aboutDetailsOpen&&<div className="about-details" ref={aboutDetailsRef} role="dialog" aria-modal="true" aria-label="Puregan 个人经历详情">
      <button className="about-details-close" type="button" onClick={()=>setAboutDetailsOpen(false)} aria-label="关闭个人经历详情">CLOSE</button>
      <section className="about-details-hero">
        <Image src="/figma/about-redesign/readmore-hero.webp" fill priority unoptimized sizes="100vw" alt="Puregan 个人肖像"/>
        <div className="about-details-gradient" aria-hidden="true"/>
        <div className="about-details-title"><h2>Puregan</h2><div><b>Visual &amp; User Experience Designer</b><span>2026</span></div></div>
        <time>（2001.12.01）</time>
      </section>
      <section className="about-resume">
        <article className="about-resume-section" data-about-reveal><h3>Education</h3><div className="about-resume-list">
          <div><time>2024.09 – Now</time><div><b>西南交通大学（211、双一流）</b><p>设计（视觉传达设计） 研三在读</p></div></div>
          <div><time>2019.09 – 2023.06</time><div><b>九江学院</b><p>视觉传达设计 学士学位</p></div></div>
        </div></article>
        <article className="about-resume-section" data-about-reveal><h3>Internship</h3><div className="about-resume-list">
          <div><time>2026.04 – 2026.08</time><div><Image className="tencent-logo" src="/figma/about-redesign/tencent-logo.png" width={153} height={46} alt="Tencent 腾讯"/><p>在腾讯 PCG 商业产品部担任视觉设计实习生，参与「吐司」产品及业务项目的视觉/UI 设计，覆盖 Web 与移动端场景；协同产品、研发推进方案落地，并探索 AI 在设计生产与工作流提效中的应用。</p></div></div>
        </div></article>
        <article className="about-resume-section" data-about-reveal><h3>Project</h3><div className="about-resume-list">
          <div><time>2022.09 – 2023.06</time><div><b>九江市博物馆文创产品开发项目</b><p>针对九江博物馆文创“数量少、设计弱、缺文化底蕴”痛点，提取本土典故文化元素进行改良设计，让历史故事以实用文创形式融入日常。作品获校优秀毕业设计留校收藏，获 2 项国家级、4 项省级竞赛奖项，相关论文见刊于《地方大学应用型教育研究》。</p></div></div>
          <div><time>2022.10 – 2023.03</time><div><b>庐山八月咖啡设计项目</b><p>该项目以独立咖啡馆品牌升级为核心，探索小众场景视觉符号构建，历时半年独立完成需求访谈、调研分析及 VI 落地设计。方案获店铺采纳落地，成果入选校级优秀设计作品集，验证商业与设计美学的融合价值。</p></div></div>
        </div></article>
        <article className="about-resume-section" data-about-reveal><h3>Rewards</h3><div className="about-rewards-list">
          <b>三好学生 / 优秀学生干部 / 优秀团干部</b><b>2023届校优秀本科毕业论文（设计）</b><p><strong>校级专业奖学金</strong><span>一等 ×3 / 二等 ×1 / 三等 ×2</span></p><p><strong>2025米兰设计周中国高校设计学科师生优秀作品展</strong><span>省一等奖</span></p><p><strong>第十届未来设计师·全国高校数字艺术设计大赛</strong><span>全国优秀奖 / 省一等奖</span></p><p><strong>第十一届未来设计师·全国高校数字艺术设计大赛</strong><span>省一等奖</span></p><p><strong>第十一届全国大学生数字媒体科技作品及创意竞赛</strong><span>全国三等奖 / 省二等奖</span></p><p><strong>第四届东方创意之星设计大赛</strong><span>全国优秀奖 / 省金奖</span></p><p><strong>2023 “井冈之星” 设计艺术创意大赛</strong><span>学生组金奖</span></p><p><strong>全国大中学生海洋文化创意设计大赛</strong><span>佳作奖</span></p><p><strong>全国高等教育美育教育成果展评</strong><span>学生组一等奖</span></p><p><strong>新生录取通知书设计活动</strong><span>二等奖</span></p>
        </div></article>
        <article className="about-resume-section about-resume-compact" data-about-reveal><h3>Language</h3><p><b>全国大学英语考试</b><span>英语六级 CET-6</span></p></article>
        <article className="about-resume-section about-resume-contact" data-about-reveal><h3>Contact</h3><div><a href="tel:13036575690"><Image src="/figma/about-redesign/phone.svg" width={28} height={28} alt=""/>13036575690</a><a href="mailto:812544883@qq.com"><Image src="/figma/about-redesign/email.svg" width={28} height={28} alt=""/>812544883@qq.com</a><span><Image src="/figma/about-redesign/wechat.svg" width={28} height={28} alt=""/>B1ackcat_Witch</span></div></article>
      </section>
    </div>}

    <section className="work work-cards" id="work" ref={showcaseRef} style={{'--project-count':detailWorks.length} as CSSProperties}>
      <div className="card-stage">
        <p className="work-manifesto">AESTHETICS = JUDGMENT + INTUITION</p>
        <div className="card-background" aria-hidden="true">PROJECTS</div>
        <div className="project-card-deck" aria-label="全部作品目录">{detailWorks.map((p,index)=><button className={`project-card-stack${activeWork?.index===p.index?' is-transition-source':''}`} data-work-index={p.index} type="button" onClick={event=>openWork(p.index,event)} key={p.index} aria-label={`查看${p.title}项目详情`}>
          <figure><Image src={p.image} fill sizes="(max-width: 760px) 78vw, 34vw" priority={index<3} loading={index<3?undefined:'lazy'} unoptimized alt={`${p.title}项目封面`}/></figure>
          <div className="project-card-copy"><span>({String(index+1).padStart(2,'0')})</span><h3 className={p.english.startsWith('「')?'bracket-leading':undefined}>{p.english}</h3><h4>{p.title}</h4><div className="project-card-notes"><em>{p.type.split(' · ')[0]}</em><b aria-hidden="true"/><p>{p.description}</p></div><i>↗</i></div>
        </button>)}</div>
        <p className="work-selected">SELECTED WORKS<br/>2021—2026</p>
        <div className="work-capabilities" aria-label="设计能力">
          <p>DESIGN PRACTICE / 2026</p>
          <h2><span>VISUAL DESIGN</span><span>USER EXPERIENCE</span><span>INTERACTION DESIGN</span><span>VIBE CODING</span><span>AI EXPLORATION</span></h2>
          <small>VISUAL THINKING · DIGITAL EXPERIENCE · CREATIVE TECHNOLOGY</small>
        </div>
      </div>
    </section>
    {activeWork&&<div className={`project-detail detail-motion-${detailMotion}${isVerticalCase?' is-vertical-case':''}`} role="dialog" aria-modal="true" aria-label={`${activeWork.title}项目详情`} style={{'--case-bg':activeWork.color,'--case-ink':activeWork.ink,'--origin-left':`${detailOrigin.left}px`,'--origin-top':`${detailOrigin.top}px`,'--origin-width':`${detailOrigin.width}px`,'--origin-height':`${detailOrigin.height}px`,'--origin-radius':`${detailOrigin.radius}px`} as CSSProperties}>
      <div className="detail-backdrop" aria-hidden="true"/>
      <div className="detail-card-morph" aria-hidden="true">
        <figure><Image src={activeWork.image} fill sizes="40vw" priority unoptimized alt=""/></figure>
        <div><span>({activeWork.index})</span><h3 className={activeWork.english.startsWith('「')?'bracket-leading':undefined}>{activeWork.english}</h3><h4>{activeWork.title}</h4></div>
      </div>
      {isPosterExhibition?<PosterMotionGallery onClose={closeWork}/>:isVerticalCase?<>
        <div className="tusi-case-scroll detail-reveal" ref={verticalScrollRef}>
          <main className="tusi-case-stack">
            {activeWork.index==='01'?tusiCaseMedia.map((media,index)=>media.kind==='image'?<figure className="tusi-case-media" style={{aspectRatio:`${media.width}/${media.height}`}} key={media.src}>
              <DeferredCaseImage src={media.src} width={media.width} height={media.height} eager={index===0} alt={media.alt}/>
            </figure>:<figure className={`tusi-case-media tusi-case-video${index===tusiCaseMedia.length-1?' is-final':''}`} key={media.src}>
              <LazyLoopVideo src={media.src} label={media.label}/>
            </figure>):<>
              {activeWork.slides.map((slide,index)=>{const dimensions=verticalSlideDimensions[slide]??{width:1600,height:900};return <figure className="tusi-case-media tusi-series-slide" style={{aspectRatio:`${dimensions.width}/${dimensions.height}`}} key={slide}><DeferredCaseImage src={slide} width={dimensions.width} height={dimensions.height} eager={index===0} alt={`${activeWork.title}设计展示第${index+1}页`}/></figure>})}
            </>}
          </main>
        </div>
        <aside className="vertical-case-signature detail-reveal" aria-label={`当前项目：${activeWork.title}`}><span>{activeWork.title}</span></aside>
      </>:<>
        <header className="detail-gallery-nav detail-reveal">
          <span className="detail-gallery-brand">PUREGAN</span>
          <div className="detail-gallery-heading">
            <strong className={activeWork.english.startsWith('「')?'bracket-leading':undefined}>{activeWork.english}</strong>
            <small>滚动 / 拖动以浏览</small>
          </div>
          <span aria-hidden="true"/>
        </header>
        <div className={`detail-track detail-reveal${isCenteredSingle?' is-centered-single':''}`} ref={detailTrackRef} onScroll={event=>syncHorizontalSlides(event.currentTarget)} onWheel={moveDetail} onPointerDown={beginDetailDrag} onPointerMove={dragDetail} onPointerUp={endDetailDrag} onPointerCancel={endDetailDrag}>
          {activeWork.slides.map((slide,index)=><figure className={`detail-slide${activeWork.index==='07'&&index===6?' has-marvis-video':''}`} key={slide}>{activeWork.index==='07'&&index===6?<MarvisDemoSlide src={slide} alt={`${activeWork.title}设计展示第${index+1}页（动态演示）`}/>:<DeferredSlideImage src={slide} eager={index===0} enabled={index===0||detailFirstReady} onLoad={index===0?()=>setDetailFirstReady(true):undefined} alt={`${activeWork.title}设计展示第${index+1}页`}/>}</figure>)}
        </div>
        <aside className="detail-gallery-meta detail-reveal"><span>PROJECT {activeWork.index}</span><h3>{activeWork.title}</h3><p>{activeWork.description}</p><dl><div><dt>YEAR</dt><dd>{activeWork.year}</dd></div><div><dt>TYPE</dt><dd>{activeWork.type}</dd></div></dl></aside>
        <div className="detail-gallery-switch detail-reveal"><button type="button" onClick={()=>showAdjacentWork(-1)}>← PREV</button><button type="button" onClick={()=>showAdjacentWork(1)}>NEXT →</button></div>
      </>}
      {!isPosterExhibition&&<button className="detail-unified-close detail-reveal" type="button" onClick={closeWork} aria-label="关闭项目详情">×</button>}
    </div>}
    <footer className="contact-screen" id="contact">
      <SideRays className="contact-rays" rayColor1="#A855F7" rayColor2="#94A3B8" speed={1.35} intensity={2.75} spread={2.45} origin="top-right" tilt={-9} saturation={1.5} blend={0.58} falloff={1.32} opacity={1}/>
      <div className="contact-shade" aria-hidden="true"/>
      <div className="contact-topline"><p>WANT TO WORK<br/>TOGETHER?</p><p>SEND ME A<br/>MESSAGE</p></div>
      <div className="contact-main">
        <p>FEEL FREE TO CONNECT WITH ME</p>
        <a className="contact-email" href="mailto:812544883@qq.com" aria-label="发送邮件至 812544883@qq.com"><span>812544883@</span><span>qq.com</span></a>
      </div>
      <div className="contact-bottomline"><p>PUREGAN 甘普尔</p><a href="mailto:812544883@qq.com">EMAIL ME ↗</a><small>2026</small></div>
    </footer>
  </main>;
}
