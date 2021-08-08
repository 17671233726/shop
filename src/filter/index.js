import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateFormat',(date,type)=>{
    return moment(date).format(type)
})