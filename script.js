(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var nf=new Intl.NumberFormat('vi-VN');
var fmt=function(n){return nf.format(Math.round(n))+' ₫'};

var ROAST=['','Rang nhạt','Rang vừa','Rang đậm'];
var GRINDS=['Nguyên hạt','Xay phin','Xay espresso','Xay V60','Xay cold brew'];
var CATS=[
  {id:'all',name:'Tất cả'},{id:'phin',name:'Pha phin'},{id:'espresso',name:'Espresso'},
  {id:'pourover',name:'Pour over'},{id:'coldbrew',name:'Cold brew'},{id:'tra',name:'Trà'},{id:'dungcu',name:'Dụng cụ'}
];
var DEF_GRIND={phin:'Xay phin',espresso:'Xay espresso',pourover:'Xay V60'};
var FREE_SHIP=400000, SHIP_FEE=30000;
var COUPONS={
  HATNUI10:{label:'Giảm 10%'},
  CHAOBAN:{label:'Giảm 30.000 ₫ cho đơn từ 200.000 ₫',min:200000},
  FREESHIP:{label:'Miễn phí giao hàng'}
};

var PRODUCTS=[
 {id:'cau-dat',name:'Cầu Đất Arabica Honey',short:['Cầu Đất','Arabica'],cat:'pourover',kind:'bag',hue:'#2F6B5E',region:'Lâm Đồng',origin:'Cầu Đất, Lâm Đồng · 1.500 m',process:'Sơ chế honey',roast:1,badge:'Mới',grind:true,
  notes:['mật ong','mận chín','vỏ cam'],profile:[4,1,4,3],
  sizes:[{l:'250g',p:165000},{l:'500g',p:310000}],
  desc:'Arabica trồng ở độ cao khoảng 1.500 m, sơ chế honey nên giữ được vị ngọt mềm và chút chua thanh của trái cây. Hợp với V60 và Aeropress.',
  brew:'15 g cà phê với 250 ml nước 93°C, xay trung bình. Rót làm 3 lần, tổng thời gian 2 phút 30 đến 3 phút.'},
 {id:'son-la',name:'Sơn La Catimor Washed',short:['Sơn La','Catimor'],cat:'phin',kind:'bag',hue:'#9A4A2E',region:'Sơn La',origin:'Sơn La · 800 đến 1.000 m',process:'Sơ chế ướt',roast:2,grind:true,
  notes:['hạt dẻ','cacao','đường nâu'],profile:[2,2,3,4],
  sizes:[{l:'250g',p:125000},{l:'500g',p:235000},{l:'1kg',p:450000}],
  desc:'Arabica Catimor sơ chế ướt, vị sạch và cân bằng. Pha phin cho ly cà phê dịu, ít đắng, uống được cả khi không thêm sữa.',
  brew:'20 g cà phê xay vừa, 150 ml nước 92 đến 95°C. Ủ 30 giây rồi chiết trong 4 đến 5 phút.'},
 {id:'robusta-dl',name:'Robusta Đắk Lắk Rang Đậm',short:['Robusta','Đắk Lắk'],cat:'phin',kind:'bag',hue:'#22303C',region:'Đắk Lắk',origin:'Buôn Ma Thuột, Đắk Lắk · 500 m',process:'Sơ chế khô',roast:3,badge:'Bán chạy',grind:true,
  notes:['socola đen','gỗ sồi','mạch nha'],profile:[1,4,2,5],
  sizes:[{l:'250g',p:95000},{l:'500g',p:180000},{l:'1kg',p:340000}],
  desc:'Robusta Tây Nguyên rang đậm, body dày và hậu đắng kéo dài. Lựa chọn quen thuộc cho ly cà phê sữa đá buổi sáng.',
  brew:'22 g cà phê xay vừa, 130 ml nước 95°C. Ủ 40 giây, chiết 5 đến 6 phút rồi pha với sữa đặc.'},
 {id:'espresso-7',name:'Espresso Blend Số 7',short:['Espresso','Blend 7'],cat:'espresso',kind:'bag',hue:'#3C4A8E',region:'Phối 70/30',origin:'Arabica Cầu Đất 70% · Robusta Đắk Lắk 30%',process:'Phối hạt',roast:2,grind:true,
  notes:['caramel','cacao','cam sẫm'],profile:[3,3,4,4],
  sizes:[{l:'250g',p:145000},{l:'500g',p:275000}],
  desc:'Phối Arabica với một phần Robusta để có lớp crema dày và vị ngọt caramel. Uống nguyên chất hoặc pha latte đều ổn.',
  brew:'18 g vào, 36 g ra, 27 đến 30 giây ở 93°C. Chỉnh độ xay nếu ly quá chua hoặc quá đắng.'},
 {id:'phin-sg',name:'Phin Sài Gòn Blend',short:['Phin','Sài Gòn'],cat:'phin',kind:'bag',hue:'#6F7D35',region:'Phối truyền thống',origin:'Robusta 80% · Arabica 20%',process:'Phối hạt',roast:3,grind:true,
  notes:['socola','caramel đậm','hậu ngọt'],profile:[1,4,3,5],
  sizes:[{l:'250g',p:99000},{l:'500g',p:189000},{l:'1kg',p:359000}],
  desc:'Công thức phối kiểu truyền thống: Robusta là chính, thêm Arabica cho hậu ngọt. Đậm, thơm và hợp với sữa.',
  brew:'20 g cà phê xay vừa, 150 ml nước sôi để nguội 1 phút. Chiết trong 5 phút.'},
 {id:'culi',name:'Culi Đắk Nông',short:['Culi','Đắk Nông'],cat:'phin',kind:'bag',hue:'#7A3347',region:'Đắk Nông',origin:'Đắk Nông · 700 m',process:'Sơ chế khô',roast:2,grind:true,
  notes:['nho khô','hạt rang','mật mía'],profile:[2,3,3,4],
  sizes:[{l:'250g',p:115000},{l:'500g',p:215000}],
  desc:'Hạt culi tròn, rang đều và chín kỹ nên vị đậm mà không gắt. Hậu vị ngọt kiểu mật mía.',
  brew:'20 g cà phê xay vừa, 150 ml nước 93°C. Chiết 4 đến 5 phút.'},
 {id:'cold-brew',name:'Cold Brew Túi Lọc',short:['Cold Brew','Túi lọc'],cat:'coldbrew',kind:'box',hue:'#2D7F93',region:'Hộp túi lọc',origin:'Arabica và Robusta · 25 g mỗi túi',process:'Phối hạt',roast:2,
  notes:['socola sữa','cam','hậu êm'],profile:[2,2,4,3],
  sizes:[{l:'Hộp 10 túi',p:189000},{l:'Hộp 20 túi',p:359000}],
  desc:'Mỗi túi đã xay thô và định lượng sẵn. Ngâm với nước lạnh qua đêm, sáng ra có ngay một bình cà phê mát, ít chua.',
  brew:'1 túi 25 g cho 250 ml nước lạnh. Ủ trong tủ lạnh 12 đến 16 giờ, lấy túi ra rồi uống với đá.'},
 {id:'olong',name:'Ô Long Tứ Quý',short:['Ô Long','Tứ Quý'],cat:'tra',kind:'tin',hue:'#4F8A5B',region:'Lâm Đồng',origin:'Bảo Lộc, Lâm Đồng · 800 m',process:'Bán lên men',roast:0,
  notes:['hoa lan','sữa','hậu ngọt'],labels:['Hương thơm','Vị chát','Hậu ngọt','Độ đậm'],profile:[4,2,4,3],
  sizes:[{l:'100g',p:120000},{l:'200g',p:220000}],
  desc:'Ô long hái từ vườn trà ở Bảo Lộc, bán lên men nên có hương hoa và chút béo nhẹ như sữa. Hãm được nhiều lần.',
  brew:'3 g trà cho 150 ml nước 90°C. Hãm 40 giây ở lần đầu, các lần sau tăng thêm 10 giây.'},
 {id:'shan-tuyet',name:'Shan Tuyết Hà Giang',short:['Shan Tuyết','Hà Giang'],cat:'tra',kind:'tin',hue:'#A3862F',region:'Hà Giang',origin:'Cây cổ thụ · Hà Giang · 1.200 m',process:'Sao thủ công',roast:0,
  notes:['hoa cỏ','mật ong','hậu ngọt'],labels:['Hương thơm','Vị chát','Hậu ngọt','Độ đậm'],profile:[3,3,5,3],
  sizes:[{l:'100g',p:160000},{l:'200g',p:300000}],
  desc:'Trà từ cây Shan Tuyết cổ thụ trên núi cao, sao thủ công. Nước trà vàng nhạt, chát nhẹ và ngọt ở cuối họng.',
  brew:'4 g trà cho 150 ml nước 85 đến 90°C. Tráng trà một lần rồi hãm 30 giây.'},
 {id:'phin-inox',name:'Phin Inox 304',short:['Phin','Inox'],cat:'dungcu',kind:'phin',hue:'#C9453A',region:'Dụng cụ pha',origin:'Thép không gỉ',process:'',roast:0,
  notes:['bền','dễ vệ sinh'],specs:['Thép không gỉ 304','Có nắp đậy giữ nhiệt','Cỡ 6 pha cho 1 người, cỡ 8 pha cho 1 đến 2 người'],
  sizes:[{l:'Cỡ 6',p:55000},{l:'Cỡ 8',p:65000}],
  desc:'Phin pha cà phê bằng inox, nắp đậy giữ nhiệt khi ủ. Dùng được cho cả cà phê rang đậm lẫn rang vừa.'},
 {id:'v60',name:'Phễu Lọc V60 02',short:['Phễu','V60 02'],cat:'dungcu',kind:'v60',hue:'#D2693A',region:'Dụng cụ pha',origin:'Phễu pha pour over',process:'',roast:0,
  notes:['pour over','1 đến 4 cốc'],specs:['Dùng giấy lọc size 02','Pha được 1 đến 4 cốc','Rãnh xoắn giúp nước chảy đều'],
  sizes:[{l:'Nhựa',p:150000},{l:'Sứ',p:290000}],
  desc:'Phễu hình nón cho cà phê pour over, vị sạch và rõ hương. Phù hợp với Cầu Đất Arabica Honey.'},
 {id:'can',name:'Cân Pha Chế 0,1 g',short:['Cân','0,1 g'],cat:'dungcu',kind:'scale',hue:'#5A6B76',region:'Dụng cụ pha',origin:'Cân điện tử',process:'',roast:0,
  notes:['độ chính xác 0,1 g','bấm giờ'],specs:['Độ chính xác 0,1 g','Có chế độ bấm giờ','Sạc qua cổng USB-C'],
  sizes:[{l:'Tiêu chuẩn',p:360000}],
  desc:'Cân có bấm giờ để định lượng cà phê và nước chính xác. Mỗi ly pha giống nhau hơn khi bạn cân thay vì ước chừng.'}
];
var byId={};PRODUCTS.forEach(function(p,i){p.idx=i;byId[p.id]=p;if(p.grind)p.defGrind=DEF_GRIND[p.cat]||GRINDS[0];});

/* ---------- product art (inline SVG) ---------- */
function dots(n,x,y){var s='';for(var i=0;i<3;i++){s+='<circle cx="'+(x+i*9)+'" cy="'+y+'" r="2.6" fill="'+(i<n?'#C4352D':'#C9D3CE')+'"/>';}return s;}
function labelTxt(p,y0){
  var t=p.short;
  return '<text x="100" y="'+(y0)+'" text-anchor="middle" font-size="7.5" letter-spacing="1" fill="#56686F" style="font-family:JetBrains Mono,monospace">'+esc(p.region.toUpperCase().slice(0,16))+'</text>'+
  '<text x="100" y="'+(y0+24)+'" text-anchor="middle" font-size="15" font-weight="700" fill="#13202B" style="font-family:Bricolage Grotesque,sans-serif">'+esc(t[0])+'</text>'+
  '<text x="100" y="'+(y0+42)+'" text-anchor="middle" font-size="13" font-weight="600" fill="#13202B" style="font-family:Bricolage Grotesque,sans-serif">'+esc(t[1]||'')+'</text>';
}
function art(p){
  var c=p.hue,a='<svg viewBox="0 0 200 240" role="img" aria-label="'+esc(p.name)+'" xmlns="http://www.w3.org/2000/svg">';
  a+='<ellipse cx="100" cy="228" rx="66" ry="6" fill="#000" opacity=".14"/>';
  if(p.kind==='bag'){
    a+='<path d="M46 36h108l8 26v158a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V62z" fill="'+c+'"/>'+
       '<path d="M46 36h108l8 26H38z" fill="#000" opacity=".2"/><rect x="46" y="30" width="108" height="8" rx="2" fill="#000" opacity=".3"/>'+
       '<circle cx="100" cy="82" r="7" fill="#000" opacity=".3"/>'+
       '<rect x="54" y="102" width="92" height="106" rx="4" fill="#F4F6F2"/>'+labelTxt(p,122)+dots(p.roast,91,196);
  }else if(p.kind==='box'){
    a+='<rect x="38" y="64" width="124" height="158" rx="6" fill="'+c+'"/><rect x="38" y="64" width="124" height="18" rx="6" fill="#000" opacity=".2"/>'+
       '<rect x="50" y="98" width="100" height="108" rx="4" fill="#F4F6F2"/>'+labelTxt(p,120)+
       '<path d="M92 40h16v26H92z" fill="#C9D3CE"/><rect x="88" y="30" width="24" height="14" rx="3" fill="#F4F6F2"/>'+dots(p.roast,91,194);
  }else if(p.kind==='tin'){
    a+='<rect x="48" y="62" width="104" height="160" rx="12" fill="'+c+'"/><rect x="44" y="46" width="112" height="26" rx="9" fill="#000" opacity=".28"/><rect x="44" y="46" width="112" height="22" rx="9" fill="'+c+'"/>'+
       '<rect x="58" y="96" width="84" height="108" rx="4" fill="#F4F6F2"/>'+labelTxt(p,118)+
       '<path d="M92 190q8-12 16 0q-8 10-16 0z" fill="'+c+'" opacity=".8"/>';
  }else if(p.kind==='phin'){
    a+='<path d="M58 124h84l-8 66H66z" fill="#C5CFD3"/><rect x="52" y="110" width="96" height="16" rx="5" fill="#AEBBC1"/>'+
       '<path d="M64 110c0-24 72-24 72 0z" fill="#D8DFE2"/><circle cx="100" cy="82" r="7" fill="'+c+'"/>'+
       '<path d="M44 190h112l-12 18H56z" fill="#9FACB2"/><path d="M70 130v50M100 130v50M130 130v50" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>';
  }else if(p.kind==='v60'){
    a+='<path d="M44 84h112l-34 92H78z" fill="'+c+'"/><path d="M44 84h112" stroke="#000" stroke-opacity=".25" stroke-width="6"/>'+
       '<path d="M70 90l20 82M100 90v82M130 90l-20 82" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>'+
       '<rect x="76" y="176" width="48" height="10" rx="3" fill="#000" opacity=".3"/><rect x="62" y="190" width="76" height="34" rx="6" fill="#E9EEEC"/>'+
       '<path d="M138 196q18 0 18 12t-18 12" fill="none" stroke="#E9EEEC" stroke-width="6"/>';
  }else{
    a+='<rect x="30" y="140" width="140" height="70" rx="12" fill="#2A3640"/><rect x="40" y="124" width="120" height="16" rx="8" fill="#B8C3C8"/>'+
       '<rect x="58" y="156" width="84" height="30" rx="5" fill="#CBE7D4"/><text x="136" y="178" text-anchor="end" font-size="17" fill="#13202B" style="font-family:JetBrains Mono,monospace">0.0 g</text>'+
       '<circle cx="50" cy="198" r="3" fill="#9FACB2"/><circle cx="150" cy="198" r="3" fill="#9FACB2"/>';
  }
  return a+'</svg>';
}

/* ---------- state ---------- */
var state={q:'',cat:'all',sort:'featured'};
var coupon=null;
var cart=loadCart();
function loadCart(){
  try{
    var v=JSON.parse(localStorage.getItem('hatnui-cart')||'[]');
    if(!Array.isArray(v))return [];
    return v.filter(function(i){return i&&byId[i.id]&&byId[i.id].sizes[i.size]&&i.qty>0;});
  }catch(e){return [];}
}
function saveCart(){try{localStorage.setItem('hatnui-cart',JSON.stringify(cart));}catch(e){}}

/* ---------- dates ---------- */
var WD=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
var pad=function(n){return n<10?'0'+n:''+n};
var dm=function(d){return pad(d.getDate())+'/'+pad(d.getMonth()+1)};
function nextRoast(now){
  for(var i=0;i<8;i++){
    var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
    var wd=d.getDay();
    if((wd===2||wd===5)&&(i>0||now.getHours()<14))return d;
  }
  return now;
}
function addDays(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);}

/* ---------- shop grid ---------- */
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d');}
function visible(){
  var q=norm(state.q.trim());
  var list=PRODUCTS.filter(function(p){
    if(state.cat!=='all'&&p.cat!==state.cat)return false;
    if(!q)return true;
    var hay=norm([p.name,p.region,p.origin,p.notes.join(' ')].join(' '));
    return q.split(/\s+/).every(function(w){return hay.indexOf(w)>-1;});
  });
  var minP=function(p){return p.sizes[0].p;};
  if(state.sort==='asc')list.sort(function(a,b){return minP(a)-minP(b);});
  else if(state.sort==='desc')list.sort(function(a,b){return minP(b)-minP(a);});
  else if(state.sort==='name')list.sort(function(a,b){return a.name.localeCompare(b.name,'vi');});
  else list.sort(function(a,b){return a.idx-b.idx;});
  return list;
}
function roastTag(p){
  if(p.roast){var d='';for(var i=1;i<=3;i++)d+='<i'+(i<=p.roast?' class="on"':'')+'></i>';
    return '<span class="tag"><span class="roast" aria-hidden="true">'+d+'</span>'+ROAST[p.roast]+'</span>';}
  return '<span class="tag">'+(p.cat==='tra'?'Trà':'Dụng cụ')+'</span>';
}
function cardHTML(p){
  var s0=p.sizes[0];
  var sizeCtl=p.sizes.length>1
    ?'<select class="size" data-size aria-label="Quy cách của '+esc(p.name)+'">'+p.sizes.map(function(s,i){return '<option value="'+i+'">'+esc(s.l)+'</option>';}).join('')+'</select>'
    :'<span class="size-one">'+esc(s0.l)+'</span>';
  return '<article class="card" style="--c:'+p.hue+'" data-id="'+p.id+'">'+
    '<button class="card-art" type="button" data-open="'+p.id+'" aria-label="Xem chi tiết '+esc(p.name)+'">'+art(p)+(p.badge?'<span class="badge">'+esc(p.badge)+'</span>':'')+'</button>'+
    '<div class="card-body"><div class="meta">'+roastTag(p)+'<span>'+esc(p.region)+'</span></div>'+
    '<h3><button type="button" class="title-btn" data-open="'+p.id+'">'+esc(p.name)+'</button></h3>'+
    '<p class="notes">'+esc(p.notes.join(' · '))+'</p>'+
    '<div class="buy">'+sizeCtl+'<span class="price" data-price>'+fmt(s0.p)+'</span><button class="btn btn-primary btn-sm" type="button" data-add="'+p.id+'">Thêm</button></div></div></article>';
}
function renderChips(){
  $('#chips').innerHTML=CATS.map(function(c){
    var n=c.id==='all'?PRODUCTS.length:PRODUCTS.filter(function(p){return p.cat===c.id;}).length;
    return '<button type="button" class="chip" data-cat="'+c.id+'" aria-pressed="'+(state.cat===c.id)+'">'+c.name+'<small>'+n+'</small></button>';
  }).join('');
}
function renderGrid(){
  var list=visible();
  $('#resultLine').textContent=list.length+' sản phẩm'+(state.q?' khớp với "'+state.q.trim()+'"':'');
  $('#grid').innerHTML=list.length?list.map(cardHTML).join(''):
    '<div class="empty" style="grid-column:1/-1"><p>Không có sản phẩm nào khớp với "'+esc(state.q.trim())+'".</p><button class="btn" type="button" id="resetFilters">Xóa bộ lọc</button></div>';
}
$('#grid').addEventListener('click',function(e){
  var o=e.target.closest('[data-open]');
  if(o){openModal(o.getAttribute('data-open'));return;}
  var a=e.target.closest('[data-add]');
  if(a){
    var card=a.closest('.card'),sel=card.querySelector('select[data-size]');
    var p=byId[a.getAttribute('data-add')];
    addToCart(p.id,sel?+sel.value:0,p.defGrind||null,1);
    return;
  }
  if(e.target.id==='resetFilters'){state.q='';state.cat='all';$('#q').value='';renderChips();renderGrid();}
});
$('#grid').addEventListener('change',function(e){
  var sel=e.target.closest('select[data-size]');if(!sel)return;
  var card=sel.closest('.card'),p=byId[card.getAttribute('data-id')];
  card.querySelector('[data-price]').textContent=fmt(p.sizes[+sel.value].p);
});
$('#chips').addEventListener('click',function(e){
  var b=e.target.closest('[data-cat]');if(!b)return;
  state.cat=b.getAttribute('data-cat');renderChips();renderGrid();
});
$('#q').addEventListener('input',function(e){state.q=e.target.value;renderGrid();});
$('#sort').addEventListener('change',function(e){state.sort=e.target.value;renderGrid();});

/* ---------- cart logic ---------- */
function keyOf(i){return i.id+'|'+i.size+'|'+(i.grind||'');}
function addToCart(id,size,grind,qty){
  var k=id+'|'+size+'|'+(grind||'');
  var ex=cart.filter(function(i){return keyOf(i)===k;})[0];
  if(ex)ex.qty=Math.min(20,ex.qty+qty);else cart.push({id:id,size:size,grind:grind,qty:qty});
  saveCart();renderCart();
  toast('Đã thêm '+byId[id].name+' vào giỏ');
}
function totals(){
  var sub=cart.reduce(function(s,i){return s+byId[i.id].sizes[i.size].p*i.qty;},0);
  var disc=0,note='',cls='';
  if(coupon){
    var c=COUPONS[coupon];
    if(coupon==='HATNUI10'){disc=Math.round(sub*0.1/1000)*1000;}
    else if(coupon==='CHAOBAN'){
      if(sub>=c.min)disc=30000;else{note='Mã CHAOBAN cần đơn từ '+fmt(c.min)+'.';cls='bad';}
    }
    if(!note){note='Đã áp dụng '+coupon+': '+c.label+'.';cls='ok';}
  }
  var ship=sub===0?0:((sub>=FREE_SHIP||coupon==='FREESHIP')?0:SHIP_FEE);
  return {sub:sub,disc:disc,ship:ship,total:Math.max(0,sub-disc)+ship,note:note,cls:cls};
}
function itemCount(){return cart.reduce(function(s,i){return s+i.qty;},0);}
function renderBadge(){
  var n=itemCount(),b=$('#cartCount');
  b.hidden=n===0;b.textContent=n;
  $('#cartBtn').setAttribute('aria-label','Mở giỏ hàng, '+n+' sản phẩm');
}
function sumHTML(t,withCoupon){
  return '<div><span>Tạm tính</span><span>'+fmt(t.sub)+'</span></div>'+
    (t.disc?'<div class="disc"><span>Giảm giá'+(coupon?' ('+coupon+')':'')+'</span><span>−'+fmt(t.disc)+'</span></div>':'')+
    '<div><span>Phí giao hàng</span><span>'+(t.ship?fmt(t.ship):'Miễn phí')+'</span></div>'+
    '<div class="total"><span>Tổng cộng</span><span>'+fmt(t.total)+'</span></div>';
}
function renderCart(){
  renderBadge();
  var t=totals(),body=$('#cartBody'),foot=$('#cartFoot');
  if(!cart.length){
    body.innerHTML='<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-.8.8H7.2a1 1 0 0 1-.8-.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><p><b style="color:var(--ink)">Giỏ hàng đang trống</b></p><p style="margin-top:4px">Chọn vài túi cà phê để bắt đầu.</p><button class="btn btn-primary" type="button" id="goShop" style="margin-top:16px">Xem sản phẩm</button></div>';
    foot.innerHTML='';foot.hidden=true;return;
  }
  foot.hidden=false;
  var left=Math.max(0,FREE_SHIP-t.sub),pct=Math.min(100,t.sub/FREE_SHIP*100);
  var bar='<div class="ship-bar">'+(t.ship===0?'Đơn của bạn được miễn phí giao hàng.':'Mua thêm <b>'+fmt(left)+'</b> để được miễn phí giao hàng.')+'<div class="track"><div class="fill" style="width:'+(t.ship===0?100:pct)+'%"></div></div></div>';
  var lines=cart.map(function(i){
    var p=byId[i.id],s=p.sizes[i.size],k=esc(keyOf(i));
    return '<li class="line" data-key="'+k+'"><div class="thumb" style="--c:'+p.hue+'">'+art(p)+'</div>'+
      '<div class="line-main"><strong>'+esc(p.name)+'</strong><span class="sub">'+esc(s.l)+(i.grind?' · '+esc(i.grind):'')+' · '+fmt(s.p)+'</span>'+
      '<div class="line-ctl"><div class="stepper"><button type="button" data-act="dec" aria-label="Giảm số lượng">−</button><output>'+i.qty+'</output><button type="button" data-act="inc" aria-label="Tăng số lượng">+</button></div><button class="link" type="button" data-act="rm">Xóa</button></div></div>'+
      '<div class="line-price">'+fmt(s.p*i.qty)+'</div></li>';
  }).join('');
  body.innerHTML=bar+'<ul class="lines">'+lines+'</ul>';
  var cv=$('#couponInput')?$('#couponInput').value:'';
  foot.innerHTML='<div><form class="coupon" id="couponForm"><label class="field-in" for="couponInput"><input id="couponInput" placeholder="Mã giảm giá" autocomplete="off" value="'+esc(cv)+'"></label><button class="btn" type="submit">Áp dụng</button></form><p class="coupon-note '+t.cls+'" id="couponNote">'+esc(t.note||'Thử HATNUI10, CHAOBAN hoặc FREESHIP.')+'</p></div>'+
    '<div class="sum">'+sumHTML(t)+'</div><button class="btn btn-primary" type="button" id="toCheckout" style="width:100%">Thanh toán</button>';
}
$('#cartBody').addEventListener('click',function(e){
  if(e.target.id==='goShop'){closeDrawer();location.hash='san-pham';return;}
  var b=e.target.closest('[data-act]');if(!b)return;
  var li=b.closest('.line'),k=li.getAttribute('data-key');
  var it=cart.filter(function(i){return keyOf(i)===k;})[0];if(!it)return;
  var act=b.getAttribute('data-act');
  if(act==='inc')it.qty=Math.min(20,it.qty+1);
  else if(act==='dec')it.qty=Math.max(1,it.qty-1);
  else cart=cart.filter(function(i){return i!==it;});
  saveCart();renderCart();
});
$('#cartFoot').addEventListener('submit',function(e){
  if(e.target.id!=='couponForm')return;
  e.preventDefault();
  var code=$('#couponInput').value.trim().toUpperCase();
  var note=$('#couponNote');
  if(!code){coupon=null;renderCart();return;}
  if(!COUPONS[code]){note.textContent='Mã "'+code+'" không tồn tại. Kiểm tra lại chữ hoa, chữ thường không quan trọng.';note.className='coupon-note bad';return;}
  coupon=code;renderCart();
});
$('#cartFoot').addEventListener('click',function(e){
  if(e.target.id==='toCheckout'){showView('checkout');}
});

/* ---------- drawer ---------- */
var lastFocus=null;
function showView(v){
  $('#viewCart').hidden=v!=='cart';$('#viewCheckout').hidden=v!=='checkout';$('#viewDone').hidden=v!=='done';
  $('#drawerTitle').textContent=v==='cart'?'Giỏ hàng':(v==='checkout'?'Thông tin giao hàng':'Đặt hàng');
  if(v==='checkout')$('#coSum').innerHTML=sumHTML(totals());
  var d=$('#drawer');d.scrollTop=0;
  var body=d.querySelector('.view:not([hidden]) .drawer-body');if(body)body.scrollTop=0;
}
function openDrawer(v){
  lastFocus=document.activeElement;
  renderCart();showView(v||'cart');
  $('#scrim').hidden=false;
  var d=$('#drawer');d.classList.add('open');d.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  setTimeout(function(){$('#drawerClose').focus();},50);
}
function closeDrawer(){
  $('#scrim').hidden=true;
  var d=$('#drawer');d.classList.remove('open');d.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
$('#cartBtn').addEventListener('click',function(){openDrawer('cart');});
$('#drawerClose').addEventListener('click',closeDrawer);
$('#scrim').addEventListener('click',closeDrawer);
$('#backToCart').addEventListener('click',function(){showView('cart');});

/* ---------- checkout ---------- */
function setErr(id,msg){
  var f=$('#'+id),p=f.querySelector('.err');
  f.classList.toggle('bad',!!msg);p.hidden=!msg;p.textContent=msg||'';
}
$('#checkoutForm').addEventListener('submit',function(e){
  e.preventDefault();
  var f=e.target,v=function(n){return (f.elements[n].value||'').trim();};
  var ok=true;
  var phone=v('phone').replace(/[\s.\-]/g,'');
  if(v('name').length<2){setErr('f-name','Nhập họ và tên người nhận.');ok=false;}else setErr('f-name','');
  if(!/^(0|\+84)\d{9}$/.test(phone)){setErr('f-phone','Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.');ok=false;}else setErr('f-phone','');
  if(!v('city')){setErr('f-city','Chọn tỉnh hoặc thành phố.');ok=false;}else setErr('f-city','');
  if(v('addr').length<8){setErr('f-addr','Nhập địa chỉ đầy đủ để người giao tìm được.');ok=false;}else setErr('f-addr','');
  if(!ok){var first=f.querySelector('.f.bad input,.f.bad select');if(first)first.focus();return;}
  var t=totals(),now=new Date();
  var roastNeeded=cart.some(function(i){var c=byId[i.id].cat;return c!=='dungcu';});
  var from=roastNeeded?addDays(nextRoast(now),1):addDays(now,1);
  var order={code:'HN-'+String(Math.floor(100000+Math.random()*900000)),t:t,pay:v('pay')||f.elements.pay.value,name:v('name'),phone:phone,addr:v('addr')+', '+v('city'),count:itemCount(),from:addDays(from,1),to:addDays(from,3)};
  cart=[];coupon=null;saveCart();renderCart();
  $('#doneBody').innerHTML='<div class="done"><div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'+
    '<h3>Cảm ơn '+esc(order.name)+'</h3><p style="color:var(--muted)">Đơn hàng mẫu của bạn đã được ghi nhận.</p>'+
    '<dl><div><dt>Mã đơn</dt><dd style="font-family:var(--mono)">'+order.code+'</dd></div>'+
    '<div><dt>Số sản phẩm</dt><dd>'+order.count+'</dd></div>'+
    '<div><dt>Tổng thanh toán</dt><dd>'+fmt(order.t.total)+'</dd></div>'+
    '<div><dt>Hình thức</dt><dd>'+esc(order.pay)+'</dd></div>'+
    '<div><dt>Giao đến</dt><dd>'+esc(order.addr)+'</dd></div>'+
    '<div><dt>Dự kiến nhận</dt><dd>'+dm(order.from)+' đến '+dm(order.to)+'</dd></div></dl>'+
    '<p class="note" style="margin-bottom:16px">Đây là trang mẫu nên đơn này chưa được gửi đến cửa hàng thật.</p>'+
    '<button class="btn btn-primary" type="button" id="doneClose" style="width:100%">Tiếp tục mua sắm</button></div>';
  f.reset();showView('done');
});
$('#doneBody').addEventListener('click',function(e){if(e.target.id==='doneClose')closeDrawer();});

/* ---------- product modal ---------- */
var m=null;
function profileHTML(p){
  var labels=p.labels||['Độ chua','Độ đắng','Vị ngọt','Body'];
  return '<div class="profile">'+labels.map(function(l,i){
    var s='';for(var k=1;k<=5;k++)s+='<i'+(k<=p.profile[i]?' class="on"':'')+'></i>';
    return '<div class="prow"><span>'+l+'</span><span class="segs" role="img" aria-label="'+p.profile[i]+' trên 5">'+s+'</span></div>';
  }).join('')+'</div>';
}
function renderModal(){
  var p=byId[m.id],s=p.sizes[m.size];
  var sizeLabel=p.cat==='dungcu'?'Quy cách':(p.cat==='tra'?'Khối lượng':(p.kind==='box'?'Số túi':'Khối lượng'));
  var html='<button class="icon-btn close" type="button" data-close aria-label="Đóng"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
   '<div class="panel-art" style="--c:'+p.hue+'">'+art(p)+'</div><div class="panel-info">'+
   '<div><span class="mono">'+esc(p.origin)+'</span><h2 id="mTitle" style="margin-top:8px">'+esc(p.name)+'</h2></div>'+
   '<div class="chipline">'+roastTag(p)+(p.process?'<span class="tag">'+esc(p.process)+'</span>':'')+p.notes.map(function(n){return '<span class="tag">'+esc(n)+'</span>';}).join('')+'</div>'+
   '<p>'+esc(p.desc)+'</p>'+
   (p.profile?profileHTML(p):'')+
   (p.specs?'<ul class="specs">'+p.specs.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'')+
   (p.brew?'<div class="tip"><b>Gợi ý pha</b>'+esc(p.brew)+'</div>':'')+
   '<div class="opts"><div><span class="opt-label">'+sizeLabel+'</span><div class="sizes">'+p.sizes.map(function(z,i){return '<button type="button" data-msize="'+i+'" aria-pressed="'+(i===m.size)+'">'+esc(z.l)+'<small>'+fmt(z.p)+'</small></button>';}).join('')+'</div></div>'+
   (p.grind?'<div><label class="opt-label" for="mGrind">Kiểu xay</label><select id="mGrind">'+GRINDS.map(function(g){return '<option'+(g===m.grind?' selected':'')+'>'+g+'</option>';}).join('')+'</select></div>':'')+
   '</div><div class="buy-row"><span class="total" id="mTotal">'+fmt(s.p*m.qty)+'</span><div class="stepper"><button type="button" data-mq="-1" aria-label="Giảm số lượng">−</button><output id="mQty">'+m.qty+'</output><button type="button" data-mq="1" aria-label="Tăng số lượng">+</button></div>'+
   '<button class="btn btn-primary" type="button" data-madd>Thêm vào giỏ</button></div></div>';
  $('#panel').innerHTML=html;
}
function openModal(id){
  var p=byId[id];if(!p)return;
  lastFocus=document.activeElement;
  m={id:id,size:0,grind:p.defGrind||null,qty:1};
  renderModal();
  $('#modal').hidden=false;document.body.style.overflow='hidden';
  $('#panel').scrollTop=0;
  var c=$('#panel [data-close]');if(c)c.focus();
}
function closeModal(){
  $('#modal').hidden=true;m=null;
  if(!$('#drawer').classList.contains('open'))document.body.style.overflow='';
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
$('#modalScrim').addEventListener('click',closeModal);
$('#panel').addEventListener('click',function(e){
  if(!m)return;
  if(e.target.closest('[data-close]')){closeModal();return;}
  var sz=e.target.closest('[data-msize]');
  if(sz){m.size=+sz.getAttribute('data-msize');renderModal();var b=$('#panel [data-msize="'+m.size+'"]');if(b)b.focus();return;}
  var q=e.target.closest('[data-mq]');
  if(q){
    m.qty=Math.max(1,Math.min(20,m.qty+(+q.getAttribute('data-mq'))));
    $('#mQty').textContent=m.qty;$('#mTotal').textContent=fmt(byId[m.id].sizes[m.size].p*m.qty);return;
  }
  if(e.target.closest('[data-madd]')){
    addToCart(m.id,m.size,m.grind,m.qty);closeModal();
  }
});
$('#panel').addEventListener('change',function(e){if(m&&e.target.id==='mGrind')m.grind=e.target.value;});

/* ---------- misc ---------- */
var toastTimer;
function toast(msg){
  var t=$('#toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove('show');},2200);
}
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(!$('#modal').hidden)closeModal();else if($('#drawer').classList.contains('open'))closeDrawer();
});
$('#themeBtn').addEventListener('click',function(){
  var r=document.documentElement,cur=r.getAttribute('data-theme');
  var dark=cur?cur==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  r.setAttribute('data-theme',dark?'light':'dark');
});

/* ---------- init ---------- */
(function(){
  var nr=nextRoast(new Date());
  $('#nextRoast').textContent=WD[nr.getDay()]+', '+dm(nr);
  $('#heroArt').insertAdjacentHTML('afterbegin',art(byId['cau-dat']));
  renderChips();renderGrid();renderCart();
})();
})();
