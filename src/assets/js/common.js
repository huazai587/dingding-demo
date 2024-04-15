import router from '../../router/index.js'
import moment from 'moment';
export default {
  // 路由跳转
  changeView(url, queryParams) {
    router.push({
      path: url,
      query: queryParams,
    })
  },
  // 时间格式化
  formattedTime(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss'); 
  },
  // 清除对象属性
  clearObj(obj){
    let emptyArr = {};
    for (let key in obj) {
      emptyArr[key] = '';
    }
    return Object.assign(obj, emptyArr)
  },
  // 转时间戳
  formateTimestamp(time) {
    const dateObject = new Date(time);
    return dateObject.getTime();
  }
}
