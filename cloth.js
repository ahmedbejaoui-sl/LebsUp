const SHELVES = 4;
const SLOTS_PER_SHELF = 6;

const fileInput = document.getElementById("fileInput");
const modal = document.getElementById("modal");
const uploadBtn = document.getElementById("uploadBtn");
const linkBtn = document.getElementById("linkBtn");
const closeModal = document.getElementById("closeModal");
const urlSection = document.getElementById("urlSection");
const addURLBtn = document.getElementById("addURLBtn");
const imageURLInput = document.getElementById("imageURL");
const outfitArea = document.getElementById("outfitArea");

let currentSlot = null;

// Create slots dynamically
for(let s=1;s<=SHELVES;s++){
  const shelf=document.getElementById(`shelf${s}`);
  for(let i=0;i<SLOTS_PER_SHELF;i++){
    const slot=document.createElement("div");
    slot.className="slot";

    const inner=document.createElement("div");
    inner.className="slot-inner";
    slot.appendChild(inner);

    const delBtn=document.createElement("button");
    delBtn.className="delete-btn";
    delBtn.innerText="×";
    delBtn.addEventListener("click", e=>{
      e.stopPropagation();
      inner.innerHTML="";
      inner.appendChild(createLabel());
    });
    slot.appendChild(delBtn);

    inner.appendChild(createLabel());

    slot.addEventListener("click",()=>{
      currentSlot=inner;
      modal.classList.remove("hidden");
      urlSection.classList.add("hidden");
    });

    shelf.appendChild(slot);
  }
}

// Modal buttons
uploadBtn.addEventListener("click",()=>fileInput.click());
linkBtn.addEventListener("click",()=>urlSection.classList.remove("hidden"));
closeModal.addEventListener("click",()=>{ modal.classList.add("hidden"); imageURLInput.value=""; });

fileInput.addEventListener("change", e=>{
  const file=e.target.files[0];
  if(file && currentSlot){
    const img=document.createElement("img");
    img.src=URL.createObjectURL(file);
    img.onload=()=>URL.revokeObjectURL(img.src);
    currentSlot.innerHTML="";
    currentSlot.appendChild(img);
    currentSlot.appendChild(createLabel());
    modal.classList.add("hidden");
  }
  fileInput.value="";
});

addURLBtn.addEventListener("click", ()=>{
  const url=imageURLInput.value.trim();
  if(url && currentSlot){
    const img=document.createElement("img");
    img.src=url;
    img.onerror=()=>alert("Invalid URL!");
    currentSlot.innerHTML="";
    currentSlot.appendChild(img);
    currentSlot.appendChild(createLabel());
    modal.classList.add("hidden");
    imageURLInput.value="";
  }
});

// Label creator
function createLabel(){
  const label=document.createElement("div");
  label.className="item-label";
  label.innerText="Click to name";
  label.addEventListener("click", e=>{
    e.stopPropagation();
    const input=document.createElement("input");
    input.type="text";
    input.value=label.innerText==="Click to name"?"":label.innerText;
    label.innerText="";
    label.appendChild(input);
    input.focus();
    input.addEventListener("blur",()=>{ label.innerText=input.value.trim()||"Click to name"; });
    input.addEventListener("keydown", ev=>{ if(ev.key==="Enter") label.innerText=input.value.trim()||"Click to name"; });
  });
  return label;
}

// Drag & drop
function makeDraggable(el){
  el.onmousedown=function(e){
    e.preventDefault();
    let shiftX=e.clientX-el.getBoundingClientRect().left;
    let shiftY=e.clientY-el.getBoundingClientRect().top;

    function moveAt(pageX,pageY){
      el.style.left=pageX-outfitArea.getBoundingClientRect().left-shiftX+"px";
      el.style.top=pageY-outfitArea.getBoundingClientRect().top-shiftY+"px";
    }

    function onMouseMove(e){ moveAt(e.pageX,e.pageY); }

    document.addEventListener("mousemove", onMouseMove);
    el.onmouseup=function(){
      document.removeEventListener("mousemove", onMouseMove);
      el.onmouseup=null;

      const zones=document.querySelectorAll(".zone");
      let droppedInZone=false;
      zones.forEach(zone=>{
        const rect=zone.getBoundingClientRect();
        const elRect=el.getBoundingClientRect();
        if(elRect.left+elRect.width/2>rect.left &&
           elRect.right-elRect.width/2<rect.right &&
           elRect.top+elRect.height/2>rect.top &&
           elRect.bottom-elRect.height/2<rect.bottom){
          el.style.position="relative";
          el.style.left="0px";
          el.style.top="0px";
          zone.appendChild(el);
          droppedInZone=true;
        }
      });
      if(!droppedInZone) el.remove();
    };
  };
  el.ondragstart=function(){ return false; };
}

// Make already uploaded items draggable
document.querySelectorAll(".slot-inner img").forEach(img=>makeDraggable(img));
