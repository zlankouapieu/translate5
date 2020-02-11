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

function translateNode(node) {
    translate(node.textContent, {from:defaultLang, to:translateLang, engine: "yandex", key:"trnsl.1.1.20200210T173804Z.9d1bb553371da5f4.47d506e56eaa9e6baafe79e422fa764bd13781df"}).then(
        (res) => {
          node.textContent = res
        }
    )
}

function getChilds(node) {
    
    
    if ((node.childNodes.length === 1 && node.childNodes[0].nodeName === "#text") || node.nodeName === "#text" ) {
        translateNode(node)
    }else{
        for (const nodeItem of node.childNodes) {
            if (nodeItem.hasChildNodes) {
                nodeItem.childNodes.forEach(
                    (res) => {
                        getChilds(res)
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

var app = new Vue({
    el: appDiv,
    data:{
        options: langs,
        currentLang: translateLang
    },
    watch:{
        currentLang(newVal, oldVal){
            /** traduction en cas de moification de la langue */
            defaultLang = oldVal
            translateLang = newVal   
            main()
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


function main(){
    var event = new Event("start-translate")
    document.dispatchEvent(event)
    for (const item of document.childNodes) {
        getChilds(document)      
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

main()