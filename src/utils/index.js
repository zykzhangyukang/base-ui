import {formatConst, getConst} from "@/utils/dict/dict";
import {toLine} from "@/utils/tools/string";
import {getNDaysAgo} from "@/utils/tools/time";
import {downloadFile} from '@/utils/tools/download'

export default {
    install(Vue){
        Vue.prototype.$getConst = getConst;
        Vue.prototype.$formatConst = formatConst;
        Vue.prototype.$toLine = toLine;
        Vue.prototype.$getNDaysAgo = getNDaysAgo;
        Vue.prototype.$getNDaysAgo = getNDaysAgo;
        Vue.prototype.$downloadFile = downloadFile;
    }
}
