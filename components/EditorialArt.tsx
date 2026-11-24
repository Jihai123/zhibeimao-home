import { useId } from 'react';

// Neutral editorial illustrations, not screenshots or vendor marks.
export function EditorialArt({title}:{title:string}) {
  const id=useId();
  const kind=/代码|编程|Cursor|Codex|开发|SQLite|CLI/i.test(title)?'code':/健康|医疗|医学/i.test(title)?'health':/评论|回复|Slack|团队|协作|社区|机器人/i.test(title)?'chat':/模型|GLM|GPT|Gemini|Claude|参数/i.test(title)?'model':'network';
  const colors={code:['#111b40','#536ef0','#70e8ff'],health:['#092f35','#158a8d','#91f5d4'],chat:['#25134c','#7b55d5','#f0b0ff'],model:['#142745','#197dbe','#9aeaff'],network:['#171c3e','#4455b8','#a4b7ff']}[kind];
  const bg=id+'bg',light=id+'light',grid=id+'grid';
  return <svg className="zbm-editorial-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1"><stop stopColor={colors[0]}/><stop offset="1" stopColor={colors[1]}/></linearGradient>
      <radialGradient id={light}><stop stopColor={colors[2]} stopOpacity=".65"/><stop offset="1" stopColor={colors[2]} stopOpacity="0"/></radialGradient>
      <pattern id={grid} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity=".1"/></pattern>
    </defs>
    <rect width="320" height="180" fill={'url(#'+bg+')'}/><rect width="320" height="180" fill={'url(#'+grid+')'}/>
    <ellipse cx="178" cy="88" rx="145" ry="100" fill={'url(#'+light+')'}/>
    <g fill="none" stroke={colors[2]} opacity=".38"><ellipse cx="160" cy="90" rx="116" ry="55" transform="rotate(-22 160 90)"/><ellipse cx="160" cy="90" rx="125" ry="48" transform="rotate(25 160 90)"/><circle cx="160" cy="90" r="74" strokeDasharray="3 8"/></g>
    {kind==='code'?<g transform="translate(71 38)">
      <rect width="178" height="105" rx="14" fill="#071426" fillOpacity=".85" stroke={colors[2]} strokeOpacity=".8"/><path d="M0 25H178" stroke={colors[2]} strokeOpacity=".4"/><g fill={colors[2]}><circle cx="15" cy="13" r="3"/><circle cx="26" cy="13" r="3" opacity=".6"/><circle cx="37" cy="13" r="3" opacity=".3"/></g><path d="M63 43L44 63 63 83M115 43L134 63 115 83M100 39L79 87" stroke={colors[2]} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>:kind==='chat'?<g transform="translate(63 36)" stroke={colors[2]} strokeWidth="1.5">
      <path d="M12 0H117Q130 0 130 13V58Q130 71 117 71H58L33 90V71H12Q0 71 0 58V13Q0 0 12 0Z" fill="#171333" fillOpacity=".88"/>
      <path d="M103 50H179Q192 50 192 63V101Q192 114 179 114H165V131L140 114H103Q90 114 90 101V63Q90 50 103 50Z" fill={colors[1]}/>
      <g fill={colors[2]} stroke="none"><circle cx="39" cy="35" r="5"/><circle cx="65" cy="35" r="5"/><circle cx="91" cy="35" r="5"/><path d="M111 71h59v5h-59zM111 87h39v5h-39z"/></g>
    </g>:kind==='health'?<g transform="translate(160 88)">
      <circle r="54" fill="#09252f" fillOpacity=".85" stroke={colors[2]} strokeWidth="2"/><path d="M-12-31H12V-12H31V12H12V31H-12V12H-31V-12H-12Z" fill={colors[2]} opacity=".85"/><path d="M-112 58H-63l12-13 13 23 17-41 18 31h115" fill="none" stroke="#c9fff3" strokeWidth="2" strokeLinecap="round"/>
    </g>:kind==='model'?<g transform="translate(160 90)">
      {[-36,-18,0,18,36].map(p=><g key={p} stroke={colors[2]} strokeWidth="2" opacity=".8"><path d={'M'+p+' -47v-15M'+p+' 47v15M-47 '+p+'h-15M47 '+p+'h15'}/></g>)}<rect x="-47" y="-47" width="94" height="94" rx="13" fill="#0c1d37" stroke={colors[2]} strokeWidth="2"/><rect x="-32" y="-32" width="64" height="64" rx="7" fill={colors[1]} stroke={colors[2]}/><path d="M-20 17L0-19 20 17M-12 3H12" fill="none" stroke="#eaffff" strokeWidth="4" strokeLinecap="round"/>
    </g>:<g stroke={colors[2]} strokeWidth="1.7" fill={colors[2]}>{[[74,60],[111,124],[160,90],[203,45],[244,116],[262,65]].map(([x,y],i)=><g key={i}><path d={'M160 90L'+x+' '+y} opacity=".65"/><circle cx={x} cy={y} r={i===2?15:7}/></g>)}</g>}
    <g fill="#fff" opacity=".5"><circle cx="38" cy="42" r="2"/><circle cx="281" cy="25" r="2"/><circle cx="48" cy="148" r="2"/><circle cx="280" cy="150" r="2"/></g>
  </svg>;
}
