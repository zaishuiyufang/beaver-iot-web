/**
 * 仅开发调试用，可随意修改/删除
 */
import userAPI from './user';

userAPI.getLoginUser().then(resp => {
    console.log(resp);
});
