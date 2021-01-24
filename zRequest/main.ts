/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-21 23:48:25
 * @LastEditTime: 2021-01-23 19:03:44
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}6

function isFish(animal: Cat | Fish) {
    console.log((animal as Fish).swim)
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}

console.log(isFish({name:"zpy",run(){}}))