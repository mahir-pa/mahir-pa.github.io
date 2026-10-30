// Small mathematical parser. Expressions never execute JavaScript.
const functions={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,exp:Math.exp,log:Math.log,ln:Math.log,log10:Math.log10,sqrt:Math.sqrt,abs:Math.abs,floor:Math.floor,ceil:Math.ceil,round:Math.round,sign:Math.sign,min:Math.min,max:Math.max,pow:Math.pow};
export function compileExpression(source){
 if(source.length>240)throw Error('Keep the expression under 240 characters.');
 const tokens=[];let at=0;while(at<source.length){const rest=source.slice(at);let m;if((m=rest.match(/^\s+/))){at+=m[0].length;continue}if((m=rest.match(/^(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?/i))){tokens.push({kind:'number',value:Number(m[0])});at+=m[0].length;continue}if((m=rest.match(/^[a-z][a-z0-9]*/i))){tokens.push({kind:'name',value:m[0].toLowerCase()});at+=m[0].length;continue}const c=source[at++];if('+-*/^(),'.includes(c))tokens.push({kind:c});else throw Error(`“${c}” isn’t supported. Use ordinary math notation.`)}tokens.push({kind:'end'});let i=0,depth=0;
 function expression(min=0){if(++depth>30)throw Error('The expression is nested too deeply.');let token=tokens[i++],left;
  if(token.kind==='number')left=()=>token.value;
  else if(token.kind==='+'||token.kind==='-'){const child=expression(25);left=token.kind==='-'?v=>-child(v):child;}
  else if(token.kind==='('){left=expression();if(tokens[i++].kind!==')')throw Error('Close each opening parenthesis.');}
  else if(token.kind==='name'){const name=token.value;if(tokens[i].kind==='('){if(!functions[name])throw Error(`Unknown function: ${name}.`);i++;const args=[];if(tokens[i].kind!==')'){do{args.push(expression());if(tokens[i].kind!==',')break;i++;}while(true)}if(tokens[i++].kind!==')')throw Error('Check the function parentheses.');const count=['min','max'].includes(name)?[1,8]:name==='pow'?[2,2]:[1,1];if(args.length<count[0]||args.length>count[1])throw Error(`Check the number of arguments to ${name}.`);left=v=>functions[name](...args.map(a=>a(v)));}else if(['x','t','f'].includes(name))left=v=>v[name];else if(name==='pi')left=()=>Math.PI;else if(name==='e')left=()=>Math.E;else throw Error(`Unknown name: ${name}. Use x, t, f, pi, or e.`);}
  else throw Error('Expected a number, variable, or function.');
  while(true){const op=tokens[i].kind,implicit=tokens[i].kind==='number'||tokens[i].kind==='name'||tokens[i].kind==='(',bp=op==='+'||op==='-'?10:op==='*'||op==='/'||implicit?20:op==='^'?30:-1;if(bp<min)break;if(!implicit)i++;const right=expression(op==='^'?bp:bp+1),a=left;left=implicit||op==='*'?v=>a(v)*right(v):op==='/'?v=>a(v)/right(v):op==='+'?v=>a(v)+right(v):op==='-'?v=>a(v)-right(v):v=>a(v)**right(v);}
  depth--;return left;
 }
 if(!tokens.length||tokens[0].kind==='end')throw Error('Enter a function first.');const fn=expression();if(tokens[i].kind!=='end')throw Error('Check the expression near the end.');return (x,t=0,f=3)=>fn({x,t,f});
}
