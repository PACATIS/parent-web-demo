export const ANCHOR = new Date("2026-09-08T12:00:00");
const isoDaysAgo=(n,h=12,m=0)=>{const d=new Date(ANCHOR);d.setDate(d.getDate()-n);d.setHours(h,m,0,0);return d.toISOString()};
const crisis=(id,daysAgo,h,context,antecedents,severity,duration,resolution,interventions,notes="")=>({id,timestamp:isoDaysAgo(daysAgo,h),context,antecedents,severity,duration,resolution,interventions,notes});

const seedCrises=[
crisis("c1",56,7,"Morning routine",["No fidget available","Change of routine"],"severe",45,"dissipated",[
["Placed in room alone","didNotWork",0],["Verbal reassurance up close","didNotWork",0],["Offered fidget","partiallyWorked",20]]),
crisis("c2",54,12,"After lunch",["No fidget available","Hunger"],"moderate",30,"worked",[
["Placed in room alone","didNotWork",0],["Offered fidget","partiallyWorked",15]]),
crisis("c3",52,16,"Supermarket",["Crowded space","Loud noise"],"severe",50,"dissipated",[
["Left the shop immediately","partiallyWorked",20],["Headset","partiallyWorked",15]]),
crisis("c4",50,8,"Getting ready for school",["Change of routine","Transition without warning"],"moderate",35,"worked",[
["Placed in room alone","didNotWork",0],["Visual timer 10 minutes before","partiallyWorked",10]]),
crisis("c5",48,19,"Bedtime",["Fatigue","Change of routine"],"moderate",25,"dissipated",[
["Dimmed lights and left the room","partiallyWorked",15]]),
crisis("c6",45,11,"Homework",["Loud noise"],"mild",15,"dissipated",[
["Headset and fidget","partiallyWorked",10]]),
crisis("c7",43,7,"Morning routine",["No fidget available"],"moderate",30,"worked",[
["Offered fidget","worked",10]],"Fidget was left at school."),
crisis("c8",40,17,"Family visit",["Unannounced body contact","Crowded space"],"severe",40,"worked",[
["Moved to a quiet room","partiallyWorked",20],["Art utensils in the quiet room","worked",10]]),
crisis("c9",37,13,"After lunch",["No fidget available"],"mild",20,"dissipated",[
["Headset and fidget","partiallyWorked",10]]),
crisis("c10",33,8,"Getting ready for school",["Transition without warning","Fatigue"],"moderate",25,"worked",[
["Visual timer 10 minutes before","worked",10]],"First day of her period."),
crisis("c11",32,12,"After lunch",["Fatigue","Loud noise"],"mild",14,"worked",[
["Headset","worked",8]]),
crisis("c12",30,15,"Park outing",["Loud noise"],"mild",15,"worked",[
["Headset","worked",5]]),
crisis("c13",26,13,"After lunch",["Change of routine"],"mild",15,"worked",[
["Art utensils in the quiet room","worked",10]]),
crisis("c14",19,7,"Morning routine",["No fidget available"],"mild",10,"worked",[
["Fidget offered at first cue","worked",5]],"Caught at the hand-fidgeting stage."),
crisis("c15",12,18,"Bath time",["Change of routine","Fatigue"],"moderate",20,"worked",[
["Visual timer 10 minutes before","partiallyWorked",10],["Art utensils in the quiet room","worked",10]]),
crisis("c16",5,16,"Homework",["Loud noise","Fatigue"],"mild",12,"worked",[
["Headset","worked",5]]),
crisis("c17",4,7,"Morning routine",["Fatigue","No fidget available"],"mild",10,"worked",[
["Fidget offered at first cue","worked",5]]),
];

const interventions=(arr)=>arr.map((x,i)=>({title:x[0],outcome:x[1],minutes:x[2],order:i}));
const normalize=xs=>xs.map(x=>({...x,interventions:interventions(x.interventions)}));
export const initial={
 recipient:{name:"Lea Moreau",age:12,summary:"Non-verbal at times; highly sensitive to noise and unannounced touch.",
  vigilance:["Highly sensitive to noise","Unannounced touch can escalate distress","Non-verbal at times"]},
 crises:normalize(seedCrises),
 medications:[
  {id:"m1",name:"Antispasmodique",dose:"1 tablet",time:"08:30"},
  {id:"m2",name:"Vitamine D",dose:"2 drops",time:"08:10"},
  {id:"m3",name:"Mélatonine",dose:"1 mg",time:"21:00"}],
 team:[
  ["Dr Colin","Generalist","Cabinet Saint-Roch","summary"],
  ["Dr Sow","Paediatrician","CHU Lyon Sud","summary"],
  ["Dr Bernard","Speech therapist","Cabinet Part-Dieu","summary"],
  ["Marc Lefevre","Physiotherapist","Cabinet Part-Dieu","limited"],
  ["Sophie Girard","Osteopath","Cabinet Croix-Rousse","limited"],
  ["Claire Moreau","Parent","","full"],
  ["Nadia Benali","Teacher","Collège Jean Moulin","limited"]
 ].map((x,i)=>({id:"t"+i,name:x[0],role:x[1],org:x[2],access:x[3],lastShared:i===5?"2 days ago":i===6?"19 days ago":null})),
 wellbeing:[2,2,2,3,3,3,4,4,4],
 theme:"dark",lang:"en"
};

export function load(){try{return JSON.parse(localStorage.getItem("pacatis-web"))||initial}catch{return initial}}
export function save(s){localStorage.setItem("pacatis-web",JSON.stringify(s))}

export const fmt=d=>new Date(d).toLocaleDateString(undefined,{day:"numeric",month:"short"});
export const fmtDateTime=d=>new Date(d).toLocaleString(undefined,{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
export const period=d=>{const h=new Date(d).getHours(); if(h>=5&&h<11)return"Morning";if(h<14)return"Midday";if(h<18)return"Afternoon";if(h<22)return"Evening";return"Night"};

