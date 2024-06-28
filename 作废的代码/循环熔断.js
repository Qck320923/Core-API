/*
From来源:plutoniumFunctions
Reason原因:Server端循环过久会超时报错，不用熔断；Client端不能获取Date.now()，无法在超时情况下熔断（运行函数会直接报错，无法检测）。
Measure对策:可以向服务端发出请求获取时间戳，但解决方法较为麻烦，请求延迟较大。
*/
/**
 * @description 循环熔断，使用时在循环体内调用
 * @param {any} condition 熔断条件，格式（可选，时间熔断/次数熔断/两者兼具）：{ startTime: 开始时的时间戳, timeout: 超时时间, cnt: 循环次数, maxCnt: 最大循环次数 }
 * @param {number|string} id 循环的标识，可选，用于检测容易卡崩网页的循环（客户端死循环不会超时停止，会导致创作端网页卡崩）。
 */
function loopBreaker(condition, id) {
    if ((condition.cnt > condition.maxCnt) || (Date.now() - condition.startTime > condition.timeout)) throw new Error(`Client Timeout Error:Loop${id ? ` ${id}` : ""} Broken!`);
}
