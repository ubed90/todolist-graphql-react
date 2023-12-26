import{j as t,u as g,a as b,r as h,b as j,F as o,S,Q as i,l as v,U as C}from"./index-pcZnfiYo.js";const F=()=>{const{user:e}=g(l=>l.user),u=b(),[s,m]=h.useState({id:e.id,email:e.email,name:e.name,firstName:e.firstName,lastName:e.lastName}),{mutationFn:c,loading:d,reset:x}=j(C),f=()=>{m({...e})},r=(l,a)=>{m(n=>({...n,[l]:a}))},p=l=>{if(l.preventDefault(),(e==null?void 0:e.email)===s.email&&e.firstName===s.firstName&&e.lastName===s.lastName){i.warn("No changes to Save.");return}c({variables:{email:s.email,firstName:s.firstName,lastName:s.lastName},onCompleted(a){const{updateProfile:{user:n,token:N}}=a;u(v({user:n,token:N})),i.success("Profile Updated SuccessFully.🚀")},onError(a){console.log(a.message),i.error(a.message.replace("Validation error: ","")),x()}})};return t.jsxs("section",{className:"profile mt-8",children:[t.jsx("h2",{className:"text-4xl lg:text-6xl text-center text-accent mb-2",children:"Profile"}),t.jsxs("form",{onSubmit:p,className:"profile-form",children:[t.jsx(o,{type:"email",name:"email",label:"Email",value:s.email,handleChange:r,customClasses:"rounded-full input-lg",required:!0}),t.jsx(o,{type:"text",name:"firstName",label:"First Name",value:s.firstName,handleChange:r,customClasses:"rounded-full input-lg",required:!0}),t.jsx(o,{type:"text",name:"lastName",label:"LastName",value:s.lastName,handleChange:r,customClasses:"rounded-full input-lg",required:!0}),t.jsxs("div",{className:"mt-6 flex flex-col md:flex-row gap-3",children:[t.jsx("button",{type:"button",onClick:f,className:"btn btn-accent btn-outline rounded-full flex-1 text-xl btn-lg",children:"Reset"}),t.jsx(S,{text:"Update",isLoading:d,loadingText:"Saving Changes...",classes:"btn-success rounded-full flex-1 text-xl btn-lg"})]})]})]})},E=t.jsx(F,{});export{E as element};
