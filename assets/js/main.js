/* =========================================================
   BUSINESS SETTINGS — EDIT THESE BEFORE GOING LIVE
   WhatsApp: country code + number, digits only. Example: 923001234567
   Email: your real business inbox. FormSubmit requires first-time
   activation via a verification email sent to that inbox.
   Rates: replace all sample amounts with your own approved rates.
   ========================================================= */
const CONFIG = {
  businessName: 'ShahG Rent a Car',
  whatsappNumber: '', // e.g. '923001234567'
  businessEmail: '',   // e.g. 'bookings@yourdomain.com'
  cars: [
    { id:'suzuki-alto', brand:'Suzuki', model:'Alto', category:'Economy', seats:4, transmission:'Automatic', rate:4500, image:'assets/images/suzuki-alto.jpg' },
    { id:'suzuki-cultus', brand:'Suzuki', model:'Cultus', category:'Economy', seats:5, transmission:'Manual', rate:5500, image:'assets/images/suzuki-cultus.jpg' },
    { id:'kia-picanto', brand:'Kia', model:'Picanto', category:'Economy', seats:5, transmission:'Automatic', rate:6000, image:'assets/images/kia-picanto.jpg' },
    { id:'toyota-yaris', brand:'Toyota', model:'Yaris', category:'Sedan', seats:5, transmission:'Automatic', rate:7500, image:'assets/images/toyota-yaris.jpg' },
    { id:'honda-city', brand:'Honda', model:'City', category:'Sedan', seats:5, transmission:'Automatic', rate:8000, image:'assets/images/honda-city.jpg' },
    { id:'toyota-corolla', brand:'Toyota', model:'Corolla', category:'Sedan', seats:5, transmission:'Automatic', rate:9500, image:'assets/images/toyota-corolla.jpg' },
    { id:'honda-civic', brand:'Honda', model:'Civic', category:'Sedan', seats:5, transmission:'Automatic', rate:11500, image:'assets/images/honda-civic.jpg' },
    { id:'hyundai-elantra', brand:'Hyundai', model:'Elantra', category:'Sedan', seats:5, transmission:'Automatic', rate:12000, image:'assets/images/hyundai-elantra.jpg' },
    { id:'kia-sportage', brand:'Kia', model:'Sportage', category:'SUV', seats:5, transmission:'Automatic', rate:17000, image:'assets/images/kia-sportage.jpg' },
    { id:'toyota-fortuner', brand:'Toyota', model:'Fortuner', category:'SUV', seats:7, transmission:'Automatic', rate:28000, image:'assets/images/toyota-fortuner.jpg' }
  ]
};
const $ = id => document.getElementById(id);
const money = n => 'PKR ' + Number(n).toLocaleString('en-PK');
const carName = c => c.brand+' '+c.model;
let selectedFilter='All';
function waUrl(message){return CONFIG.whatsappNumber ? 'https://wa.me/'+CONFIG.whatsappNumber+'?text='+encodeURIComponent(message) : '#contact'}
function renderFleet(){
 const cars=CONFIG.cars.filter(c=>selectedFilter==='All'||c.category===selectedFilter);
 $('fleetGrid').innerHTML=cars.map(c=>{
  const photoStyle='';
  return `<article class="car-card">
    <div class="car-visual">
      <span class="pill">${c.category.toUpperCase()}</span>
      <img class="${photoStyle}" src="${c.image}" alt="${carName(c)} illustrative car image" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.classList.add('visible')">
      <div class="photo-fallback">${carName(c).toUpperCase()}<small style="display:block;font-size:10px;color:#8994a3;margin-top:7px">PHOTO NOT AVAILABLE</small></div>
    </div>
    <div class="car-details">
      <h3>${carName(c)}</h3>
      <div class="subtext">Premium daily rental · Karachi</div>
      <div class="specs"><span>◷ ${c.seats} seats</span><span>◈ ${c.transmission}</span><span>◇ 24-hour rate</span></div>
      <div class="price-line"><div><strong>${money(c.rate)}</strong><small>PER DAY / 24 HOURS</small></div></div>
      <button class="btn btn-dark" data-car="${c.id}" type="button">VIEW RENTAL ESTIMATE ↗</button>
    </div>
  </article>`;
 }).join('');
 document.querySelectorAll('[data-car]').forEach(b=>b.addEventListener('click',()=>{
  $('calcCar').value=b.dataset.car;updateCalculation();$('calculator').scrollIntoView({behavior:'smooth'});
 }));
}

function updateCalculation(){const c=CONFIG.cars.find(x=>x.id===$('calcCar').value)||CONFIG.cars[0];const rawDays=Number($('days').value);const valid=Number.isInteger(rawDays)&&rawDays>=1&&rawDays<=365;const days=valid?rawDays:0;const total=c.rate*days;$('sCar').textContent=carName(c);$('sRate').textContent=money(c.rate);$('sDays').textContent=valid?`${days} day${days===1?'':'s'} (${days*24} hours)`:'Enter 1–365 days';$('sTotal').textContent=valid?money(total):'—';$('sSubtotal').textContent=valid?money(total):'—';$('quoteWhatsApp').href=valid?waUrl(`Hello ${CONFIG.businessName}, I'd like a quote for ${carName(c)} for ${days} day(s) (${days*24} hours). Estimated car rental: ${money(total)}. Start date: ${$('startDate').value||'To be confirmed'}. Pickup area: ${$('pickup').value||'To be confirmed'}. Please confirm availability, final charges, and rental terms.`):'#calculator';$('quoteWhatsApp').style.pointerEvents=valid?'':'none';$('quoteEmail').disabled=!valid;return {c,days,total,valid}}
function init(){const options=CONFIG.cars.map(c=>`<option value="${c.id}">${carName(c)} — ${money(c.rate)}/day</option>`).join('');$('calcCar').innerHTML=options;$('formCar').innerHTML=options;const today=new Date();const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);$('startDate').min=localDate;$('formDate').min=localDate;$('year').textContent=today.getFullYear();renderFleet();updateCalculation();document.querySelectorAll('#calcCar,#days,#startDate,#pickup').forEach(el=>el.addEventListener('input',updateCalculation));document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{selectedFilter=chip.dataset.filter;document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('active',b===chip));renderFleet()}));$('printQuote').addEventListener('click',()=>{const q=updateCalculation();if(q.valid)window.print()});$('quoteEmail').addEventListener('click',()=>{const q=updateCalculation();$('formCar').value=q.c.id;$('formDays').value=q.days;$('formDate').value=$('startDate').value;$('formTotal').value=money(q.total);$('contact').scrollIntoView({behavior:'smooth'})});$('menuToggle').addEventListener('click',()=>{$('navLinks').classList.toggle('open')});document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('navLinks').classList.remove('open')));if(CONFIG.whatsappNumber){$('waDisplay').textContent='+'+CONFIG.whatsappNumber;document.querySelectorAll('.wa-link').forEach(a=>a.href=waUrl(`Hello ${CONFIG.businessName}, I would like to inquire about renting a car in Karachi.`))}else{document.querySelectorAll('.wa-link').forEach(a=>{a.href='#contact';a.removeAttribute('target')})}$('emailDisplay').textContent=CONFIG.businessEmail||'Add your business email';$('emailLink').href=CONFIG.businessEmail?'mailto:'+CONFIG.businessEmail:'#contact';$('inquiryForm').addEventListener('submit',submitForm);if(CONFIG.businessEmail){$('formStatus').textContent='Please fill out the details and submit. We will email your request to our booking inbox.';$('formStatus').style.background='#eaf6ed';$('formStatus').style.borderColor='#b8ddc0';$('formStatus').style.color='#236041'}}
async function submitForm(e){e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const car=CONFIG.cars.find(c=>c.id===$('formCar').value);const days=Number($('formDays').value);if(!Number.isInteger(days)||days<1||days>365){$('formStatus').textContent='Please choose 1–365 whole days.';return}if(!CONFIG.businessEmail){$('formStatus').textContent='Form not active yet: the website owner must enter a business email in CONFIG.businessEmail.';return}const payload=new FormData(form);payload.set('car',carName(car));payload.set('estimated_total',money(car.rate*days));payload.set('daily_rate',money(car.rate));payload.set('rental_hours',String(days*24));const status=$('formStatus');const submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.textContent='Sending your inquiry…';try{const response=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(CONFIG.businessEmail),{method:'POST',body:payload,headers:{Accept:'application/json'}});if(!response.ok)throw Error('Request failed');const body=await response.json();if(body.success===false||body.success==='false')throw Error('Submission not accepted');status.textContent='Your inquiry has been submitted. If this is the first submission, the business owner must activate FormSubmit through the verification email.';status.style.background='#e9f8f1';status.style.color='#146443';form.reset()}catch(err){status.textContent='The form could not send. Please use WhatsApp or email us directly, and check that the form service is configured.';status.style.background='#fff2e8';status.style.color='#8c3a21'}finally{submit.disabled=false}}
init();