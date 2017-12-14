import {isObject} from './util'
import Compile from './compile'
import MVVM from './mvvm'

const vm = new MVVM({
    el: 'body',
    data () {
        return {
            msg: 'hello world'
        }
    },
    render (createElement) {
       return createElement.div(
            {class: 'container'},
            this.msg
        )
    }
})