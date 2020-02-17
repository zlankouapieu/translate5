var defaultLang = "fr"
var translateLang = "en"
var langs = [
    {
        label:"Français",
        value:"fr"
    },
    {
        label:"English",
        value:"en"
    },
    {
        label:"Española",
        value:"es"
    }
]

function translateNode(node, from, to) {
    if (node.innerText) {
        translate(node.innerText, {
            from, 
            to, 
            engine: "google",//"yandex", 
            key:"AIzaSyAPiiIMRgPzpEtCkSV8My9gB-LXYEctve0" //"trnsl.1.1.20200210T173804Z.9d1bb553371da5f4.47d506e56eaa9e6baafe79e422fa764bd13781df"
            }).then(
            (res) => {
            node.textContent = res
            }
        )
    }
}

function getChilds(node, from, to) {
    
    
    if ((node.childNodes.length === 1 && node.childNodes[0].nodeName === "#text") || node.nodeName === "#text" ) {
        console.log("node translate :", node.innerText);
        
        translateNode(node, from, to)
    }else{
        for (const nodeItem of node.childNodes) {
            if (nodeItem.hasChildNodes) {
                nodeItem.childNodes.forEach(
                    (res) => {
                        getChilds(res, from, to)
                    }
                )
            }     
        }
    }
}


/** création du container de l'application vuejs */
var appDiv = document.createElement('div')
appDiv.id = "translate-app"
appDiv.textContent = "App vue"
document.body.appendChild(appDiv)



function main(from, to){
    var event = new Event("start-translate")
    document.dispatchEvent(event)
    for (const item of document.childNodes) {
        getChilds(document, from, to)      
    }
    var event = new Event("end-translate")
    document.dispatchEvent(event)
} 

document.addEventListener('start-translate', function (evt) {
    console.log("début de la trauction");
})

document.addEventListener('end-translate', function (evt) {
    console.log("fin de la trauction");
})


function onLoad(params) {
    var app = new Vue({
        el: appDiv,
        created(){
            translateLang = localStorage.getItem("lang")
            
            if (!translateLang) {
               translateLang =  navigator.language 
               if (translateLang.includes(defaultLang) !== -1) {
                   this.currentLang = defaultLang
                   
               }else{
                   //this.currentLang = 
                   langs.forEach((val) => {
                        if (translateLang.includes(val.value) !== -1) {
                            this.currentLang = val.value
                        }
                    })
               }
            }else{
                this.currentLang = translateLang
            }
        },
        destroyed(){
            
        },
        data:{
            options: langs,
            currentLang: ""
        },
        watch:{
            currentLang(newVal, oldVal){
                /** traduction en cas de moification de la langue */
                if (oldVal) {
                    defaultLang = oldVal    
                }
                
                translateLang = newVal   
                localStorage.setItem("lang", newVal)
                
                if (newVal !== defaultLang) {
                    main(defaultLang, translateLang)    
                }
            }
        },
        template:`
            <div class="bg-gray" >
                <select v-model="currentLang"   >
                    <option desabled value="">Choisir votre langue</option>
                    <option 
                    v-for="(lang,index) in options"
                    :key="''.concat(index)"
                    :value="lang.value"
                    >
                        {{lang.label}}
                    </option>
                </select>
            </div>
        `
    })
    
}