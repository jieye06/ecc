
export default {
    setSession: function(key,value){
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },
    getSession:function(key){
        return JSON.parse(window.sessionStorage.getItem(key))
    }
}